"""Vistas API del módulo zonas."""

from __future__ import annotations

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from totalliving_backend.image_uploads import upload_image_error

from .models import Zone, ZonesPage
from .serializers import (
    ZoneSerializer,
    ZoneWriteSerializer,
    ZonesPageSerializer,
    ZonesPageUpdateSerializer,
)
from .services import ensure_zones_page_seeded, ensure_zones_seeded, resolve_image_url


def _bad_image(upload):
    err = upload_image_error(upload)
    if err:
        return Response({"detail": err}, status=status.HTTP_400_BAD_REQUEST)
    return None


class ZonesPageViewSet(viewsets.ViewSet):
    """Singleton CMS: GET/PATCH /api/zones-page/current/."""

    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def _get_page(self) -> ZonesPage:
        return ensure_zones_page_seeded()

    @action(detail=False, methods=["get", "patch"], url_path="current")
    def current(self, request):
        page = self._get_page()

        if request.method == "GET":
            return Response(
                ZonesPageSerializer(page, context={"request": request}).data,
            )

        serializer = ZonesPageUpdateSerializer(
            page,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            ZonesPageSerializer(page, context={"request": request}).data,
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
        bad = _bad_image(upload)
        if bad:
            return bad
        page = self._get_page()
        page.hero_image = upload
        page.save(update_fields=["hero_image", "updated_at"])
        return Response(
            ZonesPageSerializer(page, context={"request": request}).data,
        )


class ZoneViewSet(viewsets.ModelViewSet):
    """
    CRUD del catálogo /zonas.

    - Público: list solo publicadas (salvo ?all=1 en dashboard).
    - Lookup por slug.
    """

    parser_classes = [JSONParser, MultiPartParser, FormParser]
    lookup_field = "slug"
    queryset = Zone.objects.all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ZoneWriteSerializer
        return ZoneSerializer

    def get_queryset(self):
        ensure_zones_seeded()
        qs = Zone.objects.all()
        if self.action == "list":
            include_all = self.request.query_params.get("all") in ("1", "true", "yes")
            user = self.request.user
            is_staff = bool(
                user and user.is_authenticated and getattr(user, "is_staff", False)
            )
            # ?all=1 solo para staff del panel; el público solo ve publicadas.
            if not include_all or not is_staff:
                qs = qs.filter(is_published=True)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        zone = serializer.save()
        return Response(
            ZoneSerializer(zone, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        zone = serializer.save()
        return Response(ZoneSerializer(zone, context={"request": request}).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=True,
        methods=["post"],
        url_path="image",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_image(self, request, slug=None):
        upload = request.FILES.get("file") or request.FILES.get("image")
        if not upload:
            return Response(
                {"detail": "Envía el archivo en el campo 'file' o 'image'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        bad = _bad_image(upload)
        if bad:
            return bad
        zone = self.get_object()
        zone.image = upload
        zone.save(update_fields=["image", "updated_at"])
        return Response(
            {
                "image_url": resolve_image_url(
                    request,
                    zone.image,
                    zone.image_external_url,
                ),
                "zone": ZoneSerializer(zone, context={"request": request}).data,
            },
        )
