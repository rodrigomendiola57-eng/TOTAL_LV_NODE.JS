"""Validación de videos subidos al CMS (hero, journal, etc.).

Con S3 activo (AWS_STORAGE_BUCKET_NAME), FileField usa el storage default.
"""

from __future__ import annotations

import os

from django.core.exceptions import ValidationError

ALLOWED_VIDEO_EXTENSIONS = frozenset({".mp4", ".webm", ".mov", ".m4v"})

ALLOWED_VIDEO_CONTENT_TYPES = frozenset(
    {
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/x-m4v",
        "application/octet-stream",  # algunos clientes no envían video/*
    }
)

# Reels / Stories suelen pesar; tope razonable para panel + S3.
MAX_VIDEO_SIZE_BYTES = 120 * 1024 * 1024  # 120 MB


def _extension(name: str) -> str:
    return os.path.splitext(name or "")[1].lower()


def validate_cms_video(uploaded_file) -> None:
    """
    Extensión, content-type y tamaño.
    Lanza django.core.exceptions.ValidationError.
    """
    size = getattr(uploaded_file, "size", None)
    if size is not None and size > MAX_VIDEO_SIZE_BYTES:
        raise ValidationError(
            f"El video supera el tamaño máximo de "
            f"{MAX_VIDEO_SIZE_BYTES // (1024 * 1024)} MB.",
        )

    name = getattr(uploaded_file, "name", "") or ""
    extension = _extension(name)
    content_type = (getattr(uploaded_file, "content_type", None) or "").lower().strip()

    if extension and extension not in ALLOWED_VIDEO_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_VIDEO_EXTENSIONS))
        raise ValidationError(
            f"Formato de video no permitido ({extension}). Usa: {allowed}.",
        )

    if content_type and content_type not in ALLOWED_VIDEO_CONTENT_TYPES:
        if content_type.startswith("video/"):
            raise ValidationError(
                "Formato de video no permitido. Usa MP4, WebM o MOV.",
            )
        if not content_type.startswith("application/"):
            raise ValidationError(
                "El archivo no parece un video válido (MP4 / WebM / MOV).",
            )

    if not extension and not content_type:
        raise ValidationError("No se pudo determinar el tipo de video.")
