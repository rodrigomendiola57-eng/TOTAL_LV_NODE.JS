"""Configuración del panel de administración — CRM interno."""

from django.contrib import admin

from .models import Agent, Lead, LeadMessage


class LeadMessageInline(admin.TabularInline):
    model = LeadMessage
    extra = 0
    readonly_fields = ("direction", "channel", "content", "sent_at", "delivery_status")
    can_delete = False


@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "email")
    search_fields = ("name", "phone", "email")


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "channel",
        "phone",
        "email",
        "status",
        "unread_count",
        "updated_at",
    )
    list_filter = ("channel", "status", "created_at")
    search_fields = ("name", "phone", "email", "external_contact_id")
    readonly_fields = ("created_at", "updated_at", "last_message_preview")
    list_editable = ("status",)
    inlines = [LeadMessageInline]
    autocomplete_fields = ("interested_in", "assigned_agent")


@admin.register(LeadMessage)
class LeadMessageAdmin(admin.ModelAdmin):
    list_display = ("lead", "direction", "channel", "content", "sent_at", "delivery_status")
    list_filter = ("direction", "channel", "delivery_status")
    search_fields = ("content", "external_id", "lead__name")
