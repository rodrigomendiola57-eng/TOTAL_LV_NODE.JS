"""Serializers del módulo zonas."""

from __future__ import annotations

from rest_framework import serializers

from .models import Zone, ZonesPage
from .services import resolve_image_url


class ZonesPageSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.SerializerMethodField()

    class Meta:
        model = ZonesPage
        fields = (
            "id",
            "hero_eyebrow",
            "hero_title",
            "hero_subtitle",
            "hero_image_url",
            "hero_image_external_url",
            "scroll_hint",
            "content_en",
            "is_published",
            "updated_at",
        )
        read_only_fields = ("id", "hero_image_url", "updated_at")

    def get_hero_image_url(self, obj: ZonesPage) -> str:
        request = self.context.get("request")
        return resolve_image_url(
            request,
            obj.hero_image,
            obj.hero_image_external_url,
        )

    def validate_content_en(self, value):
        if value is None:
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError("content_en debe ser un objeto.")
        return value


class ZonesPageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZonesPage
        fields = (
            "hero_eyebrow",
            "hero_title",
            "hero_subtitle",
            "hero_image_external_url",
            "scroll_hint",
            "content_en",
            "is_published",
        )


class ZoneSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Zone
        fields = (
            "id",
            "slug",
            "name",
            "growth_label",
            "description",
            "sub_zones",
            "image_url",
            "image_external_url",
            "content_en",
            "is_published",
            "order",
            "updated_at",
        )
        read_only_fields = ("id", "image_url", "updated_at")

    def get_image_url(self, obj: Zone) -> str:
        request = self.context.get("request")
        return resolve_image_url(request, obj.image, obj.image_external_url)

    def to_representation(self, instance: Zone):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if request:
            lang = str(request.query_params.get("lang", "es")).lower()
            if lang == "en":
                en_pack = instance.content_en if isinstance(instance.content_en, dict) else {}
                
                if "name" in en_pack and isinstance(en_pack["name"], str) and en_pack["name"].strip():
                    data["name"] = en_pack["name"]
                
                if "description" in en_pack and isinstance(en_pack["description"], str) and en_pack["description"].strip():
                    data["description"] = en_pack["description"]
                
                if "sub_zones" in en_pack and isinstance(en_pack["sub_zones"], list):
                    data["sub_zones"] = en_pack["sub_zones"]
                
                growth_map = {
                    "Plusvalía premium": "Premium appreciation",
                    "Crecimiento alto": "High growth",
                    "Crecimiento medio": "Medium growth",
                    "Emergente": "Emerging",
                }
                label = data.get("growth_label")
                if "growth_label" in en_pack and isinstance(en_pack["growth_label"], str) and en_pack["growth_label"].strip():
                    data["growth_label"] = en_pack["growth_label"]
                elif label in growth_map:
                    data["growth_label"] = growth_map[label]
        return data


class ZoneWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = (
            "slug",
            "name",
            "growth_label",
            "description",
            "sub_zones",
            "image_external_url",
            "content_en",
            "is_published",
            "order",
        )
        extra_kwargs = {
            "slug": {"required": False, "allow_blank": True},
        }

    def validate_slug(self, value: str) -> str:
        return (value or "").strip()

    def validate_sub_zones(self, value):
        if value is None:
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError("sub_zones debe ser una lista.")
        cleaned = [str(item).strip() for item in value if str(item).strip()]
        return cleaned

    def validate_content_en(self, value):
        if value is None:
            return {}
        if not isinstance(value, dict):
            raise serializers.ValidationError("content_en debe ser un objeto.")
        return value

    def create(self, validated_data):
        if not validated_data.get("slug"):
            validated_data.pop("slug", None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # No permitir que el cliente borre el slug accidentalmente.
        if "slug" in validated_data and not validated_data["slug"]:
            validated_data.pop("slug")
        return super().update(instance, validated_data)
