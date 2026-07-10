"""Vistas API del módulo desarrollos."""

from __future__ import annotations

from django.db.models import Prefetch
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import (
    Development,
    DevelopmentFloorPlan,
    DevelopmentGalleryImage,
    DevelopmentModelImage,
    DevelopmentsPage,
    DevelopmentUnitModel,
)
from .serializers import (
    DevelopmentDetailSerializer,
    DevelopmentFloorPlanSerializer,
    DevelopmentGalleryImageSerializer,
    DevelopmentListSerializer,
    DevelopmentModelImageSerializer,
    DevelopmentsPageSerializer,
    DevelopmentsPageUpdateSerializer,
    DevelopmentUnitModelSerializer,
    DevelopmentUnitModelWriteSerializer,
    DevelopmentWriteSerializer,
)
from .services import ensure_developments_page_seeded


class DevelopmentsPageViewSet(viewsets.ViewSet):
    """Singleton CMS: GET/PATCH /api/developments-page/current/."""

    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def _get_page(self) -> DevelopmentsPage:
        return ensure_developments_page_seeded()

    @action(detail=False, methods=["get", "patch"], url_path="current")
    def current(self, request):
        page = self._get_page()

        if request.method == "GET":
            return Response(
                DevelopmentsPageSerializer(page, context={"request": request}).data,
            )

        serializer = DevelopmentsPageUpdateSerializer(
            page,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            DevelopmentsPageSerializer(page, context={"request": request}).data,
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
        page = self._get_page()
        page.hero_image = upload
        page.save(update_fields=["hero_image", "updated_at"])
        return Response(
            DevelopmentsPageSerializer(page, context={"request": request}).data,
        )


def _development_queryset():
    return Development.objects.prefetch_related(
        "gallery_images",
        Prefetch(
            "unit_models",
            queryset=DevelopmentUnitModel.objects.prefetch_related(
                "gallery_images",
                "floor_plans",
            ),
        ),
    )


class DevelopmentViewSet(viewsets.ModelViewSet):
    """CRUD de desarrollos: /api/developments/."""

    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    pagination_class = None
    lookup_field = "slug"
    lookup_value_regex = r"[-a-zA-Z0-9_]+"

    def get_queryset(self):
        qs = _development_queryset()
        if self.action in {"list", "retrieve"}:
            published = self.request.query_params.get("published")
            if published == "1" or (
                published is None and self.request.query_params.get("public") == "1"
            ):
                qs = qs.filter(is_published=True)
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return DevelopmentListSerializer
        if self.action in {"create", "update", "partial_update"}:
            return DevelopmentWriteSerializer
        return DevelopmentDetailSerializer

    def create(self, request, *args, **kwargs):
        write = DevelopmentWriteSerializer(data=request.data)
        write.is_valid(raise_exception=True)
        development = write.save()
        detail = DevelopmentDetailSerializer(
            development,
            context={"request": request},
        )
        return Response(detail.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        write = DevelopmentWriteSerializer(
            instance,
            data=request.data,
            partial=partial,
        )
        write.is_valid(raise_exception=True)
        development = write.save()
        detail = DevelopmentDetailSerializer(
            development,
            context={"request": request},
        )
        return Response(detail.data)

    @action(
        detail=True,
        methods=["post"],
        url_path="cover-image",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_cover_image(self, request, slug=None):
        upload = request.FILES.get("file") or request.FILES.get("image")
        if not upload:
            return Response(
                {"detail": "Envía el archivo en el campo 'file' o 'image'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        development = self.get_object()
        development.cover_image = upload
        development.save(update_fields=["cover_image", "updated_at"])
        return Response(
            DevelopmentDetailSerializer(
                development,
                context={"request": request},
            ).data,
        )

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="gallery",
        parser_classes=[JSONParser, MultiPartParser, FormParser],
    )
    def gallery(self, request, slug=None):
        development = self.get_object()

        if request.method == "GET":
            data = DevelopmentGalleryImageSerializer(
                development.gallery_images.all(),
                many=True,
                context={"request": request},
            ).data
            return Response(data)

        upload = request.FILES.get("file") or request.FILES.get("image")
        external_url = request.data.get("external_url", "")
        if not upload and not external_url:
            return Response(
                {"detail": "Envía 'file'/'image' o 'external_url'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = development.gallery_images.count()
        item = DevelopmentGalleryImage.objects.create(
            development=development,
            image=upload if upload else None,
            external_url=external_url or "",
            alt_text=request.data.get("alt_text", ""),
            order=order,
        )
        return Response(
            DevelopmentGalleryImageSerializer(
                item,
                context={"request": request},
            ).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["delete"],
        url_path=r"gallery/(?P<image_id>[0-9]+)",
    )
    def delete_gallery_image(self, request, slug=None, image_id=None):
        development = self.get_object()
        deleted, _ = development.gallery_images.filter(pk=image_id).delete()
        if not deleted:
            return Response(
                {"detail": "Imagen no encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["get", "post"], url_path="models")
    def models(self, request, slug=None):
        development = self.get_object()

        if request.method == "GET":
            return Response(
                DevelopmentUnitModelSerializer(
                    development.unit_models.all(),
                    many=True,
                    context={"request": request},
                ).data,
            )

        write = DevelopmentUnitModelWriteSerializer(data=request.data)
        write.is_valid(raise_exception=True)
        unit = write.save(development=development)
        return Response(
            DevelopmentUnitModelSerializer(
                unit,
                context={"request": request},
            ).data,
            status=status.HTTP_201_CREATED,
        )


class DevelopmentUnitModelViewSet(viewsets.ModelViewSet):
    """CRUD de modelos anidados: /api/development-models/."""

    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    queryset = DevelopmentUnitModel.objects.select_related("development").prefetch_related(
        "gallery_images",
        "floor_plans",
    )

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return DevelopmentUnitModelWriteSerializer
        return DevelopmentUnitModelSerializer

    def create(self, request, *args, **kwargs):
        development_id = request.data.get("development")
        if not development_id:
            return Response(
                {"development": ["Requerido."]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            development = Development.objects.get(pk=development_id)
        except Development.DoesNotExist:
            return Response(
                {"development": ["Desarrollo no encontrado."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        write = DevelopmentUnitModelWriteSerializer(data=request.data)
        write.is_valid(raise_exception=True)
        unit = write.save(development=development)
        return Response(
            DevelopmentUnitModelSerializer(
                unit,
                context={"request": request},
            ).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        write = DevelopmentUnitModelWriteSerializer(
            instance,
            data=request.data,
            partial=partial,
        )
        write.is_valid(raise_exception=True)
        unit = write.save()
        return Response(
            DevelopmentUnitModelSerializer(
                unit,
                context={"request": request},
            ).data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="cover-image",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_cover_image(self, request, pk=None):
        upload = request.FILES.get("file") or request.FILES.get("image")
        if not upload:
            return Response(
                {"detail": "Envía el archivo en el campo 'file' o 'image'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        unit = self.get_object()
        unit.cover_image = upload
        unit.save(update_fields=["cover_image"])
        return Response(
            DevelopmentUnitModelSerializer(
                unit,
                context={"request": request},
            ).data,
        )

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="floor-plans",
        parser_classes=[JSONParser, MultiPartParser, FormParser],
    )
    def floor_plans(self, request, pk=None):
        unit = self.get_object()

        if request.method == "GET":
            return Response(
                DevelopmentFloorPlanSerializer(
                    unit.floor_plans.all(),
                    many=True,
                    context={"request": request},
                ).data,
            )

        label = request.data.get("label") or "Planta"
        upload = request.FILES.get("file") or request.FILES.get("image")
        external_url = request.data.get("external_url", "")
        if not upload and not external_url:
            return Response(
                {"detail": "Envía 'file'/'image' o 'external_url'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        plan = DevelopmentFloorPlan.objects.create(
            unit_model=unit,
            label=label,
            image=upload if upload else None,
            external_url=external_url or "",
            order=unit.floor_plans.count(),
        )
        return Response(
            DevelopmentFloorPlanSerializer(
                plan,
                context={"request": request},
            ).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["delete"],
        url_path=r"floor-plans/(?P<plan_id>[0-9]+)",
    )
    def delete_floor_plan(self, request, pk=None, plan_id=None):
        unit = self.get_object()
        deleted, _ = unit.floor_plans.filter(pk=plan_id).delete()
        if not deleted:
            return Response(
                {"detail": "Planta no encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="gallery",
        parser_classes=[JSONParser, MultiPartParser, FormParser],
    )
    def gallery(self, request, pk=None):
        unit = self.get_object()

        if request.method == "GET":
            return Response(
                DevelopmentModelImageSerializer(
                    unit.gallery_images.all(),
                    many=True,
                    context={"request": request},
                ).data,
            )

        upload = request.FILES.get("file") or request.FILES.get("image")
        external_url = request.data.get("external_url", "")
        if not upload and not external_url:
            return Response(
                {"detail": "Envía 'file'/'image' o 'external_url'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        item = DevelopmentModelImage.objects.create(
            unit_model=unit,
            image=upload if upload else None,
            external_url=external_url or "",
            order=unit.gallery_images.count(),
        )
        return Response(
            DevelopmentModelImageSerializer(
                item,
                context={"request": request},
            ).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["delete"],
        url_path=r"gallery/(?P<image_id>[0-9]+)",
    )
    def delete_gallery_image(self, request, pk=None, image_id=None):
        unit = self.get_object()
        deleted, _ = unit.gallery_images.filter(pk=image_id).delete()
        if not deleted:
            return Response(
                {"detail": "Imagen no encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)
