"""Helpers de media y seed del módulo zonas."""

from __future__ import annotations

from django.db import transaction

from totalliving_backend.media_urls import absolute_media_url

from .models import Zone, ZonesPage
from .seed_data import ZONE_SEED


def resolve_image_url(request, file_field, external_url: str = "") -> str:
    uploaded = absolute_media_url(request, file_field)
    if uploaded:
        return uploaded
    return external_url or ""


@transaction.atomic
def ensure_zones_page_seeded() -> ZonesPage:
    return ZonesPage.load()


@transaction.atomic
def ensure_zones_seeded() -> int:
    """Crea las zonas del seed si la tabla está vacía. Devuelve cuántas hay."""
    ensure_zones_page_seeded()
    if Zone.objects.exists():
        return Zone.objects.count()

    for index, row in enumerate(ZONE_SEED):
        Zone.objects.create(
            slug=row["slug"],
            name=row["name"],
            growth_label=row["growth_label"],
            description=row["description"],
            sub_zones=list(row["sub_zones"]),
            image_external_url=row["image_external_url"],
            is_published=True,
            order=index,
        )
    return Zone.objects.count()
