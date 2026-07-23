"""Serializadores de propiedades para la API pública."""

from __future__ import annotations

import json

from django.contrib.gis.geos import GEOSGeometry
from rest_framework import serializers
from rest_framework_gis.fields import GeometryField
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from totalliving_backend.media_urls import absolute_media_url

from .models import Amenity, Property


class AmenitySerializer(serializers.ModelSerializer):
    """Serializa una amenidad del catálogo para lectura en el frontend."""

    class Meta:
        model = Amenity
        fields = ("id", "name", "slug", "category", "icon")


def _coerce_location(value: object) -> GEOSGeometry | None:
    """Convierte GeoJSON/dict a GEOSGeometry para PostGIS."""
    if value is None or isinstance(value, GEOSGeometry):
        return value
    if isinstance(value, dict):
        return GEOSGeometry(json.dumps(value))
    return GEOSGeometry(value)


class PropertySerializer(GeoFeatureModelSerializer):
    """Serializa propiedades en formato GeoJSON usando `location` como geometría."""

    location = GeometryField()
    cover_image_url = serializers.SerializerMethodField()
    technical_sheet_url = serializers.SerializerMethodField()
    amenities = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Amenity.objects.all(),
        required=False,
    )
    amenities_detail = AmenitySerializer(
        many=True,
        read_only=True,
        source="amenities",
    )

    class Meta:
        model = Property
        geo_field = "location"
        fields = (
            "id",
            "title",
            "property_type",
            "operation_type",
            "price",
            "currency",
            "description",
            "address",
            "state",
            "city",
            "postal_code",
            "zone",
            "maps_link",
            "location",
            "bedrooms",
            "full_bathrooms",
            "half_bathrooms",
            "parking_spaces",
            "build_area_m2",
            "land_area_m2",
            "levels",
            "front_measure_m",
            "depth_measure_m",
            "build_year",
            "environments",
            "maintenance_fee",
            "amenities",
            "amenities_detail",
            "is_featured",
            "easybroker_id",
            "easybroker_synced_at",
            "cover_image_url",
            "technical_sheet_url",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "cover_image_url",
            "technical_sheet_url",
            "easybroker_synced_at",
        )

    def validate_easybroker_id(self, value: str | None) -> str | None:
        if self.instance and getattr(self.instance, "easybroker_synced_at", None):
            # Propiedad sincronizada desde EasyBroker: mantener su ID original intacto
            return self.instance.easybroker_id

        if value is not None:
            value = value.strip()
            if not value:
                return None
        return value

    def get_cover_image_url(self, obj: Property) -> str | None:
        photos = getattr(obj, "_prefetched_objects_cache", {}).get("photos")
        if photos is None:
            cover = (
                obj.photos.filter(is_cover=True).first()
                or obj.photos.order_by("order", "id").first()
            )
        else:
            ordered = sorted(photos, key=lambda photo: (photo.order, photo.pk))
            cover = next((photo for photo in ordered if photo.is_cover), None)
            if cover is None and ordered:
                cover = ordered[0]

        if cover is None or not cover.image:
            return None

        return absolute_media_url(self.context.get("request"), cover.image)

    def get_technical_sheet_url(self, obj: Property) -> str | None:
        if not obj.technical_sheet:
            return None

        return absolute_media_url(self.context.get("request"), obj.technical_sheet)

    def create(self, validated_data: dict) -> Property:
        if "location" in validated_data:
            validated_data["location"] = _coerce_location(validated_data["location"])
        return super().create(validated_data)

    def update(self, instance: Property, validated_data: dict) -> Property:
        if "location" in validated_data:
            validated_data["location"] = _coerce_location(validated_data["location"])
        return super().update(instance, validated_data)


class PropertyDashboardListSerializer(serializers.ModelSerializer):
    """
    Listado ligero para el panel admin: sin GeoJSON ni geometría.
    Evita serializar PostGIS (costoso con GDAL/PROJ en Windows).
    """

    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = (
            "id",
            "title",
            "property_type",
            "operation_type",
            "price",
            "currency",
            "description",
            "address",
            "state",
            "city",
            "postal_code",
            "zone",
            "maps_link",
            "bedrooms",
            "full_bathrooms",
            "half_bathrooms",
            "parking_spaces",
            "build_area_m2",
            "land_area_m2",
            "levels",
            "front_measure_m",
            "depth_measure_m",
            "build_year",
            "environments",
            "maintenance_fee",
            "is_featured",
            "easybroker_id",
            "easybroker_synced_at",
            "cover_image_url",
            "created_at",
            "updated_at",
        )

    def get_cover_image_url(self, obj: Property) -> str | None:
        return PropertySerializer.get_cover_image_url(self, obj)
