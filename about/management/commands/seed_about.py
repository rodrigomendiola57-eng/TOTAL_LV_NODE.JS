from django.core.management.base import BaseCommand

from about.services import ensure_about_page_seeded, ensure_team_seeded


class Command(BaseCommand):
    help = "Siembra textos de Nosotros y el equipo Total Living."

    def handle(self, *args, **options):
        page = ensure_about_page_seeded()
        count = ensure_team_seeded()
        self.stdout.write(
            self.style.SUCCESS(
                f"AboutPage pk={page.pk} · {count} miembros de equipo.",
            ),
        )
