"""Seed CLI del CMS de textos de desarrollos."""

from django.core.management.base import BaseCommand

from developments.services import ensure_developments_page_seeded


class Command(BaseCommand):
    help = "Asegura el singleton DevelopmentsPage con defaults."

    def handle(self, *args, **options):
        page = ensure_developments_page_seeded()
        self.stdout.write(
            self.style.SUCCESS(f"DevelopmentsPage lista (pk={page.pk})."),
        )
