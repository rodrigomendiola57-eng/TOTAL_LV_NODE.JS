"""Vistas de la API para el catálogo de propiedades."""

from __future__ import annotations

from django.db.models import Prefetch, QuerySet
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny

from .models import Property, PropertyPhoto
from .photo_service import (
    delete_property_photo,
    list_property_photos,
    reorder_property_photos,
    upload_property_photos,
)
from .serializers import PropertySerializer


class PropertyViewSet(viewsets.ModelViewSet):
    """
    CRUD de propiedades para el portal y el panel administrativo.

    Soporta filtros por query params:
    - `is_featured=true|false`
    - `operation_type=Venta|Renta|Venta o Renta`
    - `property_type=Casa|Departamento|...`
    - `zone=Zona Juriquilla / Jurica`
    """

    serializer_class = PropertySerializer
    permission_classes = [AllowAny]

    def get_queryset(self) -> QuerySet[Property]:
        photos_prefetch = Prefetch(
            "photos",
            queryset=PropertyPhoto.objects.order_by("order", "id"),
        )
        queryset: QuerySet[Property] = (
            Property.objects.all()
            .prefetch_related(photos_prefetch)
            .order_by("-created_at")
        )

        is_featured = self.request.query_params.get("is_featured")
        if is_featured is not None:
            is_featured_bool = is_featured.lower() in {"1", "true", "yes"}
            queryset = queryset.filter(is_featured=is_featured_bool)

        operation_type = self.request.query_params.get("operation_type")
        if operation_type:
            queryset = queryset.filter(operation_type=operation_type)

        property_type = self.request.query_params.get("property_type")
        if property_type:
            queryset = queryset.filter(property_type=property_type)

        zone = self.request.query_params.get("zone")
        if zone:
            queryset = queryset.filter(zone=zone)

        return queryset

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="photos",
        parser_classes=[MultiPartParser, FormParser],
    )
    def photos(self, request, pk=None):
        property_obj = self.get_object()
        if request.method == "GET":
            return list_property_photos(property_obj, request)
        return upload_property_photos(property_obj, request)

    @action(detail=True, methods=["post"], url_path="photos/reorder")
    def photos_reorder(self, request, pk=None):
        return reorder_property_photos(self.get_object(), request)

    @action(
        detail=True,
        methods=["delete"],
        url_path=r"photos/(?P<photo_pk>\d+)",
    )
    def photo_detail(self, request, pk=None, photo_pk=None):
        return delete_property_photo(self.get_object(), int(photo_pk))
