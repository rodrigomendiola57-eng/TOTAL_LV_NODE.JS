from rest_framework.throttling import AnonRateThrottle

from accounts.client_ip import get_client_ip


class ClientIpThrottleMixin:
    """Usa la misma IP que alertas/admin (proxies de confianza)."""

    def get_ident(self, request):
        return get_client_ip(request)


class AuthLoginThrottle(ClientIpThrottleMixin, AnonRateThrottle):
    """Limita intentos de login (brute force)."""

    scope = "auth_login"


class LeadCreateThrottle(ClientIpThrottleMixin, AnonRateThrottle):
    """Limita envíos del formulario de contacto (spam)."""

    scope = "lead_create"
