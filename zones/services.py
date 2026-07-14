"""Helpers de media y seed del módulo zonas."""

from __future__ import annotations

from django.db import transaction

from totalliving_backend.media_urls import absolute_media_url

from .models import Zone, ZonesPage
from .seed_data import ZONE_SEED

ZONE_TEXT_KEYS = (
    "hero_eyebrow",
    "hero_title",
    "hero_subtitle",
)


def resolve_image_url(request, file_field, external_url: str = "") -> str:
    uploaded = absolute_media_url(request, file_field)
    if uploaded:
        return uploaded
    return external_url or ""


@transaction.atomic
def ensure_zones_page_seeded() -> ZonesPage:
    page = ZonesPage.load()
    if not page.content_en:
        page.content_en = {}
        page.save(update_fields=["content_en", "updated_at"])
    return page


def _pick_str(en_pack: dict[str, object], key: str, fallback: str) -> str:
    raw = en_pack.get(key)
    if isinstance(raw, str) and raw.strip():
        return raw
    return fallback


def resolve_zones_payload(page: ZonesPage, locale: str = "es") -> dict[str, object]:
    base = {
        "id": page.id,
        "hero_eyebrow": page.hero_eyebrow,
        "hero_title": page.hero_title,
        "hero_subtitle": page.hero_subtitle,
        "hero_image_url": page.hero_image and page.hero_image.url or "",
        "hero_image_external_url": page.hero_image_external_url,
        "scroll_hint": page.scroll_hint,
        "content_en": page.content_en or {},
        "is_published": page.is_published,
        "updated_at": page.updated_at,
    }
    if locale != "en":
        return base
    en_pack = page.content_en if isinstance(page.content_en, dict) else {}
    return {
        **base,
        "hero_eyebrow": _pick_str(en_pack, "hero_eyebrow", base["hero_eyebrow"]),
        "hero_title": _pick_str(en_pack, "hero_title", base["hero_title"]),
        "hero_subtitle": _pick_str(en_pack, "hero_subtitle", base["hero_subtitle"]),
    }


@transaction.atomic
def ensure_zones_seeded() -> int:
    """Crea las zonas del seed si la tabla está vacía. Devuelve cuántas hay."""
    ensure_zones_page_seeded()
    if Zone.objects.exists():
        return Zone.objects.count()

    for index, row in enumerate(ZONE_SEED):
        Zone.objects.create(
            slug=row["slug"],
            name=row["name"],
            growth_label=row["growth_label"],
            description=row["description"],
            sub_zones=list(row["sub_zones"]),
            image_external_url=row["image_external_url"],
            is_published=True,
            order=index,
        )
    return Zone.objects.count()
