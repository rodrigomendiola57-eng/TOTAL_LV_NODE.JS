"""Autenticación por token con caducidad (alineada a la cookie del panel)."""

from __future__ import annotations

from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from rest_framework import exceptions
from rest_framework.authentication import TokenAuthentication


class ExpiringTokenAuthentication(TokenAuthentication):
    """
    Token DRF estándar + TTL.
    Si el token es más viejo que AUTH_TOKEN_TTL_SECONDS, se elimina y se rechaza.
    """

    def authenticate_credentials(self, key):
        model = self.get_model()
        try:
            token = model.objects.select_related("user").get(key=key)
        except model.DoesNotExist as exc:
            raise exceptions.AuthenticationFailed("Token inválido.") from exc

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed("Usuario inactivo.")

        ttl = int(getattr(settings, "AUTH_TOKEN_TTL_SECONDS", 60 * 60 * 24 * 7))
        if ttl > 0 and token.created < timezone.now() - timedelta(seconds=ttl):
            token.delete()
            raise exceptions.AuthenticationFailed("Sesión expirada. Inicia sesión de nuevo.")

        return (token.user, token)
