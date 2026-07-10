"""Re-optimiza fotos existentes en disco sin borrar registros de PropertyPhoto."""

from __future__ import annotations

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from properties.image_processing import optimize_image_bytes
from properties.models import PropertyPhoto


class Command(BaseCommand):
    help = (
        "Optimiza fotos ya guardadas (EasyBroker o dashboard) sin eliminar "
        "registros ni propiedades."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Solo reporta cuántas fotos se optimizarían, sin escribir cambios.",
        )
        parser.add_argument(
            "--property-id",
            type=int,
            default=None,
            help="Limitar a una propiedad específica.",
        )

    def handle(self, *args, **options):
        dry_run: bool = options["dry_run"]
        property_id: int | None = options["property_id"]

        queryset = PropertyPhoto.objects.select_related("property").order_by("id")
        if property_id is not None:
            queryset = queryset.filter(property_id=property_id)

        total = queryset.count()
        optimized_count = 0
        skipped_count = 0
        error_count = 0

        self.stdout.write(f"Fotos a revisar: {total}")

        for photo in queryset.iterator():
            if not photo.image:
                skipped_count += 1
                continue

            try:
                with photo.image.open("rb") as image_file:
                    original_data = image_file.read()
            except OSError as exc:
                error_count += 1
                self.stderr.write(f"  [error] foto {photo.pk}: no legible ({exc})")
                continue

            optimized = optimize_image_bytes(original_data, photo.image.name)
            optimized_data = optimized.read()
            optimized.seek(0)

            if len(optimized_data) >= len(original_data) and photo.image.name.lower().endswith(
                ".jpg",
            ):
                skipped_count += 1
                continue

            if dry_run:
                optimized_count += 1
                self.stdout.write(
                    f"  [dry-run] foto {photo.pk}: "
                    f"{len(original_data) // 1024} KB -> {len(optimized_data) // 1024} KB",
                )
                continue

            old_name = photo.image.name
            try:
                photo.image.save(optimized.name, ContentFile(optimized_data), save=False)
                photo.save(update_fields=["image"])
                if old_name != photo.image.name and photo.image.storage.exists(old_name):
                    photo.image.storage.delete(old_name)
                optimized_count += 1
                self.stdout.write(
                    f"  [ok] foto {photo.pk}: "
                    f"{len(original_data) // 1024} KB -> {len(optimized_data) // 1024} KB",
                )
            except OSError as exc:
                error_count += 1
                self.stderr.write(f"  [error] foto {photo.pk}: no se pudo guardar ({exc})")

        self.stdout.write(
            self.style.SUCCESS(
                f"Listo — optimizadas: {optimized_count}, "
                f"sin cambio: {skipped_count}, errores: {error_count}"
                + (" (dry-run)" if dry_run else ""),
            ),
        )
