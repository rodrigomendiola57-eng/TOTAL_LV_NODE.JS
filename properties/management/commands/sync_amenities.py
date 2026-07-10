"""Sincroniza el catálogo de amenidades desde amenities_data.py."""

from __future__ import annotations

from django.core.management.base import BaseCommand

from properties.amenities_data import iter_seed_rows
from properties.models import Amenity


class Command(BaseCommand):
    help = "Crea o actualiza el catálogo de amenidades (idempotente)."

    def handle(self, *args, **options):
        created = 0
        updated = 0
        for row in iter_seed_rows():
            _, was_created = Amenity.objects.update_or_create(
                slug=row["slug"],
                defaults={
                    "name": row["name"],
                    "category": row["category"],
                    "icon": row["icon"],
                    "order": row["order"],
                    "is_active": True,
                },
            )
            if was_created:
                created += 1
            else:
                updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Amenidades sincronizadas: {created} creadas, {updated} actualizadas."
            )
        )
