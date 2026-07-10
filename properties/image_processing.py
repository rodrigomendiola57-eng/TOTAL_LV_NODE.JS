"""Optimización segura de imágenes con Pillow para el catálogo web."""

from __future__ import annotations

import logging
import os
from io import BytesIO

from django.core.files.base import ContentFile
from PIL import Image, ImageOps

logger = logging.getLogger(__name__)

MAX_SIDE_PX = 1920
JPEG_QUALITY = 85
JPEG_OPTIMIZE = True
SKIP_EXTENSIONS = {".svg"}


def build_optimized_filename(original_name: str) -> str:
    stem = os.path.splitext(os.path.basename(original_name or "photo"))[0]
    return f"{stem}.jpg"


def _to_rgb(image: Image.Image) -> Image.Image:
    if image.mode in ("RGBA", "LA", "P"):
        background = Image.new("RGB", image.size, (255, 255, 255))
        converted = image.convert("RGBA") if image.mode != "RGBA" else image
        background.paste(converted, mask=converted.split()[-1])
        return background
    if image.mode != "RGB":
        return image.convert("RGB")
    return image


def optimize_image_bytes(data: bytes, original_name: str = "photo.jpg") -> ContentFile:
    """
    Redimensiona, corrige orientación EXIF y comprime a JPEG.
    Si falla, devuelve el archivo original sin modificar.
    """
    extension = os.path.splitext(original_name)[1].lower()
    if extension in SKIP_EXTENSIONS:
        return ContentFile(data, name=original_name)

    try:
        with Image.open(BytesIO(data)) as image:
            image = ImageOps.exif_transpose(image)
            image = _to_rgb(image)

            width, height = image.size
            longest = max(width, height)
            if longest > MAX_SIDE_PX:
                scale = MAX_SIDE_PX / longest
                new_size = (max(1, int(width * scale)), max(1, int(height * scale)))
                image = image.resize(new_size, Image.Resampling.LANCZOS)

            buffer = BytesIO()
            image.save(
                buffer,
                format="JPEG",
                quality=JPEG_QUALITY,
                optimize=JPEG_OPTIMIZE,
                progressive=True,
            )
            buffer.seek(0)
            optimized = buffer.getvalue()

        if not optimized:
            return ContentFile(data, name=original_name)

        return ContentFile(optimized, name=build_optimized_filename(original_name))
    except Exception:
        logger.warning(
            "No se pudo optimizar %s; se conserva el original.",
            original_name,
            exc_info=True,
        )
        return ContentFile(data, name=original_name)


def optimize_uploaded_file(uploaded_file) -> ContentFile:
    """Lee un archivo subido, lo optimiza y devuelve un ContentFile listo para guardar."""
    original_name = getattr(uploaded_file, "name", "photo.jpg")
    position = uploaded_file.tell() if hasattr(uploaded_file, "tell") else 0

    try:
        data = uploaded_file.read()
    finally:
        if hasattr(uploaded_file, "seek"):
            uploaded_file.seek(position)

    return optimize_image_bytes(data, original_name)
