"""Sincronización de propiedades desde EasyBroker."""

from __future__ import annotations

import logging
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime

from django.core.files.base import ContentFile
from django.db import transaction
from django.utils import timezone

from properties.easybroker.amenities import resolve_amenities
from properties.easybroker.client import EasyBrokerClient, EasyBrokerError
from properties.easybroker.mappers import (
    extract_features,
    extract_image_urls,
    map_property_fields,
)
from properties.image_processing import optimize_image_bytes
from properties.models import Property, PropertyPhoto

logger = logging.getLogger(__name__)


@dataclass
class SyncResult:
    created: int = 0
    updated: int = 0
    skipped: int = 0
    amenities_linked: int = 0
    amenities_created: int = 0
    errors: list[str] = field(default_factory=list)

    @property
    def total_processed(self) -> int:
        return self.created + self.updated + self.skipped


def _download_image(url: str) -> ContentFile:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "TotalLiving/1.0"},
        method="GET",
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read()

    filename = url.split("/")[-1].split("?")[0] or "photo.jpg"
    return optimize_image_bytes(data, filename)


def _sync_photos(property_obj: Property, image_urls: list[str]) -> None:
    property_obj.photos.all().delete()

    for index, url in enumerate(image_urls):
        try:
            content = _download_image(url)
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            logger.warning("No se pudo descargar foto %s: %s", url, exc)
            continue

        PropertyPhoto.objects.create(
            property=property_obj,
            image=content,
            order=index,
            is_cover=index == 0,
            alt_text=property_obj.title,
        )


@transaction.atomic
def _upsert_property(public_id: str, detail: dict) -> tuple[Property, bool, int, int]:
    fields = map_property_fields(detail)
    location = fields.pop("location")

    if location is None:
        raise ValueError("La propiedad no tiene coordenadas en EasyBroker.")

    try:
        property_obj = Property.objects.get(easybroker_id=public_id)
        created = False
    except Property.DoesNotExist:
        property_obj = Property(easybroker_id=public_id)
        created = True

    for key, value in fields.items():
        setattr(property_obj, key, value)

    property_obj.location = location
    property_obj.easybroker_synced_at = timezone.now()
    property_obj.save()

    amenities, new_amenities = resolve_amenities(extract_features(detail))
    property_obj.amenities.set(amenities)

    image_urls = extract_image_urls(detail)
    if image_urls:
        _sync_photos(property_obj, image_urls)

    return property_obj, created, len(amenities), len(new_amenities)


def sync_properties_from_easybroker(*, limit: int | None = None) -> SyncResult:
    result = SyncResult()

    try:
        client = EasyBrokerClient()
        listings = client.iter_published_properties()
    except EasyBrokerError as exc:
        result.errors.append(str(exc))
        return result

    if limit is not None:
        listings = listings[:limit]

    for listing in listings:
        public_id = listing.get("public_id")
        if not public_id:
            result.skipped += 1
            continue

        try:
            detail = client.get_property(public_id)
            _, created, linked, new_amenities = _upsert_property(public_id, detail)
            if created:
                result.created += 1
            else:
                result.updated += 1
            result.amenities_linked += linked
            result.amenities_created += new_amenities
        except Exception as exc:  # noqa: BLE001 — reportar por propiedad sin abortar todo
            logger.exception("Error sincronizando %s", public_id)
            result.errors.append(f"{public_id}: {exc}")

    return result
