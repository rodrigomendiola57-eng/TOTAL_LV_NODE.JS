"""Serializadores para fotos de propiedades."""

from __future__ import annotations

from rest_framework import serializers

from .models import PropertyPhoto
from .photo_validators import validate_property_image


class PropertyPhotoSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyPhoto
        fields = ("id", "url", "order", "is_cover", "alt_text", "created_at")
        read_only_fields = ("id", "url", "created_at")

    def get_url(self, obj: PropertyPhoto) -> str:
        request = self.context.get("request")
        if not obj.image:
            return ""
        if request is not None:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class PropertyPhotoUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyPhoto
        fields = ("image", "alt_text")

    def validate_image(self, value):
        validate_property_image(value)
        return value
