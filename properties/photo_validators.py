"""Validación de archivos de imagen para fotos de propiedades."""

from __future__ import annotations

from totalliving_backend.image_uploads import (  # noqa: F401 — reexport
    ALLOWED_IMAGE_EXTENSIONS,
    MAX_IMAGE_SIZE_BYTES,
    validate_cms_image as validate_property_image,
)
