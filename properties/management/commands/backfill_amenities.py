"""Rellena las amenidades de propiedades existentes desde EasyBroker.

A diferencia de ``sync_easybroker``, este comando NO re-descarga fotos ni
sobrescribe otros campos: solo consulta las ``features`` de cada propiedad en
EasyBroker y las vincula a la propiedad correspondiente en la base de datos,
creando en el catálogo las amenidades que no existan.
"""

from __future__ import annotations

import logging

from django.core.management.base import BaseCommand

from properties.easybroker.amenities import resolve_amenities
from properties.easybroker.client import EasyBrokerClient, EasyBrokerError
from properties.easybroker.mappers import extract_features
from properties.models import Property

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Vincula amenidades de EasyBroker a propiedades existentes (sin tocar fotos)."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--limit",
            type=int,
            default=None,
            help="Cantidad máxima de propiedades EasyBroker a procesar.",
        )

    def handle(self, *args, **options) -> None:
        limit = options["limit"]

        try:
            client = EasyBrokerClient()
            listings = client.iter_published_properties()
        except EasyBrokerError as exc:
            self.stdout.write(self.style.ERROR(str(exc)))
            raise SystemExit(1) from exc

        if limit is not None:
            listings = listings[:limit]

        matched = 0
        skipped = 0
        total_linked = 0
        total_created = 0
        errors: list[str] = []

        existing_ids = set(
            Property.objects.exclude(easybroker_id__isnull=True)
            .exclude(easybroker_id="")
            .values_list("easybroker_id", flat=True)
        )

        for listing in listings:
            public_id = listing.get("public_id")
            if not public_id or public_id not in existing_ids:
                skipped += 1
                continue

            try:
                detail = client.get_property(public_id)
                features = extract_features(detail)
                amenities, created = resolve_amenities(features)

                property_obj = Property.objects.get(easybroker_id=public_id)
                property_obj.amenities.set(amenities)

                matched += 1
                total_linked += len(amenities)
                total_created += len(created)

                self.stdout.write(
                    f"  {public_id}: {len(amenities)} amenidades "
                    f"({len(created)} nuevas)."
                )
            except Exception as exc:  # noqa: BLE001 — reportar por propiedad
                logger.exception("Error en amenidades de %s", public_id)
                errors.append(f"{public_id}: {exc}")

        self.stdout.write(
            self.style.SUCCESS(
                f"Backfill finalizado: {matched} propiedades actualizadas, "
                f"{skipped} omitidas. Amenidades: {total_linked} vinculadas, "
                f"{total_created} nuevas creadas."
            )
        )

        for error in errors:
            self.stdout.write(self.style.ERROR(error))
