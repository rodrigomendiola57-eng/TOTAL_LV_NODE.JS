from django.contrib import admin

from .models import Zone, ZonesPage


@admin.register(ZonesPage)
class ZonesPageAdmin(admin.ModelAdmin):
    list_display = ("hero_title", "is_published", "updated_at")


@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "growth_label", "is_published", "order", "updated_at")
    list_filter = ("growth_label", "is_published")
    search_fields = ("name", "slug", "description")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "name")
