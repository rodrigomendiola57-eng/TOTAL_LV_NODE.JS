"""Sube videos locales de inicio a S3 (hero + posts del feed).

Uso:
  python manage.py sync_home_videos_to_s3
  python manage.py sync_home_videos_to_s3 --force
"""

from __future__ import annotations

from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand, CommandError

from site_content.models import HomeJournalPost, HomePage
from site_content.services import ensure_home_content_seeded

DEFAULT_VIDEO = Path("public/videos/asesoria-hero.mp4")


class Command(BaseCommand):
    help = (
        "Sube el video local del hero/feed a S3 (o MEDIA_ROOT) y lo asigna "
        "a HomePage.hero_video y a posts journal tipo video."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            type=str,
            default=str(DEFAULT_VIDEO),
            help="Ruta al mp4 local (default: public/videos/asesoria-hero.mp4)",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Reemplaza hero_video / videos de journal aunque ya existan",
        )

    def handle(self, *args, **options):
        if not getattr(settings, "USE_S3", False):
            self.stdout.write(
                self.style.WARNING(
                    "USE_S3=False: el archivo irá a MEDIA_ROOT local, no al bucket.",
                ),
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"S3 activo -> bucket {settings.AWS_STORAGE_BUCKET_NAME}",
                ),
            )

        path = Path(options["file"])
        if not path.is_file():
            raise CommandError(f"No existe el archivo: {path.resolve()}")

        force = bool(options["force"])
        home = ensure_home_content_seeded()

        if home.hero_video and not force:
            self.stdout.write(
                f"Hero ya tiene video ({home.hero_video.name}). "
                "Usa --force para reemplazar.",
            )
        else:
            with path.open("rb") as handle:
                home.hero_video.save(
                    path.name,
                    File(handle),
                    save=True,
                )
            self.stdout.write(
                self.style.SUCCESS(f"Hero video -> {home.hero_video.url}"),
            )

        # Asegura al menos un post video en el feed
        video_posts = list(
            HomeJournalPost.objects.filter(home_page=home, kind="video"),
        )
        if not video_posts:
            video_posts = [
                HomeJournalPost.objects.create(
                    home_page=home,
                    kind="video",
                    category="Capacitación",
                    title="En la Notaría 31-69",
                    body=(
                        "El equipo Total Living reforzó aspectos notariales, "
                        "jurídicos y fiscales."
                    ),
                    date_label="Hoy",
                    order=0,
                    is_active=True,
                ),
                HomeJournalPost.objects.create(
                    home_page=home,
                    kind="video",
                    category="Recorrido",
                    title="Atmósfera premium",
                    body=(
                        "Así presentamos residencias: luz, material y detalle."
                    ),
                    date_label="3 d",
                    order=1,
                    is_active=True,
                ),
            ]
            self.stdout.write("Creados posts journal tipo video.")

        for post in video_posts:
            if post.video and not force:
                self.stdout.write(
                    f"Post #{post.id} ya tiene video ({post.video.name}).",
                )
                continue
            with path.open("rb") as handle:
                post.video.save(path.name, File(handle), save=True)
            self.stdout.write(
                self.style.SUCCESS(
                    f"Journal #{post.id} -> {post.video.url}",
                ),
            )

        # Refresco
        home = HomePage.objects.get(pk=home.pk)
        self.stdout.write("")
        self.stdout.write(self.style.NOTICE("URLs públicas:"))
        self.stdout.write(f"  hero: {home.hero_video.url if home.hero_video else '—'}")
        for post in HomeJournalPost.objects.filter(home_page=home, kind="video"):
            self.stdout.write(
                f"  journal #{post.id}: {post.video.url if post.video else '—'}",
            )
