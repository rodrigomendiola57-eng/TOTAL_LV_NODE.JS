"""Vistas API del módulo Asesoría."""

from __future__ import annotations

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from totalliving_backend.image_uploads import upload_image_error

from .models import AsesoriaPage
from .serializers import AsesoriaPageSerializer, AsesoriaPageUpdateSerializer
from .services import ensure_asesoria_page_seeded


class AsesoriaPageViewSet(viewsets.ViewSet):
    """Singleton CMS: GET/PATCH /api/asesoria-page/current/."""

    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def _get_page(self) -> AsesoriaPage:
        return ensure_asesoria_page_seeded()

    @action(detail=False, methods=["get", "patch"], url_path="current")
    def current(self, request):
        page = self._get_page()

        if request.method == "GET":
            lang = str(request.query_params.get("lang", "es")).lower()
            if lang in ("all", "raw", "edit"):
                return Response(
                    AsesoriaPageSerializer(page, context={"request": request}).data,
                )
            if lang == "en":
                from .services import resolve_asesoria_payload
                resolved = resolve_asesoria_payload(page, "en", request)
                return Response({**resolved, "content_en": {}})
            return Response(
                AsesoriaPageSerializer(page, context={"request": request}).data,
            )

        serializer = AsesoriaPageUpdateSerializer(
            page,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            AsesoriaPageSerializer(page, context={"request": request}).data,
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="current/hero-image",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_hero_image(self, request):
        upload = request.FILES.get("file") or request.FILES.get("image")
        if not upload:
            return Response(
                {"detail": "Envía el archivo en el campo 'file' o 'image'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        err = upload_image_error(upload)
        if err:
            return Response({"detail": err}, status=status.HTTP_400_BAD_REQUEST)
        page = self._get_page()
        page.hero_image = upload
        page.save(update_fields=["hero_image", "updated_at"])
        return Response(
            AsesoriaPageSerializer(page, context={"request": request}).data,
        )
