"""Servicios de carga y seed para contenido del sitio."""

from __future__ import annotations

from django.db import transaction

from .defaults import (
    ABOUT_SLIDES_DEFAULTS,
    CITY_HIGHLIGHT_DEFAULTS,
    EXPERTISE_PILLARS_DEFAULTS,
    EXPERTISE_SERVICES_DEFAULTS,
    HOME_PAGE_DEFAULTS,
    JOURNAL_POSTS_DEFAULTS,
)
from .models import (
    HomeAboutSlide,
    HomeCityHighlight,
    HomeExpertisePillar,
    HomeExpertiseService,
    HomeJournalPost,
    HomePage,
)
from .validators import validate_home_image, validate_home_video

HOME_TEXT_KEYS = (
    "hero_eyebrow",
    "hero_title",
    "hero_subtitle",
    "about_eyebrow",
    "about_title",
    "about_body",
    "about_cta_label",
    "about_cta_url",
    "about_social_label",
    "featured_eyebrow",
    "featured_title",
    "featured_empty_message",
    "zones_eyebrow",
    "zones_title",
    "zones_description",
    "zones_cta_label",
    "zones_cta_url",
    "contact_eyebrow",
    "contact_title",
    "contact_description",
    "contact_cta_label",
    "contact_cta_url",
    "expertise_title",
    "expertise_subtitle",
)


def _assign_image(instance, field_name: str, upload) -> None:
    validate_home_image(upload)
    getattr(instance, field_name).save(upload.name, upload, save=False)


def _assign_video(instance, field_name: str, upload) -> None:
    validate_home_video(upload)
    getattr(instance, field_name).save(upload.name, upload, save=False)


def upload_hero_background(home_page: HomePage, upload) -> HomePage:
    _assign_image(home_page, "hero_background", upload)
    home_page.save(update_fields=["hero_background", "updated_at"])
    return home_page


def upload_hero_video(home_page: HomePage, upload) -> HomePage:
    _assign_video(home_page, "hero_video", upload)
    home_page.save(update_fields=["hero_video", "updated_at"])
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


def upload_journal_image(post: HomeJournalPost, upload) -> HomeJournalPost:
    _assign_image(post, "image", upload)
    post.save(update_fields=["image"])
    return post


def upload_journal_video(post: HomeJournalPost, upload) -> HomeJournalPost:
    _assign_video(post, "video", upload)
    post.save(update_fields=["video"])
    return post


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
            external_desktop_url="/images/home/campanario-queretaro.png",
            external_mobile_url="/images/home/queretaro-mobile.png",
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

    if not home.journal_posts.exists():
        HomeJournalPost.objects.bulk_create(
            [
                HomeJournalPost(home_page=home, **item)
                for item in JOURNAL_POSTS_DEFAULTS
            ],
        )

    if not home.content_en:
        home.content_en = {}
        home.save(update_fields=["content_en", "updated_at"])

    return home


def _pick_str(en_pack: dict[str, object], key: str, fallback: str) -> str:
    raw = en_pack.get(key)
    if isinstance(raw, str) and raw.strip():
        return raw
    return fallback


def resolve_home_payload(home: HomePage, locale: str = "es", serializer_data: dict | None = None) -> dict[str, object]:
    base = {
        "hero_eyebrow": home.hero_eyebrow,
        "hero_title": home.hero_title,
        "hero_subtitle": home.hero_subtitle,
        "about_eyebrow": home.about_eyebrow,
        "about_title": home.about_title,
        "about_body": home.about_body,
        "about_cta_label": home.about_cta_label,
        "about_cta_url": home.about_cta_url,
        "about_social_label": home.about_social_label,
        "featured_eyebrow": home.featured_eyebrow,
        "featured_title": home.featured_title,
        "featured_empty_message": home.featured_empty_message,
        "zones_eyebrow": home.zones_eyebrow,
        "zones_title": home.zones_title,
        "zones_description": home.zones_description,
        "zones_cta_label": home.zones_cta_label,
        "zones_cta_url": home.zones_cta_url,
        "contact_eyebrow": home.contact_eyebrow,
        "contact_title": home.contact_title,
        "contact_description": home.contact_description,
        "contact_cta_label": home.contact_cta_label,
        "contact_cta_url": home.contact_cta_url,
        "expertise_title": home.expertise_title,
        "expertise_subtitle": home.expertise_subtitle,
        "content_en": home.content_en or {},
    }
    if locale != "en":
        return base
    en_pack = home.content_en if isinstance(home.content_en, dict) else {}
    resolved = dict(base)
    for key in HOME_TEXT_KEYS:
        resolved[key] = _pick_str(en_pack, key, base[key])

    if serializer_data:
        city = serializer_data.get("city_highlight")
        if isinstance(city, dict):
            resolved_city = dict(city)
            resolved_city["city_name"] = _pick_str(en_pack, "city_highlight_city_name", city.get("city_name", ""))
            resolved_city["title"] = _pick_str(en_pack, "city_highlight_title", city.get("title", ""))
            resolved_city["description"] = _pick_str(en_pack, "city_highlight_description", city.get("description", ""))
            resolved_city["aria_label"] = _pick_str(en_pack, "city_highlight_aria_label", city.get("aria_label", ""))
            resolved["city_highlight"] = resolved_city

        journal_posts = serializer_data.get("journal_posts")
        if isinstance(journal_posts, list):
            resolved_posts = []
            for post in journal_posts:
                post_id = post.get("id")
                r_post = dict(post)
                if post_id:
                    r_post["title"] = _pick_str(en_pack, f"journal_post_{post_id}_title", post.get("title", ""))
                    r_post["body"] = _pick_str(en_pack, f"journal_post_{post_id}_body", post.get("body", ""))
                    r_post["date_label"] = _pick_str(en_pack, f"journal_post_{post_id}_date_label", post.get("date_label", ""))
                    r_post["category"] = _pick_str(en_pack, f"journal_post_{post_id}_category", post.get("category", ""))
                resolved_posts.append(r_post)
            resolved["journal_posts"] = resolved_posts

    return resolved
