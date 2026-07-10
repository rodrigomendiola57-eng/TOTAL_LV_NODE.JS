"""Servicios de carga y seed para contenido del sitio."""

from __future__ import annotations

from django.core.files.base import ContentFile
from django.db import transaction

from .defaults import (
    ABOUT_SLIDES_DEFAULTS,
    CITY_HIGHLIGHT_DEFAULTS,
    EXPERTISE_PILLARS_DEFAULTS,
    EXPERTISE_SERVICES_DEFAULTS,
    HOME_PAGE_DEFAULTS,
)
from .models import (
    HomeAboutSlide,
    HomeCityHighlight,
    HomeExpertisePillar,
    HomeExpertiseService,
    HomePage,
)
from .validators import validate_home_image


def _assign_image(instance, field_name: str, upload) -> None:
    validate_home_image(upload)
    getattr(instance, field_name).save(upload.name, upload, save=False)


def upload_hero_background(home_page: HomePage, upload) -> HomePage:
    _assign_image(home_page, "hero_background", upload)
    home_page.save(update_fields=["hero_background", "updated_at"])
    return home_page


def upload_city_image(
    city: HomeCityHighlight,
    variant: str,
    upload,
) -> HomeCityHighlight:
    field = "image_desktop" if variant == "desktop" else "image_mobile"
    _assign_image(city, field, upload)
    city.save()
    return city


def upload_about_slide_image(
    slide: HomeAboutSlide,
    upload,
    *,
    mobile: bool = False,
) -> HomeAboutSlide:
    field = "image_mobile" if mobile else "image"
    _assign_image(slide, field, upload)
    slide.save()
    return slide


@transaction.atomic
def ensure_home_content_seeded() -> HomePage:
    """Crea o completa el contenido de inicio con valores por defecto."""
    home, created = HomePage.objects.get_or_create(
        pk=1,
        defaults=dict(HOME_PAGE_DEFAULTS),
    )
    if not created:
        for key, value in HOME_PAGE_DEFAULTS.items():
            if not getattr(home, key, None):
                setattr(home, key, value)
        home.save()

    if not home.about_slides.exists():
        HomeAboutSlide.objects.bulk_create(
            [
                HomeAboutSlide(
                    home_page=home,
                    alt_text=item["alt_text"],
                    external_url=item.get("external_url", ""),
                    order=item["order"],
                )
                for item in ABOUT_SLIDES_DEFAULTS
            ],
        )

    if not hasattr(home, "city_highlight"):
        HomeCityHighlight.objects.create(
            home_page=home,
            **CITY_HIGHLIGHT_DEFAULTS,
            external_desktop_url="/images/home/queretaro-desktop.jpg",
            external_mobile_url="/images/home/queretaro-mobile.jpg",
        )

    if not home.expertise_services.exists():
        HomeExpertiseService.objects.bulk_create(
            [
                HomeExpertiseService(home_page=home, **item)
                for item in EXPERTISE_SERVICES_DEFAULTS
            ],
        )

    if not home.expertise_pillars.exists():
        HomeExpertisePillar.objects.bulk_create(
            [
                HomeExpertisePillar(home_page=home, **item)
                for item in EXPERTISE_PILLARS_DEFAULTS
            ],
        )

    return home
