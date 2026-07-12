"""Vistas API del CRM."""

from __future__ import annotations

from django.db.models import Q
from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts.permissions import IsStaffUser
from accounts.security_alerts import maybe_alert_lead_spike
from accounts.throttles import LeadCreateThrottle
from .models import Lead, LeadChannel, LeadStatus
from .serializers import (
    LeadCreateSerializer,
    LeadMessageCreateSerializer,
    LeadMessageSerializer,
    LeadSerializer,
    LeadUpdateSerializer,
)
from .services import create_agent_note


class LeadViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Lead.objects.select_related("interested_in", "assigned_agent").filter(
        channel=LeadChannel.WEB,
    )
    pagination_class = None

    def get_permissions(self):
        # Formulario público de contacto puede crear leads.
        if self.action == "create":
            return [AllowAny()]
        return [IsStaffUser()]

    def get_throttles(self):
        if self.action == "create":
            return [LeadCreateThrottle()]
        return super().get_throttles()

    def get_serializer_class(self):
        if self.action == "create":
            return LeadCreateSerializer
        if self.action in {"partial_update", "update"}:
            return LeadUpdateSerializer
        return LeadSerializer

    def create(self, request, *args, **kwargs):
        # Honeypot: respuesta falsa sin persistir (bots que rellenan "website").
        honeypot = (request.data.get("website") or "").strip()
        if honeypot:
            now = timezone.now().isoformat()
            return Response(
                {
                    "id": 0,
                    "name": str(request.data.get("name") or "")[:120],
                    "phone": "",
                    "email": "",
                    "channel": LeadChannel.WEB,
                    "interested_in": None,
                    "status": "Nuevo",
                    "created_at": now,
                    "updated_at": now,
                },
                status=status.HTTP_201_CREATED,
            )
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            maybe_alert_lead_spike()
        return response

    def get_queryset(self):
        queryset = super().get_queryset()
        lead_status = self.request.query_params.get("status")
        unread = self.request.query_params.get("unread")
        search = (self.request.query_params.get("search") or "").strip()

        if lead_status and lead_status != "all":
            queryset = queryset.filter(status=lead_status)
        if unread == "true":
            queryset = queryset.filter(unread_count__gt=0)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(email__icontains=search)
                | Q(phone__icontains=search)
                | Q(last_message_preview__icontains=search),
            )

        return queryset

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        """Conteos ligeros para el resumen del dashboard (sin listar leads)."""
        qs = Lead.objects.filter(channel=LeadChannel.WEB)
        return Response(
            {
                "total": qs.count(),
                "active": qs.exclude(status=LeadStatus.CERRADO).count(),
            },
        )

    @action(detail=True, methods=["get"])
    def messages(self, request, pk=None):
        lead = self.get_object()
        serializer = LeadMessageSerializer(lead.messages.all(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def send_message(self, request, pk=None):
        lead = self.get_object()
        payload = LeadMessageCreateSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        content = payload.validated_data["content"].strip()
        if not content:
            return Response(
                {"detail": "El mensaje no puede estar vacío."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        message = create_agent_note(lead, content)
        return Response(
            LeadMessageSerializer(message).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        lead = self.get_object()
        lead.messages.filter(read_at__isnull=True).update(read_at=timezone.now())
        lead.unread_count = 0
        lead.save(update_fields=["unread_count"])
        return Response({"ok": True})
