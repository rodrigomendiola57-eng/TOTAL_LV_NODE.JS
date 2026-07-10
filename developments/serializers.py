"""Serializers del módulo desarrollos."""

from __future__ import annotations

from rest_framework import serializers

from .models import (
    Development,
    DevelopmentFloorPlan,
    DevelopmentGalleryImage,
    DevelopmentModelImage,
    DevelopmentsPage,
    DevelopmentUnitModel,
)
from .services import resolve_image_url


class DevelopmentsPageSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.SerializerMethodField()

    class Meta:
        model = DevelopmentsPage
        fields = (
            "id",
            "hero_eyebrow",
            "hero_title",
            "hero_subtitle",
            "hero_image_url",
            "hero_image_external_url",
            "empty_message",
            "empty_cta_label",
            "empty_cta_url",
            "meta_title",
            "meta_description",
            "is_published",
            "updated_at",
        )
        read_only_fields = ("id", "hero_image_url", "updated_at")

    def get_hero_image_url(self, obj: DevelopmentsPage) -> str:
        request = self.context.get("request")
        return resolve_image_url(
            request,
            obj.hero_image,
            obj.hero_image_external_url,
        )


class DevelopmentsPageUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevelopmentsPage
        fields = (
            "hero_eyebrow",
            "hero_title",
            "hero_subtitle",
            "hero_image_external_url",
            "empty_message",
            "empty_cta_label",
            "empty_cta_url",
            "meta_title",
            "meta_description",
            "is_published",
        )


class DevelopmentFloorPlanSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = DevelopmentFloorPlan
        fields = ("id", "label", "image_url", "external_url", "order")
        read_only_fields = ("id", "image_url")

    def get_image_url(self, obj: DevelopmentFloorPlan) -> str:
        request = self.context.get("request")
        return resolve_image_url(request, obj.image, obj.external_url)


class DevelopmentModelImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = DevelopmentModelImage
        fields = ("id", "image_url", "external_url", "order")
        read_only_fields = ("id", "image_url")

    def get_image_url(self, obj: DevelopmentModelImage) -> str:
        request = self.context.get("request")
        return resolve_image_url(request, obj.image, obj.external_url)


class DevelopmentUnitModelSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    floor_plans = DevelopmentFloorPlanSerializer(many=True, read_only=True)

    class Meta:
        model = DevelopmentUnitModel
        fields = (
            "id",
            "slug",
            "name",
            "bedrooms",
            "bathrooms",
            "half_bathrooms",
            "area_m2",
            "lot_m2",
            "parking",
            "price_from",
            "list_price",
            "image_url",
            "cover_image_external_url",
            "description",
            "features",
            "available",
            "order",
            "gallery",
            "floor_plans",
        )
        read_only_fields = ("id", "image_url", "gallery", "floor_plans")

    def get_image_url(self, obj: DevelopmentUnitModel) -> str:
        request = self.context.get("request")
        return resolve_image_url(
            request,
            obj.cover_image,
            obj.cover_image_external_url,
        )

    def get_gallery(self, obj: DevelopmentUnitModel) -> list[str]:
        request = self.context.get("request")
        urls: list[str] = []
        for item in obj.gallery_images.all():
            url = resolve_image_url(request, item.image, item.external_url)
            if url:
                urls.append(url)
        return urls


class DevelopmentGalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = DevelopmentGalleryImage
        fields = ("id", "image_url", "external_url", "alt_text", "order")
        read_only_fields = ("id", "image_url")

    def get_image_url(self, obj: DevelopmentGalleryImage) -> str:
        request = self.context.get("request")
        return resolve_image_url(request, obj.image, obj.external_url)


class DevelopmentListSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()
    models_count = serializers.SerializerMethodField()

    class Meta:
        model = Development
        fields = (
            "id",
            "slug",
            "name",
            "tagline",
            "developer",
            "zone",
            "city",
            "state",
            "address",
            "latitude",
            "longitude",
            "status",
            "price_from",
            "currency",
            "delivery",
            "unit_types",
            "bedrooms_min",
            "bedrooms_max",
            "area_min",
            "area_max",
            "amenities",
            "cover_image_url",
            "cover_image_external_url",
            "gallery",
            "total_units",
            "featured",
            "is_published",
            "order",
            "description",
            "models_count",
            "updated_at",
        )
        read_only_fields = ("id", "cover_image_url", "gallery", "models_count", "updated_at")

    def get_cover_image_url(self, obj: Development) -> str:
        request = self.context.get("request")
        return resolve_image_url(
            request,
            obj.cover_image,
            obj.cover_image_external_url,
        )

    def get_gallery(self, obj: Development) -> list[str]:
        request = self.context.get("request")
        urls: list[str] = []
        for item in obj.gallery_images.all():
            url = resolve_image_url(request, item.image, item.external_url)
            if url:
                urls.append(url)
        cover = self.get_cover_image_url(obj)
        if cover and cover not in urls:
            urls.insert(0, cover)
        return urls

    def get_models_count(self, obj: Development) -> int:
        return obj.unit_models.count()


class DevelopmentDetailSerializer(DevelopmentListSerializer):
    models = DevelopmentUnitModelSerializer(
        many=True,
        read_only=True,
        source="unit_models",
    )

    class Meta(DevelopmentListSerializer.Meta):
        fields = DevelopmentListSerializer.Meta.fields + ("models",)


class DevelopmentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Development
        fields = (
            "slug",
            "name",
            "tagline",
            "developer",
            "description",
            "zone",
            "city",
            "state",
            "address",
            "latitude",
            "longitude",
            "status",
            "price_from",
            "currency",
            "delivery",
            "unit_types",
            "bedrooms_min",
            "bedrooms_max",
            "area_min",
            "area_max",
            "amenities",
            "cover_image_external_url",
            "total_units",
            "featured",
            "is_published",
            "order",
        )
        extra_kwargs = {
            "slug": {"required": False, "allow_blank": True},
        }


class DevelopmentUnitModelWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevelopmentUnitModel
        fields = (
            "slug",
            "name",
            "bedrooms",
            "bathrooms",
            "half_bathrooms",
            "area_m2",
            "lot_m2",
            "parking",
            "price_from",
            "list_price",
            "cover_image_external_url",
            "description",
            "features",
            "available",
            "order",
        )
        extra_kwargs = {
            "slug": {"required": False, "allow_blank": True},
        }
