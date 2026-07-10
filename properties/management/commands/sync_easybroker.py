"""Comando para sincronizar propiedades desde EasyBroker."""

from __future__ import annotations

from django.core.management.base import BaseCommand

from properties.easybroker.sync import sync_properties_from_easybroker


class Command(BaseCommand):
    help = "Sincroniza propiedades publicadas desde EasyBroker."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--limit",
            type=int,
            default=None,
            help="Cantidad máxima de propiedades a sincronizar (útil para pruebas).",
        )

    def handle(self, *args, **options) -> None:
        limit = options["limit"]
        result = sync_properties_from_easybroker(limit=limit)

        self.stdout.write(
            self.style.SUCCESS(
                f"Sync finalizada: {result.created} creadas, "
                f"{result.updated} actualizadas, {result.skipped} omitidas. "
                f"Amenidades: {result.amenities_linked} vinculadas, "
                f"{result.amenities_created} nuevas."
            )
        )

        for error in result.errors:
            self.stdout.write(self.style.ERROR(error))

        if result.errors and result.total_processed == 0:
            raise SystemExit(1)
