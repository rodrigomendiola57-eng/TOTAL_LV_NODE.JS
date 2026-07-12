"""
Modelos del módulo Zonas.

- ZonesPage: textos + imagen del intro público /zonas (singleton).
- Zone: fichas del catálogo (CRUD dashboard).
"""

from __future__ import annotations

from django.db import models
from django.utils.text import slugify

from .choices import ZoneGrowthLabel


class ZonesPage(models.Model):
    """Contenido editable del intro de /zonas (pk=1)."""

    hero_eyebrow = models.CharField(max_length=80)
    hero_title = models.CharField(max_length=160)
    hero_subtitle = models.TextField()
    hero_image = models.ImageField(
        upload_to="zones/page/hero/",
        blank=True,
        null=True,
    )
    hero_image_external_url = models.URLField(max_length=500, blank=True)
    scroll_hint = models.CharField(max_length=40, default="Desplázate")

    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Página de zonas (textos)"
        verbose_name_plural = "Página de zonas (textos)"

    def __str__(self) -> str:
        return "Textos del intro de zonas"

    @classmethod
    def load(cls) -> ZonesPage:
        obj, _ = cls.objects.get_or_create(pk=1, defaults=cls._default_field_values())
        return obj

    @classmethod
    def _default_field_values(cls) -> dict:
        from .defaults import ZONES_PAGE_DEFAULTS

        return dict(ZONES_PAGE_DEFAULTS)


class Zone(models.Model):
    """Zona editorial del módulo /zonas (CRUD dashboard)."""

    slug = models.SlugField(max_length=120, unique=True)
    # Nombre libre; conviene que coincida con Property.zone para conteos.
    name = models.CharField(max_length=120, unique=True)
    growth_label = models.CharField(
        max_length=40,
        choices=ZoneGrowthLabel.choices,
        default=ZoneGrowthLabel.CRECIMIENTO_MEDIO,
    )
    description = models.TextField()
    sub_zones = models.JSONField(default=list, blank=True)

    image = models.ImageField(
        upload_to="zones/covers/",
        blank=True,
        null=True,
    )
    image_external_url = models.URLField(max_length=500, blank=True)

    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Zona"
        verbose_name_plural = "Zonas"
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            base = slugify(self.name)[:100] or "zona"
            candidate = base
            n = 2
            while Zone.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base}-{n}"
                n += 1
            self.slug = candidate
        super().save(*args, **kwargs)
