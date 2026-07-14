"""Vistas API del módulo Contacto."""

from __future__ import annotations

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from .models import ContactPage
from .serializers import ContactPageSerializer, ContactPageUpdateSerializer
from .services import ensure_contact_page_seeded, resolve_contact_payload


class ContactPageViewSet(viewsets.ViewSet):
    """Singleton CMS: GET/PATCH /api/contact-page/current/."""

    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def _get_page(self) -> ContactPage:
        return ensure_contact_page_seeded()

    @action(detail=False, methods=["get", "patch"], url_path="current")
    def current(self, request):
        page = self._get_page()

        if request.method == "GET":
            lang = str(request.query_params.get("lang", "es")).lower()
            # Dashboard: payload completo (ES + content_en).
            if lang in ("all", "raw", "edit"):
                return Response(ContactPageSerializer(page).data)
            # Público EN: textos resueltos (fallback ES) sin content_en.
            if lang == "en":
                resolved = resolve_contact_payload(page, "en")
                return Response({**resolved, "content_en": {}})
            return Response(ContactPageSerializer(page).data)

        serializer = ContactPageUpdateSerializer(
            page,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ContactPageSerializer(page).data)
