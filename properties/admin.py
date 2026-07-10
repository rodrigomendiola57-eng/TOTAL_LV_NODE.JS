"""Configuración del panel de administración — catálogo de propiedades."""

from django.contrib import admin, messages
from django.contrib.gis.admin import GISModelAdmin
from django.shortcuts import redirect
from django.urls import path, reverse

from .easybroker.sync import sync_properties_from_easybroker
from .models import Amenity, Property, PropertyPhoto


class PropertyPhotoInline(admin.TabularInline):
    model = PropertyPhoto
    extra = 0
    fields = ("image", "order", "is_cover", "alt_text")
    ordering = ("order", "id")


@admin.register(Property)
class PropertyAdmin(GISModelAdmin):
    """Admin funcional para gestionar el catálogo inmobiliario."""

    change_list_template = "admin/properties/property/change_list.html"

    list_display = (
        "title",
        "property_type",
        "operation_type",
        "price",
        "currency",
        "zone",
        "city",
        "easybroker_id",
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
    search_fields = ("title", "address", "city", "zone", "description", "easybroker_id")
    readonly_fields = ("created_at", "updated_at", "easybroker_id", "easybroker_synced_at")
    list_editable = ("is_featured",)
    date_hierarchy = "created_at"
    inlines = (PropertyPhotoInline,)
    filter_horizontal = ("amenities",)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "sync-easybroker/",
                self.admin_site.admin_view(self.sync_easybroker_view),
                name="properties_property_sync_easybroker",
            ),
        ]
        return custom_urls + urls

    def sync_easybroker_view(self, request):
        result = sync_properties_from_easybroker()

        if result.errors and result.total_processed == 0:
            messages.error(request, result.errors[0])
        else:
            messages.success(
                request,
                (
                    f"Sincronización completada: {result.created} creadas, "
                    f"{result.updated} actualizadas, {result.skipped} omitidas. "
                    f"Amenidades: {result.amenities_linked} vinculadas, "
                    f"{result.amenities_created} nuevas creadas."
                ),
            )

        for error in result.errors[:10]:
            messages.warning(request, error)

        return redirect(reverse("admin:properties_property_changelist"))


@admin.register(PropertyPhoto)
class PropertyPhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "property", "order", "is_cover", "created_at")
    list_filter = ("is_cover", "created_at")
    search_fields = ("property__title", "alt_text")
    ordering = ("property", "order", "id")


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "icon", "order", "is_active")
    list_filter = ("category", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("name", "slug")
    ordering = ("category", "order", "name")
    prepopulated_fields = {"slug": ("name",)}
