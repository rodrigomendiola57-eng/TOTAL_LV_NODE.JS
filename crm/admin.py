"""Configuración del panel de administración — CRM interno."""

from django.contrib import admin

from .models import Agent, Lead


@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    """Admin para gestionar el equipo de asesores."""

    list_display = ("name", "phone", "email")
    search_fields = ("name", "phone", "email")


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    """Admin CRM básico para seguimiento de prospectos."""

    list_display = (
        "name",
        "phone",
        "email",
        "interested_in",
        "status",
        "created_at",
    )
    list_filter = ("status", "created_at", "interested_in")
    search_fields = ("name", "phone", "email")
    readonly_fields = ("created_at",)
    list_editable = ("status",)
    date_hierarchy = "created_at"
    autocomplete_fields = ("interested_in",)
