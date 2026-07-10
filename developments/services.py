"""Helpers de media y seed del módulo desarrollos."""

from __future__ import annotations

from django.db import transaction

from .models import DevelopmentsPage


def absolute_media_url(request, file_field) -> str | None:
    if not file_field:
        return None
    url = file_field.url
    if request is None:
        return url
    return request.build_absolute_uri(url)


def resolve_image_url(request, file_field, external_url: str = "") -> str:
    uploaded = absolute_media_url(request, file_field)
    if uploaded:
        return uploaded
    return external_url or ""


@transaction.atomic
def ensure_developments_page_seeded() -> DevelopmentsPage:
    return DevelopmentsPage.load()
