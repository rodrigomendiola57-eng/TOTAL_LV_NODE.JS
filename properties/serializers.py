"""Serializadores de propiedades para la API pública."""

from __future__ import annotations

import json

from django.contrib.gis.geos import GEOSGeometry
from rest_framework import serializers
from rest_framework_gis.fields import GeometryField
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import Property


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
            "is_featured",
            "cover_image_url",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "cover_image_url")

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

        request = self.context.get("request")
        if request is not None:
            return request.build_absolute_uri(cover.image.url)
        return cover.image.url

    def create(self, validated_data: dict) -> Property:
        if "location" in validated_data:
            validated_data["location"] = _coerce_location(validated_data["location"])
        return super().create(validated_data)

    def update(self, instance: Property, validated_data: dict) -> Property:
        if "location" in validated_data:
            validated_data["location"] = _coerce_location(validated_data["location"])
        return super().update(instance, validated_data)
