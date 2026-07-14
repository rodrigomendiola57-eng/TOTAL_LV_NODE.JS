"""Serializers del módulo Contacto."""

from __future__ import annotations

from rest_framework import serializers

from .models import ContactPage
from .services import CONTACT_LIST_KEYS, CONTACT_TEXT_KEYS

ALLOWED_CHANNEL_IDS = frozenset({"whatsapp", "email", "location"})


def _clean_channels(value):
    if value is None:
        return []
    if not isinstance(value, list):
        raise serializers.ValidationError("channels debe ser una lista.")
    cleaned = []
    seen_ids: set[str] = set()
    for index, item in enumerate(value):
        if not isinstance(item, dict):
            raise serializers.ValidationError(
                f"channels[{index}] debe ser un objeto.",
            )
        channel_id = str(item.get("id", "")).strip()
        if channel_id not in ALLOWED_CHANNEL_IDS:
            raise serializers.ValidationError(
                f"channels[{index}].id inválido. Usa: whatsapp, email, location.",
            )
        if channel_id in seen_ids:
            raise serializers.ValidationError(
                f"channels[{index}].id duplicado: {channel_id}.",
            )
        seen_ids.add(channel_id)
        cleaned.append(
            {
                "id": channel_id,
                "label": str(item.get("label", "")).strip(),
                "value": str(item.get("value", "")).strip(),
                "href": str(item.get("href", "")).strip(),
                "hint": str(item.get("hint", "")).strip(),
            },
        )
    return cleaned


def _clean_str_list(value, field_name: str):
    if value is None:
        return []
    if not isinstance(value, list):
        raise serializers.ValidationError(f"{field_name} debe ser una lista.")
    return [str(item).strip() for item in value if str(item).strip()]


class ContactPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactPage
        fields = (
            "id",
            "hero_eyebrow",
            "hero_title",
            "hero_description",
            "channels",
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
            "form_quick_prompts",
            "form_submit_label",
            "form_submitting_label",
            "form_success_title",
            "form_success_message",
            "form_reset_label",
            "reassurance_title",
            "reassurance_items",
            "reassurance_footer",
            "property_banner_label",
            "property_banner_cta",
            "property_form_label",
            "seo_title",
            "seo_description",
            "content_en",
            "is_published",
            "updated_at",
        )
        read_only_fields = ("id", "updated_at")


class ContactPageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactPage
        fields = (
            "hero_eyebrow",
            "hero_title",
            "hero_description",
            "channels",
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
            "form_quick_prompts",
            "form_submit_label",
            "form_submitting_label",
            "form_success_title",
            "form_success_message",
            "form_reset_label",
            "reassurance_title",
            "reassurance_items",
            "reassurance_footer",
            "property_banner_label",
            "property_banner_cta",
            "property_form_label",
            "seo_title",
            "seo_description",
            "content_en",
            "is_published",
        )

    def validate_channels(self, value):
        return _clean_channels(value)

    def validate_form_quick_prompts(self, value):
        return _clean_str_list(value, "form_quick_prompts")

    def validate_reassurance_items(self, value):
        return _clean_str_list(value, "reassurance_items")

    def validate_content_en(self, value):
        if value is None:
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError("content_en debe ser un objeto.")

        cleaned: dict = {}
        for key in CONTACT_TEXT_KEYS:
            if key not in value:
                continue
            raw = value.get(key)
            cleaned[key] = str(raw).strip() if raw is not None else ""

        for key in CONTACT_LIST_KEYS:
            if key not in value:
                continue
            cleaned[key] = _clean_str_list(value.get(key), f"content_en.{key}")

        if "channels" in value:
            cleaned["channels"] = _clean_channels(value.get("channels"))

        return cleaned
