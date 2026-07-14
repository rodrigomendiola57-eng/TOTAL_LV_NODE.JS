"""Serializers del módulo Asesoría."""

from __future__ import annotations

from rest_framework import serializers

from .models import AsesoriaPage
from .services import resolve_image_url


class AsesoriaPageSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.SerializerMethodField()

    class Meta:
        model = AsesoriaPage
        fields = (
            "id",
            "hero_eyebrow",
            "hero_title",
            "hero_subtitle",
            "hero_image_url",
            "hero_image_external_url",
            "services_title",
            "tabs",
            "pillars",
            "cta_title",
            "cta_subtitle",
            "cta_label",
            "cta_whatsapp_message",
            "content_en",
            "is_published",
            "updated_at",
        )
        read_only_fields = ("id", "hero_image_url", "updated_at")

    def get_hero_image_url(self, obj: AsesoriaPage) -> str:
        request = self.context.get("request")
        return resolve_image_url(
            request,
            obj.hero_image,
            obj.hero_image_external_url,
        )


class AsesoriaPageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsesoriaPage
        fields = (
            "hero_eyebrow",
            "hero_title",
            "hero_subtitle",
            "hero_image_external_url",
            "services_title",
            "tabs",
            "pillars",
            "cta_title",
            "cta_subtitle",
            "cta_label",
            "cta_whatsapp_message",
            "content_en",
            "is_published",
        )

    def validate_tabs(self, value):
        if value is None:
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError("tabs debe ser una lista.")
        return value

    def validate_pillars(self, value):
        if value is None:
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError("pillars debe ser una lista.")
        return value

    def validate_content_en(self, value):
        if value is None:
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError("content_en debe ser un objeto.")
        return value
