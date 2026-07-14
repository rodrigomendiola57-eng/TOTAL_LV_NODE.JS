"""Helpers de media y seed del módulo Asesoría."""

from __future__ import annotations

from django.db import transaction

from totalliving_backend.media_urls import absolute_media_url

from .models import AsesoriaPage


from typing import Any

ASESORIA_TEXT_KEYS = (
    "hero_eyebrow",
    "hero_title",
    "hero_subtitle",
    "services_title",
    "cta_title",
    "cta_subtitle",
    "cta_label",
    "cta_whatsapp_message",
)


def resolve_image_url(request, file_field, external_url: str = "") -> str:
    uploaded = absolute_media_url(request, file_field)
    if uploaded:
        return uploaded
    return external_url or ""


@transaction.atomic
def ensure_asesoria_page_seeded() -> AsesoriaPage:
    return AsesoriaPage.load()


def _pick_str(en_pack: dict[str, Any], key: str, fallback: str) -> str:
    raw = en_pack.get(key)
    if isinstance(raw, str) and raw.strip():
        return raw
    return fallback


def resolve_asesoria_payload(page: AsesoriaPage, locale: str = "es", request=None) -> dict[str, Any]:
    base = {
        "id": page.id,
        "hero_eyebrow": page.hero_eyebrow,
        "hero_title": page.hero_title,
        "hero_subtitle": page.hero_subtitle,
        "hero_image_url": resolve_image_url(request, page.hero_image, page.hero_image_external_url),
        "hero_image_external_url": page.hero_image_external_url,
        "services_title": page.services_title,
        "tabs": list(page.tabs or []),
        "pillars": list(page.pillars or []),
        "cta_title": page.cta_title,
        "cta_subtitle": page.cta_subtitle,
        "cta_label": page.cta_label,
        "cta_whatsapp_message": page.cta_whatsapp_message,
        "content_en": page.content_en or {},
        "is_published": page.is_published,
        "updated_at": page.updated_at,
    }
    if locale != "en":
        return base

    en_pack = page.content_en if isinstance(page.content_en, dict) else {}
    resolved = dict(base)
    for key in ASESORIA_TEXT_KEYS:
        resolved[key] = _pick_str(en_pack, key, base[key])

    en_tabs = en_pack.get("tabs")
    if isinstance(en_tabs, list) and len(en_tabs) > 0:
        resolved["tabs"] = en_tabs

    en_pillars = en_pack.get("pillars")
    if isinstance(en_pillars, list) and len(en_pillars) > 0:
        resolved["pillars"] = en_pillars

    return resolved
