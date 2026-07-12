"""Helpers de URL de media (disco local o S3/R2)."""

from __future__ import annotations


def absolute_media_url(request, file_field) -> str | None:
    """
    Devuelve la URL pública del FileField/ImageField.
    Si ya es absoluta (S3/CDN), no la reescribe con el host de Django.
    """
    if not file_field:
        return None
    url = file_field.url
    if isinstance(url, str) and (
        url.startswith("http://") or url.startswith("https://")
    ):
        return url
    if request is not None:
        return request.build_absolute_uri(url)
    return url
