"""
Modelo CMS de la página /asesoria (singleton pk=1).
"""

from __future__ import annotations

from django.db import models


class AsesoriaPage(models.Model):
    """Contenido editable de /asesoria."""

    hero_eyebrow = models.CharField(max_length=120, blank=True)
    hero_title = models.CharField(max_length=200)
    hero_subtitle = models.TextField(blank=True)
    hero_image = models.ImageField(
        upload_to="asesoria/page/hero/",
        blank=True,
        null=True,
    )
    hero_image_external_url = models.URLField(max_length=500, blank=True)

    services_title = models.CharField(
        max_length=200,
        default="Servicios de Asesoría Inmobiliaria",
    )

    # Lista de tabs (compra / venta / inversión) con process + features.
    tabs = models.JSONField(default=list, blank=True)
    # Pilares del timeline "Enfoque".
    pillars = models.JSONField(default=list, blank=True)

    cta_title = models.CharField(max_length=200, blank=True)
    cta_subtitle = models.TextField(blank=True)
    cta_label = models.CharField(max_length=80, blank=True)
    cta_whatsapp_message = models.TextField(blank=True)
    content_en = models.JSONField(default=dict, blank=True)

    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Página Asesoría (textos)"
        verbose_name_plural = "Página Asesoría (textos)"

    def __str__(self) -> str:
        return "Textos de Asesoría"

    @classmethod
    def load(cls) -> AsesoriaPage:
        obj, _ = cls.objects.get_or_create(pk=1, defaults=cls._default_field_values())
        return obj

    @classmethod
    def _default_field_values(cls) -> dict:
        from .defaults import ASESORIA_PAGE_DEFAULTS

        return dict(ASESORIA_PAGE_DEFAULTS)
