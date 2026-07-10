"""Choices del módulo de desarrollos."""

from django.db import models


class DevelopmentStatus(models.TextChoices):
    PREVENTA = "Preventa", "Preventa"
    EN_CONSTRUCCION = "En construcción", "En construcción"
    ENTREGA_INMEDIATA = "Entrega inmediata", "Entrega inmediata"
