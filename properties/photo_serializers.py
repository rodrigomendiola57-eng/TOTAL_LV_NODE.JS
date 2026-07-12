"""Serializadores para fotos de propiedades."""

from __future__ import annotations

from rest_framework import serializers

from totalliving_backend.media_urls import absolute_media_url

from .models import PropertyPhoto
from .photo_validators import validate_property_image


class PropertyPhotoSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyPhoto
        fields = ("id", "url", "order", "is_cover", "alt_text", "created_at")
        read_only_fields = ("id", "url", "created_at")

    def get_url(self, obj: PropertyPhoto) -> str:
        if not obj.image:
            return ""
        return absolute_media_url(self.context.get("request"), obj.image) or ""


class PropertyPhotoUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyPhoto
        fields = ("image", "alt_text")

    def validate_image(self, value):
        validate_property_image(value)
        return value
