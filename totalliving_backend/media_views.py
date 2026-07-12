"""Servir MEDIA de forma segura (sin path traversal)."""

from __future__ import annotations

from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404, HttpResponseForbidden
from django.views.decorators.http import require_GET


@require_GET
def serve_media(request, path: str):
    """
    Sirve archivos bajo MEDIA_ROOT (dev / proxy Next).
    Con S3/R2 activo no sirve disco local: las URLs deben ir al bucket.
    """
    if getattr(settings, "USE_S3", False):
        raise Http404()

    if not (
        settings.DEBUG
        or getattr(settings, "MEDIA_SERVE_FROM_DJANGO", False)
    ):
        raise Http404()

    raw = (path or "").replace("\\", "/")
    if not raw or raw.startswith("/") or "://" in raw:
        raise Http404()

    parts = [p for p in raw.split("/") if p]
    if any(p in (".", "..") for p in parts):
        raise Http404()

    root = Path(settings.MEDIA_ROOT).resolve()
    try:
        target = (root.joinpath(*parts)).resolve(strict=False)
        target.relative_to(root)
    except (OSError, ValueError) as exc:
        raise Http404() from exc

    if not target.is_file():
        raise Http404()

    if target.suffix.lower() in {".svg", ".svgz"}:
        return HttpResponseForbidden("SVG no se sirve desde media.")

    response = FileResponse(target.open("rb"), as_attachment=False)
    response["X-Content-Type-Options"] = "nosniff"
    content_type = response.get("Content-Type", "") or ""
    if content_type.startswith("text/") or "svg" in content_type.lower():
        response["Content-Disposition"] = f'attachment; filename="{target.name}"'
    return response
