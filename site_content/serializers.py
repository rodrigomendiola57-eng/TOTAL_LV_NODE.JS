"""Serializers REST para contenido del sitio."""

from __future__ import annotations

from rest_framework import serializers

from .models import (
    HomeAboutSlide,
    HomeCityHighlight,
    HomeExpertisePillar,
    HomeExpertiseService,
    HomePage,
)


def _absolute_media_url(request, file_field) -> str | None:
    if not file_field:
        return None
    url = file_field.url
    if request is not None:
        return request.build_absolute_uri(url)
    return url


class HomeAboutSlideSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    image_mobile_url = serializers.SerializerMethodField()

    class Meta:
        model = HomeAboutSlide
        fields = [
            "id",
            "alt_text",
            "external_url",
            "order",
            "image_url",
            "image_mobile_url",
        ]
        read_only_fields = ["id", "image_url", "image_mobile_url"]

    def get_image_url(self, obj: HomeAboutSlide) -> str | None:
        if obj.image:
            return _absolute_media_url(self.context.get("request"), obj.image)
        return obj.external_url or None

    def get_image_mobile_url(self, obj: HomeAboutSlide) -> str | None:
        if obj.image_mobile:
            return _absolute_media_url(self.context.get("request"), obj.image_mobile)
        if obj.image:
            return _absolute_media_url(self.context.get("request"), obj.image)
        return obj.external_url or None


class HomeCityHighlightSerializer(serializers.ModelSerializer):
    image_desktop_url = serializers.SerializerMethodField()
    image_mobile_url = serializers.SerializerMethodField()

    class Meta:
        model = HomeCityHighlight
        fields = [
            "aria_label",
            "city_name",
            "title",
            "description",
            "image_desktop_url",
            "image_mobile_url",
            "external_desktop_url",
            "external_mobile_url",
        ]

    def get_image_desktop_url(self, obj: HomeCityHighlight) -> str | None:
        if obj.image_desktop:
            return _absolute_media_url(self.context.get("request"), obj.image_desktop)
        return obj.external_desktop_url or None

    def get_image_mobile_url(self, obj: HomeCityHighlight) -> str | None:
        if obj.image_mobile:
            return _absolute_media_url(self.context.get("request"), obj.image_mobile)
        return obj.external_mobile_url or obj.external_desktop_url or None


class HomeExpertiseServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeExpertiseService
        fields = [
            "id",
            "slug",
            "title",
            "description",
            "bullets",
            "icon",
            "order",
            "is_active",
        ]
        read_only_fields = ["id"]


class HomeExpertisePillarSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeExpertisePillar
        fields = [
            "id",
            "slug",
            "title",
            "description",
            "bento_class",
            "order",
            "is_active",
        ]
        read_only_fields = ["id"]


class HomePageDetailSerializer(serializers.ModelSerializer):
    hero_background_url = serializers.SerializerMethodField()
    about_slides = HomeAboutSlideSerializer(many=True, read_only=True)
    city_highlight = HomeCityHighlightSerializer(read_only=True)
    expertise_services = HomeExpertiseServiceSerializer(many=True, read_only=True)
    expertise_pillars = HomeExpertisePillarSerializer(many=True, read_only=True)

    class Meta:
        model = HomePage
        fields = [
            "id",
            "is_published",
            "updated_at",
            "hero_eyebrow",
            "hero_title",
            "hero_subtitle",
            "hero_background_url",
            "about_eyebrow",
            "about_title",
            "about_body",
            "about_cta_label",
            "about_cta_url",
            "about_social_label",
            "about_slides",
            "featured_eyebrow",
            "featured_title",
            "featured_empty_message",
            "featured_links",
            "city_highlight",
            "zones_eyebrow",
            "zones_title",
            "zones_description",
            "zones_cta_label",
            "zones_cta_url",
            "contact_eyebrow",
            "contact_title",
            "contact_description",
            "contact_cta_label",
            "contact_cta_url",
            "expertise_title",
            "expertise_subtitle",
            "expertise_services",
            "expertise_pillars",
        ]
        read_only_fields = ["id", "updated_at", "hero_background_url"]

    def get_hero_background_url(self, obj: HomePage) -> str | None:
        if obj.hero_background:
            return _absolute_media_url(self.context.get("request"), obj.hero_background)
        return None


class HomePageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePage
        fields = [
            "is_published",
            "hero_eyebrow",
            "hero_title",
            "hero_subtitle",
            "about_eyebrow",
            "about_title",
            "about_body",
            "about_cta_label",
            "about_cta_url",
            "about_social_label",
            "featured_eyebrow",
            "featured_title",
            "featured_empty_message",
            "featured_links",
            "zones_eyebrow",
            "zones_title",
            "zones_description",
            "zones_cta_label",
            "zones_cta_url",
            "contact_eyebrow",
            "contact_title",
            "contact_description",
            "contact_cta_label",
            "contact_cta_url",
            "expertise_title",
            "expertise_subtitle",
        ]


class HomeCityHighlightUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeCityHighlight
        fields = [
            "aria_label",
            "city_name",
            "title",
            "description",
            "external_desktop_url",
            "external_mobile_url",
        ]


class HomeAboutSlideWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeAboutSlide
        fields = ["alt_text", "external_url", "order"]


class HomeExpertiseServiceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeExpertiseService
        fields = [
            "slug",
            "title",
            "description",
            "bullets",
            "icon",
            "order",
            "is_active",
        ]


class HomeExpertisePillarWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeExpertisePillar
        fields = [
            "slug",
            "title",
            "description",
            "bento_class",
            "order",
            "is_active",
        ]
