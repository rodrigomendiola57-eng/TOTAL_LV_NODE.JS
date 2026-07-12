"""
Modelos del módulo Nosotros (/nosotros).

- AboutPage: textos + imágenes de la página (singleton).
- TeamMember: asesores / directivos (CRUD dashboard).
"""

from __future__ import annotations

from django.db import models
from django.utils.text import slugify


class AboutPage(models.Model):
    """Contenido editable de /nosotros (pk=1)."""

    philosophy_title = models.CharField(max_length=160)
    philosophy_subtitle = models.CharField(max_length=200, blank=True)
    philosophy_intro_lines = models.JSONField(default=list, blank=True)
    philosophy_method_closing = models.CharField(max_length=200, blank=True)
    philosophy_pillars = models.JSONField(default=list, blank=True)

    values = models.JSONField(default=list, blank=True)

    mission_title = models.CharField(max_length=80, default="Misión")
    mission_statement = models.TextField()
    vision_title = models.CharField(max_length=80, default="Visión")
    vision_statement = models.TextField()

    mission_image = models.ImageField(
        upload_to="about/page/mission/",
        blank=True,
        null=True,
    )
    mission_image_external_url = models.URLField(max_length=500, blank=True)
    vision_image = models.ImageField(
        upload_to="about/page/vision/",
        blank=True,
        null=True,
    )
    vision_image_external_url = models.URLField(max_length=500, blank=True)

    team_eyebrow = models.CharField(max_length=80, default="Equipo Total Living")
    team_title = models.CharField(
        max_length=160,
        default="El equipo detrás de cada decisión",
    )
    org_eyebrow = models.CharField(max_length=80, default="Organigrama")
    org_title = models.CharField(max_length=160, blank=True)
    org_chart = models.JSONField(default=dict, blank=True)

    cta_eyebrow = models.CharField(max_length=80, blank=True)
    cta_title = models.CharField(max_length=200, blank=True)
    cta_body = models.TextField(blank=True)
    cta_primary_label = models.CharField(max_length=60, blank=True)
    cta_primary_url = models.CharField(max_length=200, blank=True)
    cta_secondary_label = models.CharField(max_length=60, blank=True)
    cta_secondary_url = models.CharField(max_length=200, blank=True)

    section_nav = models.JSONField(default=list, blank=True)

    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Página Nosotros (textos)"
        verbose_name_plural = "Página Nosotros (textos)"

    def __str__(self) -> str:
        return "Textos de Nosotros"

    @classmethod
    def load(cls) -> AboutPage:
        obj, _ = cls.objects.get_or_create(pk=1, defaults=cls._default_field_values())
        return obj

    @classmethod
    def _default_field_values(cls) -> dict:
        from .defaults import ABOUT_PAGE_DEFAULTS

        return dict(ABOUT_PAGE_DEFAULTS)


class TeamMember(models.Model):
    """Miembro del equipo público en /nosotros."""

    slug = models.SlugField(max_length=120, unique=True)
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=160)
    department = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True)

    photo = models.ImageField(
        upload_to="about/team/",
        blank=True,
        null=True,
    )
    photo_external_url = models.URLField(max_length=500, blank=True)

    # [{ "platform": "linkedin"|"instagram"|..., "url": "..." }]
    socials = models.JSONField(default=list, blank=True)

    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Miembro del equipo"
        verbose_name_plural = "Equipo Total Living"
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            base = slugify(self.name)[:100] or "miembro"
            candidate = base
            n = 2
            while TeamMember.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base}-{n}"
                n += 1
            self.slug = candidate
        super().save(*args, **kwargs)
