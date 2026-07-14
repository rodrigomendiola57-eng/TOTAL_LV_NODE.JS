"""Validadores de archivos para contenido del sitio (home)."""

from __future__ import annotations

from totalliving_backend.image_uploads import validate_cms_image as validate_home_image
from totalliving_backend.video_uploads import validate_cms_video as validate_home_video

__all__ = ["validate_home_image", "validate_home_video"]
