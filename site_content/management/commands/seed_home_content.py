from django.core.management.base import BaseCommand

from site_content.services import ensure_home_content_seeded


class Command(BaseCommand):
    help = "Crea o completa el contenido por defecto de la página de inicio."

    def handle(self, *args, **options):
        home = ensure_home_content_seeded()
        self.stdout.write(
            self.style.SUCCESS(
                f"Contenido de inicio listo (pk={home.pk}, publicado={home.is_published}).",
            ),
        )
