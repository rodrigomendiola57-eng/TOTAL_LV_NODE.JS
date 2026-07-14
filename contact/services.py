"""Helpers de seed y resolución i18n del módulo Contacto."""

from __future__ import annotations

from copy import deepcopy
from typing import Any

from django.db import transaction

from .defaults_en import CONTACT_PAGE_EN_DEFAULTS
from .models import ContactPage

# Claves de texto que pueden vivir en content_en.
CONTACT_TEXT_KEYS = (
    "hero_eyebrow",
    "hero_title",
    "hero_description",
    "form_title",
    "form_description",
    "form_name_label",
    "form_name_placeholder",
    "form_phone_label",
    "form_phone_hint",
    "form_phone_placeholder",
    "form_email_label",
    "form_email_placeholder",
    "form_message_label",
    "form_message_placeholder",
    "form_quick_prompts_label",
    "form_submit_label",
    "form_submitting_label",
    "form_success_title",
    "form_success_message",
    "form_reset_label",
    "reassurance_title",
    "reassurance_footer",
    "property_banner_label",
    "property_banner_cta",
    "property_form_label",
    "seo_title",
    "seo_description",
)

CONTACT_LIST_KEYS = (
    "form_quick_prompts",
    "reassurance_items",
)


@transaction.atomic
def ensure_contact_page_seeded() -> ContactPage:
    page = ContactPage.load()
    # Backfill EN si el registro existía antes de content_en.
    if not page.content_en:
        page.content_en = dict(CONTACT_PAGE_EN_DEFAULTS)
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


def _pick_channels(en_pack: dict[str, Any], fallback: list) -> list:
    raw = en_pack.get("channels")
    if not isinstance(raw, list) or len(raw) == 0:
        return deepcopy(fallback or [])
    return deepcopy(raw)


def resolve_contact_payload(page: ContactPage, locale: str = "es") -> dict[str, Any]:
    """
    Devuelve el shape plano del serializer (sin content_en),
    con textos en `locale`. EN vacío → fallback ES.
    """
    base = {
        "id": page.id,
        "hero_eyebrow": page.hero_eyebrow,
        "hero_title": page.hero_title,
        "hero_description": page.hero_description,
        "channels": deepcopy(page.channels or []),
        "form_title": page.form_title,
        "form_description": page.form_description,
        "form_name_label": page.form_name_label,
        "form_name_placeholder": page.form_name_placeholder,
        "form_phone_label": page.form_phone_label,
        "form_phone_hint": page.form_phone_hint,
        "form_phone_placeholder": page.form_phone_placeholder,
        "form_email_label": page.form_email_label,
        "form_email_placeholder": page.form_email_placeholder,
        "form_message_label": page.form_message_label,
        "form_message_placeholder": page.form_message_placeholder,
        "form_quick_prompts_label": page.form_quick_prompts_label,
        "form_quick_prompts": list(page.form_quick_prompts or []),
        "form_submit_label": page.form_submit_label,
        "form_submitting_label": page.form_submitting_label,
        "form_success_title": page.form_success_title,
        "form_success_message": page.form_success_message,
        "form_reset_label": page.form_reset_label,
        "reassurance_title": page.reassurance_title,
        "reassurance_items": list(page.reassurance_items or []),
        "reassurance_footer": page.reassurance_footer,
        "property_banner_label": page.property_banner_label,
        "property_banner_cta": page.property_banner_cta,
        "property_form_label": page.property_form_label,
        "seo_title": page.seo_title,
        "seo_description": page.seo_description,
        "is_published": page.is_published,
        "updated_at": page.updated_at,
    }

    if locale != "en":
        return base

    en_pack = page.content_en if isinstance(page.content_en, dict) else {}
    resolved = dict(base)
    for key in CONTACT_TEXT_KEYS:
        resolved[key] = _pick_str(en_pack, key, base[key])
    for key in CONTACT_LIST_KEYS:
        resolved[key] = _pick_str_list(en_pack, key, base[key])
    resolved["channels"] = _pick_channels(en_pack, base["channels"])
    return resolved
