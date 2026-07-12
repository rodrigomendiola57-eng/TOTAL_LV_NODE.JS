"""Validación unificada de imágenes subidas al CMS / catálogo.

No permite SVG (XSS stored). Los logos estáticos en /public no pasan por aquí.
"""

from __future__ import annotations

import os

from django.core.exceptions import ValidationError
from PIL import Image

ALLOWED_IMAGE_EXTENSIONS = frozenset(
    {
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
    }
)

ALLOWED_IMAGE_CONTENT_TYPES = frozenset(
    {
        "image/jpeg",
        "image/jpg",
        "image/pjpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/bmp",
        "image/tiff",
        "image/heic",
        "image/heif",
        "image/avif",
    }
)

BLOCKED_EXTENSIONS = frozenset({".svg", ".svgz"})
BLOCKED_CONTENT_TYPES = frozenset(
    {
        "image/svg+xml",
        "image/svg",
        "text/xml",
        "application/xml",
    }
)

MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB


def _extension(name: str) -> str:
    return os.path.splitext(name or "")[1].lower()


def validate_cms_image(uploaded_file) -> None:
    """
    Extensión, content-type, tamaño y verificación Pillow.
    Lanza django.core.exceptions.ValidationError.
    """
    size = getattr(uploaded_file, "size", None)
    if size is not None and size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError(
            f"La imagen supera el tamaño máximo de {MAX_IMAGE_SIZE_BYTES // (1024 * 1024)} MB.",
        )

    name = getattr(uploaded_file, "name", "") or ""
    extension = _extension(name)
    content_type = (getattr(uploaded_file, "content_type", None) or "").lower().strip()

    if extension in BLOCKED_EXTENSIONS or content_type in BLOCKED_CONTENT_TYPES:
        raise ValidationError(
            "SVG no está permitido por seguridad. Usa JPG, PNG o WebP.",
        )

    if extension and extension not in ALLOWED_IMAGE_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_IMAGE_EXTENSIONS))
        raise ValidationError(
            f"Formato no permitido ({extension}). Usa: {allowed}.",
        )

    if content_type and content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
        # Algunos clientes no envían content-type; solo fallar si viene y es inválido.
        if content_type.startswith("image/") or content_type in BLOCKED_CONTENT_TYPES:
            raise ValidationError(
                "Formato no permitido. Usa JPG, PNG, WebP u otra imagen raster admitida.",
            )

    if not extension and not content_type:
        raise ValidationError("No se pudo determinar el tipo de imagen.")

    # Verificar bytes con Pillow (SVG ya bloqueado arriba).
    position = uploaded_file.tell() if hasattr(uploaded_file, "tell") else 0
    try:
        with Image.open(uploaded_file) as image:
            image.verify()
    except Exception as exc:
        raise ValidationError("El archivo no es una imagen válida.") from exc
    finally:
        if hasattr(uploaded_file, "seek"):
            uploaded_file.seek(position)


def upload_image_error(uploaded_file) -> str | None:
    """Devuelve mensaje de error o None si la imagen es válida."""
    try:
        validate_cms_image(uploaded_file)
    except ValidationError as exc:
        if getattr(exc, "messages", None):
            return "; ".join(str(m) for m in exc.messages)
        return str(exc)
    return None
