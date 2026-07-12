"""Restricciones de superficie para Django Admin."""

from __future__ import annotations

from django.conf import settings
from django.http import HttpResponseForbidden

from accounts.client_ip import get_client_ip


class AdminIPRestrictMiddleware:
    """
    Si ADMIN_ALLOWED_IPS tiene valores, solo esas IPs pueden abrir ADMIN_URL.
    Vacío = sin restricción por IP (desarrollo).
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        allowed = getattr(settings, "ADMIN_ALLOWED_IPS", None) or []
        if allowed:
            admin_prefix = "/" + str(settings.ADMIN_URL).lstrip("/")
            if request.path.startswith(admin_prefix):
                ip = get_client_ip(request)
                if ip not in allowed:
                    return HttpResponseForbidden("Acceso al admin denegado.")
        return self.get_response(request)
