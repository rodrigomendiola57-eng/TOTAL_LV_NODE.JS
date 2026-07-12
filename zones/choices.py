"""Choices del catálogo público de zonas."""

from __future__ import annotations

from django.db import models

from properties.choices import QueretaroZone


class ZoneGrowthLabel(models.TextChoices):
    PLUSVALIA_PREMIUM = "Plusvalía premium", "Plusvalía premium"
    CRECIMIENTO_ALTO = "Crecimiento alto", "Crecimiento alto"
    CRECIMIENTO_MEDIO = "Crecimiento medio", "Crecimiento medio"
    EMERGENTE = "Emergente", "Emergente"


# Catálogo público: sin "Otra / Sin clasificar"
ZONE_NAME_CHOICES = [
    choice
    for choice in QueretaroZone.choices
    if choice[0] != QueretaroZone.OTRA
]
