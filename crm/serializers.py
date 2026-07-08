"""Serializadores del CRM para leads/prospectos."""

from __future__ import annotations

from rest_framework import serializers

from .models import Lead


class LeadSerializer(serializers.ModelSerializer[Lead]):
    """Valida y serializa prospectos capturados desde el frontend."""

    class Meta:
        model = Lead
        fields = (
            "id",
            "name",
            "phone",
            "email",
            "interested_in",
            "status",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def validate_name(self, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise serializers.ValidationError("El nombre debe tener al menos 2 caracteres.")
        return cleaned

    def validate_phone(self, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 8:
            raise serializers.ValidationError("El teléfono debe tener al menos 8 dígitos.")
        return cleaned

    def validate_email(self, value: str) -> str:
        return value.strip().lower()
