"""Validación de archivos de imagen para fotos de propiedades."""

from __future__ import annotations

import os

from django.core.exceptions import ValidationError
from PIL import Image

ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".jpe",
    ".png",
    ".webp",
    ".gif",
    ".bmp",
    ".tif",
    ".tiff",
    ".heic",
    ".heif",
    ".avif",
    ".svg",
}

MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB


def validate_property_image(uploaded_file) -> None:
    """Valida extensión, tamaño y que Pillow pueda leer la imagen."""
    if uploaded_file.size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError(
            f"La imagen supera el tamaño máximo de {MAX_IMAGE_SIZE_BYTES // (1024 * 1024)} MB.",
        )

    extension = os.path.splitext(uploaded_file.name)[1].lower()
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_IMAGE_EXTENSIONS))
        raise ValidationError(
            f"Formato no permitido ({extension or 'sin extensión'}). Usa: {allowed}.",
        )

    if extension == ".svg":
        return

    position = uploaded_file.tell()
    try:
        with Image.open(uploaded_file) as image:
            image.verify()
    except Exception as exc:
        raise ValidationError("El archivo no es una imagen válida.") from exc
    finally:
        uploaded_file.seek(position)
