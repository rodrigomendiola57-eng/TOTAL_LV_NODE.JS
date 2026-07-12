"""Resolución de IP del cliente detrás de proxies de confianza.

Solo se leen X-Real-IP / X-Forwarded-For si REMOTE_ADDR está en
TRUSTED_PROXY_IPS (p. ej. Next en 127.0.0.1). Así un atacante no puede
spoofear la IP mandando XFF directo a Django.
"""

from __future__ import annotations

from django.conf import settings


def get_client_ip(request) -> str:
    remote = (request.META.get("REMOTE_ADDR") or "").strip()
    trusted = {
        str(ip).strip()
        for ip in (getattr(settings, "TRUSTED_PROXY_IPS", None) or [])
        if str(ip).strip()
    }

    if remote and remote in trusted:
        real = (request.META.get("HTTP_X_REAL_IP") or "").strip()
        if real:
            return real.split(",")[0].strip() or remote
        xff = (request.META.get("HTTP_X_FORWARDED_FOR") or "").strip()
        if xff:
            return xff.split(",")[0].strip() or remote
        return remote

    return remote or "unknown"
