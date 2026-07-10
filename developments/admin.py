from django.contrib import admin

from .models import (
    Development,
    DevelopmentFloorPlan,
    DevelopmentGalleryImage,
    DevelopmentModelImage,
    DevelopmentsPage,
    DevelopmentUnitModel,
)


class DevelopmentGalleryInline(admin.TabularInline):
    model = DevelopmentGalleryImage
    extra = 0


class DevelopmentUnitModelInline(admin.TabularInline):
    model = DevelopmentUnitModel
    extra = 0
    show_change_link = True


@admin.register(DevelopmentsPage)
class DevelopmentsPageAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not DevelopmentsPage.objects.exists()


@admin.register(Development)
class DevelopmentAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "status",
        "zone",
        "price_from",
        "featured",
        "is_published",
        "updated_at",
    )
    list_filter = ("status", "featured", "is_published", "city")
    search_fields = ("name", "slug", "developer", "zone")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [DevelopmentGalleryInline, DevelopmentUnitModelInline]


class DevelopmentModelImageInline(admin.TabularInline):
    model = DevelopmentModelImage
    extra = 0


class DevelopmentFloorPlanInline(admin.TabularInline):
    model = DevelopmentFloorPlan
    extra = 0


@admin.register(DevelopmentUnitModel)
class DevelopmentUnitModelAdmin(admin.ModelAdmin):
    list_display = ("name", "development", "bedrooms", "price_from", "available")
    list_filter = ("development",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [DevelopmentModelImageInline, DevelopmentFloorPlanInline]
