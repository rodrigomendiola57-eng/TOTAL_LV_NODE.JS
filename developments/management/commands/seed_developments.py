"""Siembra los desarrollos de ejemplo (antes mock del frontend) en la BD."""

from __future__ import annotations

from django.core.management.base import BaseCommand
from django.db import transaction

from developments.models import (
    Development,
    DevelopmentFloorPlan,
    DevelopmentGalleryImage,
    DevelopmentModelImage,
    DevelopmentUnitModel,
)
from developments.seed_data import SEED_DEVELOPMENTS
from developments.services import ensure_developments_page_seeded


class Command(BaseCommand):
    help = (
        "Inserta/actualiza los desarrollos de ejemplo con modelos, "
        "galerías y plantas (URLs externas)."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Borra todos los desarrollos antes de sembrar.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        ensure_developments_page_seeded()

        if options["reset"]:
            deleted, _ = Development.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Eliminados {deleted} objetos."))

        created = 0
        updated = 0

        for index, raw in enumerate(SEED_DEVELOPMENTS):
            payload = dict(raw)
            models_data = list(payload.pop("models", []))
            gallery_urls = list(payload.pop("gallery", []))

            development, was_created = Development.objects.update_or_create(
                slug=payload["slug"],
                defaults={**payload, "order": payload.get("order", index)},
            )

            if was_created:
                created += 1
            else:
                updated += 1
                development.gallery_images.all().delete()
                development.unit_models.all().delete()

            for order, url in enumerate(gallery_urls):
                if not url:
                    continue
                DevelopmentGalleryImage.objects.create(
                    development=development,
                    external_url=url,
                    order=order,
                )

            for model_raw in models_data:
                model_payload = dict(model_raw)
                model_gallery = list(model_payload.pop("gallery", []))
                floor_plans = list(model_payload.pop("floor_plans", []))
                unit = DevelopmentUnitModel.objects.create(
                    development=development,
                    **model_payload,
                )
                # Si el seed no trae galería, usa portada + fotos del desarrollo.
                if not model_gallery:
                    if unit.cover_image_external_url:
                        model_gallery.append(unit.cover_image_external_url)
                    for url in gallery_urls:
                        if url and url not in model_gallery:
                            model_gallery.append(url)
                        if len(model_gallery) >= 5:
                            break
                for order, url in enumerate(model_gallery):
                    DevelopmentModelImage.objects.create(
                        unit_model=unit,
                        external_url=url,
                        order=order,
                    )
                for order, plan in enumerate(floor_plans):
                    DevelopmentFloorPlan.objects.create(
                        unit_model=unit,
                        label=plan.get("label") or "Planta",
                        external_url=plan.get("image") or "",
                        order=order,
                    )

            self.stdout.write(f"  · {development.name} ({len(models_data)} modelos)")

        self.stdout.write(
            self.style.SUCCESS(
                f"Listo: {created} creados, {updated} actualizados. "
                f"Total en BD: {Development.objects.count()}.",
            ),
        )
