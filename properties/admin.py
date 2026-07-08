"""Configuración del panel de administración — catálogo de propiedades."""

from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin

from .models import Property, PropertyPhoto


class PropertyPhotoInline(admin.TabularInline):
    model = PropertyPhoto
    extra = 0
    fields = ("image", "order", "is_cover", "alt_text")
    ordering = ("order", "id")


@admin.register(Property)
class PropertyAdmin(GISModelAdmin):
    """Admin funcional para gestionar el catálogo inmobiliario."""

    list_display = (
        "title",
        "property_type",
        "operation_type",
        "price",
        "currency",
        "zone",
        "city",
        "is_featured",
        "created_at",
    )
    list_filter = (
        "property_type",
        "operation_type",
        "zone",
        "state",
        "is_featured",
        "created_at",
    )
    search_fields = ("title", "address", "city", "zone", "description")
    readonly_fields = ("created_at", "updated_at")
    list_editable = ("is_featured",)
    date_hierarchy = "created_at"
    inlines = (PropertyPhotoInline,)


@admin.register(PropertyPhoto)
class PropertyPhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "property", "order", "is_cover", "created_at")
    list_filter = ("is_cover", "created_at")
    search_fields = ("property__title", "alt_text")
    ordering = ("property", "order", "id")
