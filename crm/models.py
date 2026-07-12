"""Modelos del CRM web — Total Living."""

from __future__ import annotations

from django.db import models
from django.db.models import F
from django.utils import timezone

from properties.models import Property


class Agent(models.Model):
    """Asesor inmobiliario del equipo Total Living."""

    name = models.CharField("Nombre", max_length=150)
    phone = models.CharField("Teléfono", max_length=20)
    email = models.EmailField("Correo electrónico")
    profile_photo = models.ImageField(
        "Foto de perfil",
        upload_to="agents/",
        blank=True,
    )

    class Meta:
        verbose_name = "Asesor"
        verbose_name_plural = "Asesores"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class LeadStatus(models.TextChoices):
    NUEVO = "Nuevo", "Nuevo"
    EN_CONTACTO = "En Contacto", "En Contacto"
    NEGOCIACION = "Negociación", "Negociación"
    CERRADO = "Cerrado", "Cerrado"


class LeadChannel(models.TextChoices):
    WEB = "Web", "Web"
    WHATSAPP = "WhatsApp", "WhatsApp"
    INSTAGRAM = "Instagram", "Instagram"
    FACEBOOK = "Facebook", "Facebook"


class MessageDirection(models.TextChoices):
    INBOUND = "inbound", "Entrante"
    OUTBOUND = "outbound", "Saliente"


class DeliveryStatus(models.TextChoices):
    PENDING = "pending", "Pendiente"
    SENT = "sent", "Enviado"
    DELIVERED = "delivered", "Entregado"
    FAILED = "failed", "Fallido"


class Lead(models.Model):
    """Prospecto captado desde el sitio web."""

    name = models.CharField("Nombre", max_length=150)
    phone = models.CharField("Teléfono", max_length=20, blank=True)
    email = models.EmailField("Correo electrónico", blank=True)
    channel = models.CharField(
        "Canal",
        max_length=20,
        choices=LeadChannel.choices,
        default=LeadChannel.WEB,
    )
    external_contact_id = models.CharField(
        "ID externo del contacto",
        max_length=255,
        blank=True,
        db_index=True,
    )
    interested_in = models.ForeignKey(
        Property,
        verbose_name="Interés en propiedad",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="leads",
    )
    assigned_agent = models.ForeignKey(
        Agent,
        verbose_name="Asesor asignado",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="leads",
    )
    status = models.CharField(
        "Estatus",
        max_length=20,
        choices=LeadStatus.choices,
        default=LeadStatus.NUEVO,
    )
    last_message_preview = models.CharField(
        "Último mensaje",
        max_length=280,
        blank=True,
    )
    unread_count = models.PositiveIntegerField("No leídos", default=0)
    created_at = models.DateTimeField("Creado el", auto_now_add=True)
    updated_at = models.DateTimeField("Actualizado el", auto_now=True)

    class Meta:
        verbose_name = "Prospecto"
        verbose_name_plural = "Prospectos"
        ordering = ["-updated_at", "-created_at"]

    def __str__(self) -> str:
        return f"{self.name} — {self.get_channel_display()}"

    def touch_from_message(self, preview: str, *, inbound: bool) -> None:
        self.last_message_preview = preview[:280]
        self.updated_at = timezone.now()
        if inbound:
            # Atómico: evita perder conteos con mark_read concurrente.
            type(self).objects.filter(pk=self.pk).update(
                last_message_preview=self.last_message_preview,
                updated_at=self.updated_at,
                unread_count=F("unread_count") + 1,
            )
            self.refresh_from_db(fields=["unread_count", "updated_at", "last_message_preview"])
        else:
            self.save(
                update_fields=["last_message_preview", "updated_at"],
            )


class LeadMessage(models.Model):
    """Mensaje individual dentro de una conversación de lead."""

    lead = models.ForeignKey(
        Lead,
        verbose_name="Prospecto",
        on_delete=models.CASCADE,
        related_name="messages",
    )
    direction = models.CharField(
        "Dirección",
        max_length=10,
        choices=MessageDirection.choices,
    )
    content = models.TextField("Contenido")
    channel = models.CharField(
        "Canal",
        max_length=20,
        choices=LeadChannel.choices,
    )
    external_id = models.CharField(
        "ID externo del mensaje",
        max_length=255,
        blank=True,
        db_index=True,
    )
    delivery_status = models.CharField(
        "Estado de entrega",
        max_length=12,
        choices=DeliveryStatus.choices,
        default=DeliveryStatus.SENT,
    )
    metadata = models.JSONField("Metadatos", default=dict, blank=True)
    sent_at = models.DateTimeField("Enviado el", default=timezone.now)
    read_at = models.DateTimeField("Leído el", null=True, blank=True)

    class Meta:
        verbose_name = "Mensaje"
        verbose_name_plural = "Mensajes"
        ordering = ["sent_at"]

    def __str__(self) -> str:
        return f"{self.lead.name}: {self.content[:40]}"
