"""Sube archivos de MEDIA_ROOT al bucket S3/R2 (django-storages).

Uso:
  python manage.py sync_media_to_s3
  python manage.py sync_media_to_s3 --dry-run
  python manage.py sync_media_to_s3 --skip-existing
"""

from __future__ import annotations

import mimetypes
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Sincroniza MEDIA_ROOT local hacia el bucket S3 (prefijo AWS_LOCATION)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Solo cuenta lo que se subiría, sin subir.",
        )
        parser.add_argument(
            "--skip-existing",
            action="store_true",
            help="No vuelve a subir si el objeto ya existe en S3.",
        )

    def handle(self, *args, **options):
        if not getattr(settings, "USE_S3", False):
            raise CommandError(
                "S3 no está activo. Define AWS_STORAGE_BUCKET_NAME en .env.",
            )

        root = Path(settings.MEDIA_ROOT).resolve()
        if not root.is_dir():
            raise CommandError(f"No existe MEDIA_ROOT: {root}")

        location = (getattr(settings, "AWS_LOCATION", None) or "media").strip("/")
        dry_run = options["dry_run"]
        skip_existing = options["skip_existing"]

        import boto3
        from botocore.exceptions import ClientError

        client = boto3.client(
            "s3",
            region_name=settings.AWS_S3_REGION_NAME,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
        bucket = settings.AWS_STORAGE_BUCKET_NAME

        skip_suffixes = {".svg", ".svgz"}
        files = [
            p
            for p in root.rglob("*")
            if p.is_file() and p.suffix.lower() not in skip_suffixes
        ]

        uploaded = 0
        skipped = 0
        failed = 0

        self.stdout.write(
            f"Origen: {root}\n"
            f"Destino: s3://{bucket}/{location}/\n"
            f"Archivos: {len(files)} | dry_run={dry_run} skip_existing={skip_existing}",
        )

        for index, path in enumerate(files, start=1):
            relative = path.relative_to(root).as_posix()
            key = f"{location}/{relative}"

            if skip_existing and not dry_run:
                try:
                    client.head_object(Bucket=bucket, Key=key)
                    skipped += 1
                    if index % 100 == 0 or index == len(files):
                        self.stdout.write(
                            f"  progreso {index}/{len(files)} "
                            f"(subidos={uploaded} omitidos={skipped} fallos={failed})",
                        )
                    continue
                except ClientError:
                    pass

            if dry_run:
                uploaded += 1
                if index == len(files):
                    self.stdout.write(f"  dry-run contaría ~{uploaded} subidas")
                continue

            content_type, _ = mimetypes.guess_type(str(path))
            extra = {
                "ContentType": content_type or "application/octet-stream",
                "CacheControl": "max-age=86400, public",
            }
            try:
                client.upload_file(
                    str(path),
                    bucket,
                    key,
                    ExtraArgs=extra,
                )
                uploaded += 1
            except ClientError as exc:
                failed += 1
                self.stderr.write(f"FAIL {relative}: {exc}")

            if index % 50 == 0 or index == len(files):
                self.stdout.write(
                    f"  progreso {index}/{len(files)} "
                    f"(subidos={uploaded} omitidos={skipped} fallos={failed})",
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Listo. subidos={uploaded} omitidos={skipped} fallos={failed}",
            ),
        )
        if failed:
            raise CommandError(f"{failed} archivos no se pudieron subir.")
