"""Serializadores del CRM."""

from __future__ import annotations

from rest_framework import serializers

from .models import Lead, LeadChannel, LeadMessage, LeadStatus


class LeadMessageSerializer(serializers.ModelSerializer[LeadMessage]):
    sender = serializers.SerializerMethodField()

    class Meta:
        model = LeadMessage
        fields = (
            "id",
            "lead",
            "content",
            "sender",
            "direction",
            "channel",
            "delivery_status",
            "sent_at",
            "read_at",
        )
        read_only_fields = fields

    def get_sender(self, obj: LeadMessage) -> str:
        return "lead" if obj.direction == "inbound" else "agent"


class LeadMessageCreateSerializer(serializers.Serializer):
    content = serializers.CharField(max_length=4000)


class LeadSerializer(serializers.ModelSerializer[Lead]):
    interested_property_title = serializers.SerializerMethodField()
    last_message = serializers.CharField(source="last_message_preview", read_only=True)
    unread = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = (
            "id",
            "name",
            "phone",
            "email",
            "channel",
            "interested_in",
            "interested_property_title",
            "assigned_agent",
            "status",
            "last_message",
            "unread",
            "unread_count",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "last_message",
            "unread",
            "unread_count",
            "created_at",
            "updated_at",
        )

    def get_interested_property_title(self, obj: Lead) -> str | None:
        if obj.interested_in_id and obj.interested_in:
            return obj.interested_in.title
        return None

    def get_unread(self, obj: Lead) -> bool:
        return obj.unread_count > 0


class LeadCreateSerializer(serializers.ModelSerializer[Lead]):
    initial_message = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        max_length=4000,
    )
    channel = serializers.ChoiceField(
        choices=[(LeadChannel.WEB, LeadChannel.WEB.label)],
        default=LeadChannel.WEB,
    )
    # Honeypot: los bots lo rellenan; humanos no lo ven.
    website = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        max_length=200,
    )

    class Meta:
        model = Lead
        fields = (
            "id",
            "name",
            "phone",
            "email",
            "channel",
            "interested_in",
            "status",
            "initial_message",
            "website",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "status", "created_at", "updated_at")

    def validate(self, attrs: dict) -> dict:
        phone = (attrs.get("phone") or "").strip()
        email = (attrs.get("email") or "").strip().lower()
        attrs["phone"] = phone
        attrs["email"] = email
        attrs.pop("website", None)

        if not phone and not email:
            raise serializers.ValidationError(
                "Indica al menos un teléfono o correo electrónico.",
            )
        return attrs

    def validate_name(self, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise serializers.ValidationError("El nombre debe tener al menos 2 caracteres.")
        return cleaned

    def create(self, validated_data: dict) -> Lead:
        initial_message = validated_data.pop("initial_message", "").strip()
        lead = Lead.objects.create(**validated_data)

        if not lead.external_contact_id:
            lead.external_contact_id = lead.email or lead.phone or f"web-{lead.pk}"
            lead.save(update_fields=["external_contact_id"])

        if initial_message:
            LeadMessage.objects.create(
                lead=lead,
                direction="inbound",
                content=initial_message,
                channel=lead.channel,
                delivery_status="delivered",
            )
            lead.touch_from_message(initial_message, inbound=True)

        return lead


class LeadUpdateSerializer(serializers.ModelSerializer[Lead]):
    class Meta:
        model = Lead
        fields = ("status", "assigned_agent", "interested_in")
        extra_kwargs = {
            "status": {"required": False},
            "assigned_agent": {"required": False, "allow_null": True},
            "interested_in": {"required": False, "allow_null": True},
        }

    def validate_status(self, value: str) -> str:
        if value not in LeadStatus.values:
            raise serializers.ValidationError("Estatus inválido.")
        return value
