"""Serializers del módulo Nosotros."""

from __future__ import annotations

from rest_framework import serializers

from .models import AboutPage, TeamMember
from .services import resolve_image_url

ALLOWED_SOCIAL_PLATFORMS = {
    "linkedin",
    "instagram",
    "facebook",
    "whatsapp",
    "email",
}


def clean_socials(value):
    if value is None:
        return []
    if not isinstance(value, list):
        raise serializers.ValidationError("socials debe ser una lista.")
    cleaned = []
    for item in value:
        if not isinstance(item, dict):
            continue
        platform = str(item.get("platform") or "").strip().lower()
        url = str(item.get("url") or "").strip()
        if not platform or not url:
            continue
        if platform not in ALLOWED_SOCIAL_PLATFORMS:
            raise serializers.ValidationError(
                f"Plataforma no permitida: {platform}.",
            )
        cleaned.append({"platform": platform, "url": url})
    return cleaned


class AboutPageSerializer(serializers.ModelSerializer):
    mission_image_url = serializers.SerializerMethodField()
    vision_image_url = serializers.SerializerMethodField()

    class Meta:
        model = AboutPage
        fields = (
            "id",
            "philosophy_title",
            "philosophy_subtitle",
            "philosophy_intro_lines",
            "philosophy_method_closing",
            "philosophy_pillars",
            "values",
            "mission_title",
            "mission_statement",
            "vision_title",
            "vision_statement",
            "mission_image_url",
            "mission_image_external_url",
            "vision_image_url",
            "vision_image_external_url",
            "team_eyebrow",
            "team_title",
            "org_eyebrow",
            "org_title",
            "org_chart",
            "cta_eyebrow",
            "cta_title",
            "cta_body",
            "cta_primary_label",
            "cta_primary_url",
            "cta_secondary_label",
            "cta_secondary_url",
            "section_nav",
            "is_published",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "mission_image_url",
            "vision_image_url",
            "updated_at",
        )

    def get_mission_image_url(self, obj: AboutPage) -> str:
        request = self.context.get("request")
        return resolve_image_url(
            request,
            obj.mission_image,
            obj.mission_image_external_url,
        )

    def get_vision_image_url(self, obj: AboutPage) -> str:
        request = self.context.get("request")
        return resolve_image_url(
            request,
            obj.vision_image,
            obj.vision_image_external_url,
        )


class AboutPageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = (
            "philosophy_title",
            "philosophy_subtitle",
            "philosophy_intro_lines",
            "philosophy_method_closing",
            "philosophy_pillars",
            "values",
            "mission_title",
            "mission_statement",
            "vision_title",
            "vision_statement",
            "mission_image_external_url",
            "vision_image_external_url",
            "team_eyebrow",
            "team_title",
            "org_eyebrow",
            "org_title",
            "org_chart",
            "cta_eyebrow",
            "cta_title",
            "cta_body",
            "cta_primary_label",
            "cta_primary_url",
            "cta_secondary_label",
            "cta_secondary_url",
            "section_nav",
            "is_published",
        )


class TeamMemberSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = (
            "id",
            "slug",
            "name",
            "role",
            "department",
            "bio",
            "photo_url",
            "photo_external_url",
            "socials",
            "is_published",
            "order",
            "updated_at",
        )
        read_only_fields = ("id", "photo_url", "updated_at")

    def get_photo_url(self, obj: TeamMember) -> str:
        request = self.context.get("request")
        return resolve_image_url(request, obj.photo, obj.photo_external_url)


class TeamMemberWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = (
            "slug",
            "name",
            "role",
            "department",
            "bio",
            "photo_external_url",
            "socials",
            "is_published",
            "order",
        )
        extra_kwargs = {
            "slug": {"required": False, "allow_blank": True},
        }

    def validate_slug(self, value: str) -> str:
        return (value or "").strip()

    def validate_socials(self, value):
        return clean_socials(value)

    def create(self, validated_data):
        if not validated_data.get("slug"):
            validated_data.pop("slug", None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "slug" in validated_data and not validated_data["slug"]:
            validated_data.pop("slug")
        return super().update(instance, validated_data)
