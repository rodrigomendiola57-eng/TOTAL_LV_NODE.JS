from django.contrib import admin

from .models import AsesoriaPage


@admin.register(AsesoriaPage)
class AsesoriaPageAdmin(admin.ModelAdmin):
    list_display = ("id", "hero_title", "is_published", "updated_at")
    readonly_fields = ("updated_at",)
