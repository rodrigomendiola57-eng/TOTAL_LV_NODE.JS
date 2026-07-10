"""Validadores de archivos para contenido del sitio."""

from __future__ import annotations

from django.core.exceptions import ValidationError

ALLOWED_IMAGE_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}
MAX_IMAGE_SIZE_BYTES = 12 * 1024 * 1024  # 12 MB


def validate_home_image(upload) -> None:
    content_type = getattr(upload, "content_type", None)
    if content_type and content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
        raise ValidationError(
            "Formato no permitido. Usa JPG, PNG o WebP.",
            code="invalid_image_type",
        )

    size = getattr(upload, "size", None)
    if size and size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError(
            "La imagen supera el tamaño máximo de 12 MB.",
            code="image_too_large",
        )
