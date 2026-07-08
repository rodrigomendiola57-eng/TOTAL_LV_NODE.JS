"""Modelos del catálogo público de propiedades — Total Living."""

from __future__ import annotations

from django.contrib.gis.db import models

from .choices import MexicanState, OperationType, PropertyType, QueretaroZone


class Property(models.Model):
    """
    Propiedad inmobiliaria del catálogo público y CRM interno.

    Incluye datos comerciales, ubicación detallada, características
    físicas y coordenadas geoespaciales (PostGIS).
    """

    # Datos generales
    title = models.CharField("Título", max_length=255)
    property_type = models.CharField(
        "Tipo de propiedad",
        max_length=30,
        choices=PropertyType.choices,
    )
    operation_type = models.CharField(
        "Tipo de operación",
        max_length=20,
        choices=OperationType.choices,
    )
    price = models.DecimalField("Precio", max_digits=14, decimal_places=2)
    currency = models.CharField("Moneda", max_length=3, default="MXN")
    description = models.TextField("Descripción", blank=True)

    # Ubicación
    address = models.CharField("Dirección", max_length=255)
    state = models.CharField(
        "Estado",
        max_length=40,
        choices=MexicanState.choices,
    )
    city = models.CharField("Ciudad", max_length=120)
    postal_code = models.CharField("Código postal", max_length=10)
    zone = models.CharField(
        "Zona de Querétaro",
        max_length=80,
        choices=QueretaroZone.choices,
    )
    maps_link = models.URLField("Enlace de Google Maps", blank=True)
    location = models.PointField("Ubicación (lat/lng)", geography=True, srid=4326)

    # Características
    bedrooms = models.PositiveIntegerField("Recámaras", default=0)
    full_bathrooms = models.PositiveIntegerField("Baños completos", default=0)
    half_bathrooms = models.PositiveIntegerField("Medios baños", default=0)
    parking_spaces = models.PositiveIntegerField("Estacionamientos", default=0)
    build_area_m2 = models.DecimalField(
        "Superficie construida (m²)",
        max_digits=10,
        decimal_places=2,
        default=0,
    )
    land_area_m2 = models.DecimalField(
        "Superficie de terreno (m²)",
        max_digits=10,
        decimal_places=2,
        default=0,
    )
    levels = models.PositiveIntegerField("Niveles", default=1)
    front_measure_m = models.DecimalField(
        "Frente (m)",
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
    )
    depth_measure_m = models.DecimalField(
        "Fondo (m)",
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
    )
    build_year = models.PositiveIntegerField("Año de construcción", null=True, blank=True)
    environments = models.PositiveIntegerField("Ambientes", default=0)
    maintenance_fee = models.DecimalField(
        "Cuota de mantenimiento",
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    is_featured = models.BooleanField("Destacada", default=False)
    created_at = models.DateTimeField("Creada el", auto_now_add=True)
    updated_at = models.DateTimeField("Actualizada el", auto_now=True)

    class Meta:
        verbose_name = "Propiedad"
        verbose_name_plural = "Propiedades"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.title} — {self.get_operation_type_display()}"


class PropertyPhoto(models.Model):
    """Fotografía asociada a una propiedad del catálogo."""

    property = models.ForeignKey(
        Property,
        related_name="photos",
        on_delete=models.CASCADE,
        verbose_name="Propiedad",
    )
    image = models.ImageField("Imagen", upload_to="properties/%Y/%m/")
    order = models.PositiveIntegerField("Orden", default=0)
    is_cover = models.BooleanField("Portada", default=False)
    alt_text = models.CharField("Texto alternativo", max_length=255, blank=True)
    created_at = models.DateTimeField("Subida el", auto_now_add=True)

    class Meta:
        verbose_name = "Foto de propiedad"
        verbose_name_plural = "Fotos de propiedades"
        ordering = ["order", "id"]

    def __str__(self) -> str:
        cover = " [portada]" if self.is_cover else ""
        return f"Foto #{self.pk} — {self.property.title}{cover}"
