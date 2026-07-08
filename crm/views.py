"""Vistas API del CRM."""

from __future__ import annotations

from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from .models import Lead
from .serializers import LeadSerializer


class LeadViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Endpoint para crear leads desde el frontend.

    Solo expone `POST /api/leads/`.
    """

    queryset = Lead.objects.select_related("interested_in").all()
    serializer_class = LeadSerializer
    permission_classes = [AllowAny]
