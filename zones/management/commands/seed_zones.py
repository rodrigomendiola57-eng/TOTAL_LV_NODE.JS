from django.core.management.base import BaseCommand

from zones.services import ensure_zones_seeded


class Command(BaseCommand):
    help = "Siembra el catálogo de zonas si la tabla está vacía."

    def handle(self, *args, **options):
        count = ensure_zones_seeded()
        self.stdout.write(self.style.SUCCESS(f"Zonas en catálogo: {count}"))
