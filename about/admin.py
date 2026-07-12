from django.contrib import admin

from .models import AboutPage, TeamMember


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    list_display = ("id", "philosophy_title", "is_published", "updated_at")


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "department", "is_published", "order")
    list_filter = ("is_published", "department")
    search_fields = ("name", "role", "slug")
    prepopulated_fields = {"slug": ("name",)}
