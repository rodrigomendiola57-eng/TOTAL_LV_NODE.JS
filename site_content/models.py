"""Modelos de contenido editable del sitio (singleton HomePage + relaciones)."""

from __future__ import annotations

from django.db import models


class HomePage(models.Model):
    """Contenido principal de la página de inicio (registro único pk=1)."""

    # Hero
    hero_eyebrow = models.CharField(max_length=80)
    hero_title = models.CharField(max_length=120)
    hero_subtitle = models.CharField(max_length=255)
    hero_background = models.ImageField(
        upload_to="home/hero/",
        blank=True,
        null=True,
    )

    # About teaser
    about_eyebrow = models.CharField(max_length=80)
    about_title = models.CharField(max_length=200)
    about_body = models.TextField()
    about_cta_label = models.CharField(max_length=80)
    about_cta_url = models.CharField(max_length=255)
    about_social_label = models.CharField(max_length=80, default="Síguenos")

    # Featured properties section
    featured_eyebrow = models.CharField(max_length=80)
    featured_title = models.CharField(max_length=120)
    featured_empty_message = models.TextField()
    featured_links = models.JSONField(default=list)

    # Zones CTA
    zones_eyebrow = models.CharField(max_length=80)
    zones_title = models.CharField(max_length=120)
    zones_description = models.TextField()
    zones_cta_label = models.CharField(max_length=80)
    zones_cta_url = models.CharField(max_length=255)

    # Contact CTA
    contact_eyebrow = models.CharField(max_length=80)
    contact_title = models.CharField(max_length=120)
    contact_description = models.TextField()
    contact_cta_label = models.CharField(max_length=80)
    contact_cta_url = models.CharField(max_length=255)

    # Expertise section headers
    expertise_title = models.CharField(max_length=200)
    expertise_subtitle = models.TextField()

    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Página de inicio"
        verbose_name_plural = "Página de inicio"

    def __str__(self) -> str:
        return "Contenido de inicio"

    @classmethod
    def load(cls) -> HomePage:
        obj, _ = cls.objects.get_or_create(pk=1, defaults=cls._default_field_values())
        return obj

    @classmethod
    def _default_field_values(cls) -> dict:
        from .defaults import HOME_PAGE_DEFAULTS

        return dict(HOME_PAGE_DEFAULTS)


class HomeAboutSlide(models.Model):
    home_page = models.ForeignKey(
        HomePage,
        on_delete=models.CASCADE,
        related_name="about_slides",
    )
    image = models.ImageField(upload_to="home/about/", blank=True, null=True)
    image_mobile = models.ImageField(upload_to="home/about/mobile/", blank=True, null=True)
    alt_text = models.CharField(max_length=200)
    external_url = models.URLField(
        max_length=500,
        blank=True,
        help_text="URL externa de respaldo si no hay imagen subida.",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Imagen carrusel Nosotros (inicio)"
        verbose_name_plural = "Imágenes carrusel Nosotros (inicio)"

    def __str__(self) -> str:
        return f"About slide #{self.order}: {self.alt_text[:40]}"


class HomeCityHighlight(models.Model):
    home_page = models.OneToOneField(
        HomePage,
        on_delete=models.CASCADE,
        related_name="city_highlight",
    )
    aria_label = models.CharField(max_length=200)
    city_name = models.CharField(max_length=80)
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_desktop = models.ImageField(upload_to="home/city/", blank=True, null=True)
    image_mobile = models.ImageField(upload_to="home/city/mobile/", blank=True, null=True)
    external_desktop_url = models.URLField(max_length=500, blank=True)
    external_mobile_url = models.URLField(max_length=500, blank=True)

    class Meta:
        verbose_name = "Destacado ciudad (inicio)"
        verbose_name_plural = "Destacado ciudad (inicio)"

    def __str__(self) -> str:
        return self.city_name


class HomeExpertiseService(models.Model):
    home_page = models.ForeignKey(
        HomePage,
        on_delete=models.CASCADE,
        related_name="expertise_services",
    )
    slug = models.SlugField(max_length=60)
    title = models.CharField(max_length=120)
    description = models.TextField()
    bullets = models.JSONField(default=list)
    icon = models.CharField(max_length=40, default="Building2")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        unique_together = [("home_page", "slug")]
        verbose_name = "Servicio de asesoría (inicio)"
        verbose_name_plural = "Servicios de asesoría (inicio)"

    def __str__(self) -> str:
        return self.title


class HomeExpertisePillar(models.Model):
    home_page = models.ForeignKey(
        HomePage,
        on_delete=models.CASCADE,
        related_name="expertise_pillars",
    )
    slug = models.SlugField(max_length=60)
    title = models.CharField(max_length=120)
    description = models.TextField()
    bento_class = models.CharField(max_length=80, blank=True, default="")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        unique_together = [("home_page", "slug")]
        verbose_name = "Pilar de asesoría (inicio)"
        verbose_name_plural = "Pilares de asesoría (inicio)"

    def __str__(self) -> str:
        return self.title
