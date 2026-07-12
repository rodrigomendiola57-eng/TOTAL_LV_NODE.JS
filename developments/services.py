"""Helpers de media y seed del módulo desarrollos."""

from __future__ import annotations

from django.db import transaction

from totalliving_backend.media_urls import absolute_media_url

from .models import DevelopmentsPage


def resolve_image_url(request, file_field, external_url: str = "") -> str:
    uploaded = absolute_media_url(request, file_field)
    if uploaded:
        return uploaded
    return external_url or ""


@transaction.atomic
def ensure_developments_page_seeded() -> DevelopmentsPage:
    return DevelopmentsPage.load()
