from django.contrib import admin

from .models import (
    HomeAboutSlide,
    HomeCityHighlight,
    HomeExpertisePillar,
    HomeExpertiseService,
    HomeJournalPost,
    HomePage,
)


class HomeAboutSlideInline(admin.TabularInline):
    model = HomeAboutSlide
    extra = 0


class HomeCityHighlightInline(admin.StackedInline):
    model = HomeCityHighlight
    max_num = 1
    can_delete = False


class HomeExpertiseServiceInline(admin.TabularInline):
    model = HomeExpertiseService
    extra = 0


class HomeExpertisePillarInline(admin.TabularInline):
    model = HomeExpertisePillar
    extra = 0


class HomeJournalPostInline(admin.TabularInline):
    model = HomeJournalPost
    extra = 0
    fields = [
        "kind",
        "category",
        "title",
        "date_label",
        "order",
        "is_active",
        "image",
        "video",
    ]


@admin.register(HomePage)
class HomePageAdmin(admin.ModelAdmin):
    inlines = [
        HomeAboutSlideInline,
        HomeCityHighlightInline,
        HomeExpertiseServiceInline,
        HomeExpertisePillarInline,
        HomeJournalPostInline,
    ]
    list_display = ["__str__", "is_published", "updated_at"]

    def has_add_permission(self, request):
        return not HomePage.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
