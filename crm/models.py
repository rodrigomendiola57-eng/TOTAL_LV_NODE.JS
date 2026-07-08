"""Modelos del CRM interno — Total Living."""

from __future__ import annotations

from django.db import models

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
    """Etapas del embudo comercial de un prospecto."""

    NUEVO = "Nuevo", "Nuevo"
    EN_CONTACTO = "En Contacto", "En Contacto"
    NEGOCIACION = "Negociación", "Negociación"
    CERRADO = "Cerrado", "Cerrado"


class Lead(models.Model):
    """
    Prospecto interesado en una propiedad o en contacto general.

    El teléfono se utiliza principalmente para seguimiento vía WhatsApp.
    """

    name = models.CharField("Nombre", max_length=150)
    phone = models.CharField("Teléfono (WhatsApp)", max_length=20)
    email = models.EmailField("Correo electrónico")
    interested_in = models.ForeignKey(
        Property,
        verbose_name="Interés en propiedad",
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
    created_at = models.DateTimeField("Creado el", auto_now_add=True)

    class Meta:
        verbose_name = "Prospecto"
        verbose_name_plural = "Prospectos"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} — {self.get_status_display()}"
