"""
Modelos del módulo Desarrollos.

- DevelopmentsPage: textos CMS del listado público (singleton).
- Development: proyecto inmobiliario (CRUD dashboard).
- Nested: galería, modelos/unidades, plantas.
"""

from __future__ import annotations

from django.db import models
from django.utils.text import slugify

from .choices import DevelopmentStatus


class DevelopmentsPage(models.Model):
    """Contenido editable del listado /propiedades/desarrollos (pk=1)."""

    hero_eyebrow = models.CharField(max_length=80)
    hero_title = models.CharField(max_length=160)
    hero_subtitle = models.TextField()
    hero_image = models.ImageField(
        upload_to="developments/page/hero/",
        blank=True,
        null=True,
    )
    hero_image_external_url = models.URLField(max_length=500, blank=True)

    empty_message = models.TextField()
    empty_cta_label = models.CharField(max_length=80, default="Contactar asesor")
    empty_cta_url = models.CharField(max_length=255, default="/contacto")

    meta_title = models.CharField(max_length=160, blank=True)
    meta_description = models.CharField(max_length=300, blank=True)

    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Página de desarrollos (textos)"
        verbose_name_plural = "Página de desarrollos (textos)"

    def __str__(self) -> str:
        return "Textos del listado de desarrollos"

    @classmethod
    def load(cls) -> DevelopmentsPage:
        obj, _ = cls.objects.get_or_create(pk=1, defaults=cls._default_field_values())
        return obj

    @classmethod
    def _default_field_values(cls) -> dict:
        from .defaults import DEVELOPMENTS_PAGE_DEFAULTS

        return dict(DEVELOPMENTS_PAGE_DEFAULTS)


class Development(models.Model):
    """Proyecto / desarrollo inmobiliario."""

    slug = models.SlugField(max_length=120, unique=True)
    name = models.CharField(max_length=200)
    tagline = models.CharField(max_length=255, blank=True)
    developer = models.CharField(max_length=160, blank=True)
    description = models.TextField(blank=True)

    zone = models.CharField(max_length=120, blank=True)
    city = models.CharField(max_length=80, default="Querétaro")
    state = models.CharField(max_length=80, default="Querétaro")
    address = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    status = models.CharField(
        max_length=40,
        choices=DevelopmentStatus.choices,
        default=DevelopmentStatus.PREVENTA,
    )
    price_from = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default="MXN")
    delivery = models.CharField(max_length=80, blank=True)

    unit_types = models.JSONField(default=list, blank=True)
    bedrooms_min = models.PositiveSmallIntegerField(default=1)
    bedrooms_max = models.PositiveSmallIntegerField(default=1)
    area_min = models.PositiveIntegerField(default=0)
    area_max = models.PositiveIntegerField(default=0)
    amenities = models.JSONField(default=list, blank=True)

    cover_image = models.ImageField(
        upload_to="developments/covers/",
        blank=True,
        null=True,
    )
    cover_image_external_url = models.URLField(max_length=500, blank=True)

    total_units = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Desarrollo"
        verbose_name_plural = "Desarrollos"
        ordering = ["order", "-featured", "-updated_at", "name"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            base = slugify(self.name)[:100] or "desarrollo"
            candidate = base
            n = 2
            while (
                Development.objects.filter(slug=candidate).exclude(pk=self.pk).exists()
            ):
                candidate = f"{base}-{n}"
                n += 1
            self.slug = candidate
        super().save(*args, **kwargs)


class DevelopmentGalleryImage(models.Model):
    development = models.ForeignKey(
        Development,
        on_delete=models.CASCADE,
        related_name="gallery_images",
    )
    image = models.ImageField(
        upload_to="developments/gallery/",
        blank=True,
        null=True,
    )
    external_url = models.URLField(max_length=500, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Imagen de galería"
        verbose_name_plural = "Imágenes de galería"

    def __str__(self) -> str:
        return f"{self.development_id} gallery #{self.order}"


class DevelopmentUnitModel(models.Model):
    """Modelo / tipología de unidad dentro de un desarrollo."""

    development = models.ForeignKey(
        Development,
        on_delete=models.CASCADE,
        related_name="unit_models",
    )
    slug = models.SlugField(max_length=120)
    name = models.CharField(max_length=160)
    bedrooms = models.PositiveSmallIntegerField(default=1)
    bathrooms = models.PositiveSmallIntegerField(default=1)
    half_bathrooms = models.PositiveSmallIntegerField(default=0)
    area_m2 = models.PositiveIntegerField(default=0)
    lot_m2 = models.PositiveIntegerField(null=True, blank=True)
    parking = models.PositiveSmallIntegerField(default=0)
    price_from = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    list_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True,
    )
    cover_image = models.ImageField(
        upload_to="developments/models/",
        blank=True,
        null=True,
    )
    cover_image_external_url = models.URLField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    features = models.JSONField(default=list, blank=True)
    available = models.PositiveIntegerField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        unique_together = [("development", "slug")]
        verbose_name = "Modelo de unidad"
        verbose_name_plural = "Modelos de unidad"

    def __str__(self) -> str:
        return f"{self.development.name} · {self.name}"

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            self.slug = slugify(self.name)[:100] or "modelo"
        super().save(*args, **kwargs)


class DevelopmentModelImage(models.Model):
    unit_model = models.ForeignKey(
        DevelopmentUnitModel,
        on_delete=models.CASCADE,
        related_name="gallery_images",
    )
    image = models.ImageField(
        upload_to="developments/models/gallery/",
        blank=True,
        null=True,
    )
    external_url = models.URLField(max_length=500, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]


class DevelopmentFloorPlan(models.Model):
    unit_model = models.ForeignKey(
        DevelopmentUnitModel,
        on_delete=models.CASCADE,
        related_name="floor_plans",
    )
    label = models.CharField(max_length=80)
    image = models.ImageField(
        upload_to="developments/models/plans/",
        blank=True,
        null=True,
    )
    external_url = models.URLField(max_length=500, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Planta arquitectónica"
        verbose_name_plural = "Plantas arquitectónicas"
