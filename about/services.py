"""Helpers de media y seed del módulo Nosotros."""

from __future__ import annotations

from django.db import transaction

from .models import AboutPage, TeamMember
from .seed_data import TEAM_SEED


def absolute_media_url(request, file_field) -> str | None:
    if not file_field:
        return None
    url = file_field.url
    if request is None:
        return url
    return request.build_absolute_uri(url)


def resolve_image_url(request, file_field, external_url: str = "") -> str:
    uploaded = absolute_media_url(request, file_field)
    if uploaded:
        return uploaded
    return external_url or ""


@transaction.atomic
def ensure_about_page_seeded() -> AboutPage:
    return AboutPage.load()


@transaction.atomic
def ensure_team_seeded() -> int:
    ensure_about_page_seeded()
    if TeamMember.objects.exists():
        return TeamMember.objects.count()

    for row in TEAM_SEED:
        TeamMember.objects.create(
            slug=row["slug"],
            name=row["name"],
            role=row["role"],
            department=row["department"],
            bio=row["bio"],
            photo_external_url=row.get("photo_external_url") or "",
            socials=list(row.get("socials") or []),
            is_published=True,
            order=row.get("order", 0),
        )
    return TeamMember.objects.count()
