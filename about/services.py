"""Helpers de media y seed del módulo Nosotros."""

from __future__ import annotations

from django.db import transaction

from totalliving_backend.media_urls import absolute_media_url

from .models import AboutPage, TeamMember
from .seed_data import TEAM_SEED

ABOUT_TEXT_KEYS = (
    "philosophy_title",
    "philosophy_subtitle",
    "philosophy_method_closing",
    "mission_title",
    "mission_statement",
    "vision_title",
    "vision_statement",
    "team_eyebrow",
    "team_title",
    "org_eyebrow",
    "org_title",
    "cta_eyebrow",
    "cta_title",
    "cta_body",
    "cta_primary_label",
    "cta_primary_url",
    "cta_secondary_label",
    "cta_secondary_url",
)
ABOUT_LIST_KEYS = (
    "philosophy_intro_lines",
)


def resolve_image_url(request, file_field, external_url: str = "") -> str:
    uploaded = absolute_media_url(request, file_field)
    if uploaded:
        return uploaded
    return external_url or ""


@transaction.atomic
def ensure_about_page_seeded() -> AboutPage:
    page = AboutPage.load()
    if not page.content_en:
        page.content_en = {}
        page.save(update_fields=["content_en", "updated_at"])
    return page


def _pick_str(en_pack: dict[str, Any], key: str, fallback: str) -> str:
    raw = en_pack.get(key)
    if isinstance(raw, str) and raw.strip():
        return raw
    return fallback


def _pick_str_list(en_pack: dict[str, Any], key: str, fallback: list) -> list:
    raw = en_pack.get(key)
    if isinstance(raw, list) and len(raw) > 0:
        return [str(item) for item in raw if str(item).strip()]
    return list(fallback or [])


def resolve_about_payload(page: AboutPage, locale: str = "es") -> dict[str, Any]:
    base = {
        "id": page.id,
        "philosophy_title": page.philosophy_title,
        "philosophy_subtitle": page.philosophy_subtitle,
        "philosophy_intro_lines": list(page.philosophy_intro_lines or []),
        "philosophy_method_closing": page.philosophy_method_closing,
        "philosophy_pillars": list(page.philosophy_pillars or []),
        "values": list(page.values or []),
        "mission_title": page.mission_title,
        "mission_statement": page.mission_statement,
        "vision_title": page.vision_title,
        "vision_statement": page.vision_statement,
        "mission_image_url": page.mission_image and page.mission_image.url or "",
        "mission_image_external_url": page.mission_image_external_url,
        "vision_image_url": page.vision_image and page.vision_image.url or "",
        "vision_image_external_url": page.vision_image_external_url,
        "team_eyebrow": page.team_eyebrow,
        "team_title": page.team_title,
        "org_eyebrow": page.org_eyebrow,
        "org_title": page.org_title,
        "org_chart": page.org_chart,
        "cta_eyebrow": page.cta_eyebrow,
        "cta_title": page.cta_title,
        "cta_body": page.cta_body,
        "cta_primary_label": page.cta_primary_label,
        "cta_primary_url": page.cta_primary_url,
        "cta_secondary_label": page.cta_secondary_label,
        "cta_secondary_url": page.cta_secondary_url,
        "section_nav": list(page.section_nav or []),
        "content_en": page.content_en or {},
        "is_published": page.is_published,
        "updated_at": page.updated_at,
    }

    if locale != "en":
        return base

    en_pack = page.content_en if isinstance(page.content_en, dict) else {}
    resolved = dict(base)
    for key in ABOUT_TEXT_KEYS:
        resolved[key] = _pick_str(en_pack, key, base[key])
    for key in ABOUT_LIST_KEYS:
        resolved[key] = _pick_str_list(en_pack, key, base[key])
    
    en_pillars = en_pack.get("philosophy_pillars")
    if isinstance(en_pillars, list) and len(en_pillars) > 0:
        resolved["philosophy_pillars"] = en_pillars

    en_values = en_pack.get("values")
    if isinstance(en_values, list) and len(en_values) > 0:
        resolved["values"] = en_values

    return resolved


@transaction.atomic
def ensure_team_seeded() -> int:
    ensure_about_page_seeded()
    if TeamMember.objects.exists():
        return TeamMember.objects.count()

    for row in TEAM_SEED:
        TeamMember.objects.create(
            slug=row["slug"],
            name=row["name"],
            role=row["role"],
            department=row["department"],
            bio=row["bio"],
            photo_external_url=row.get("photo_external_url") or "",
            socials=list(row.get("socials") or []),
            is_published=True,
            order=row.get("order", 0),
        )
    return TeamMember.objects.count()
