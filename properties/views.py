"""Vistas de la API para el catálogo de propiedades."""

from __future__ import annotations

from django.db.models import Prefetch, Q, QuerySet
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from .models import Amenity, Property, PropertyPhoto
from .photo_service import (
    delete_property_photo,
    list_property_photos,
    reorder_property_photos,
    upload_property_photos,
)
from .technical_sheet_service import (
    delete_technical_sheet,
    get_technical_sheet,
    upload_technical_sheet,
)
from .serializers import (
    AmenitySerializer,
    PropertyDashboardListSerializer,
    PropertySerializer,
)

ORDERING_ALIASES = {
    "newest": ("-created_at",),
    "price-asc": ("price", "id"),
    "price-desc": ("-price", "id"),
}

SIMILAR_PROPERTIES_LIMIT = 5


def _photos_prefetch() -> Prefetch:
    return Prefetch(
        "photos",
        queryset=PropertyPhoto.objects.order_by("order", "id"),
    )


def _collect_similar_properties(property_obj: Property) -> list[Property]:
    """Propiedades en la misma zona y operación; completa con ciudad/estado si hace falta."""
    selected: list[Property] = []
    seen_ids = {property_obj.pk}

    def extend_from(queryset: QuerySet[Property]) -> None:
        for candidate in queryset:
            if candidate.pk in seen_ids:
                continue
            selected.append(candidate)
            seen_ids.add(candidate.pk)
            if len(selected) >= SIMILAR_PROPERTIES_LIMIT:
                break

    base = (
        Property.objects.exclude(pk=property_obj.pk)
        .filter(operation_type=property_obj.operation_type)
        .prefetch_related(_photos_prefetch())
    )

    extend_from(base.filter(zone=property_obj.zone).order_by("-created_at"))

    if len(selected) < SIMILAR_PROPERTIES_LIMIT:
        extend_from(
            base.filter(city=property_obj.city, state=property_obj.state)
            .exclude(zone=property_obj.zone)
            .order_by("-created_at"),
        )

    if len(selected) < SIMILAR_PROPERTIES_LIMIT:
        extend_from(
            base.filter(state=property_obj.state)
            .exclude(city=property_obj.city)
            .order_by("-created_at"),
        )

    if len(selected) < SIMILAR_PROPERTIES_LIMIT:
        extend_from(base.order_by("-created_at"))

    return selected[:SIMILAR_PROPERTIES_LIMIT]


class AmenityViewSet(viewsets.ReadOnlyModelViewSet):
    """Catálogo público de amenidades activas para formularios y filtros."""

    serializer_class = AmenitySerializer
    pagination_class = None

    def get_queryset(self) -> QuerySet[Amenity]:
        return Amenity.objects.filter(is_active=True).order_by(
            "category", "order", "name",
        )


class PropertyViewSet(viewsets.ModelViewSet):
    """
    CRUD de propiedades para el portal y el panel administrativo.

    Soporta filtros por query params:
    - `is_featured=true|false`
    - `operation_type=Venta|Renta|Venta o Renta`
    - `property_type=Casa|Departamento|...`
    - `zone=Zona Juriquilla / Jurica`
    - `state=Querétaro`
    - `bedrooms_min=1|2|3|4`
    - `ordering=newest|price-asc|price-desc`
    - `search=texto` (título, ID EasyBroker, dirección, ciudad)
    """

    serializer_class = PropertySerializer
    def get_serializer_class(self):
        if (
            self.action == "list"
            and self.request.query_params.get("view") == "dashboard"
        ):
            return PropertyDashboardListSerializer
        return PropertySerializer

    def get_queryset(self) -> QuerySet[Property]:
        dashboard_view = (
            self.action == "list"
            and self.request.query_params.get("view") == "dashboard"
        )

        if dashboard_view:
            # Sin geometría ni amenities: listado admin mucho más rápido.
            queryset: QuerySet[Property] = (
                Property.objects.all()
                .defer("location")
                .prefetch_related(_photos_prefetch())
            )
        else:
            queryset = Property.objects.all().prefetch_related(
                _photos_prefetch(),
                "amenities",
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

        state = self.request.query_params.get("state")
        if state:
            queryset = queryset.filter(state=state)

        bedrooms_min = self.request.query_params.get("bedrooms_min")
        if bedrooms_min and bedrooms_min.isdigit():
            queryset = queryset.filter(bedrooms__gte=int(bedrooms_min))

        price_min = self.request.query_params.get("price_min", "").strip()
        if price_min:
            try:
                queryset = queryset.filter(price__gte=float(price_min))
            except ValueError:
                pass

        price_max = self.request.query_params.get("price_max", "").strip()
        if price_max:
            try:
                queryset = queryset.filter(price__lte=float(price_max))
            except ValueError:
                pass

        search = self.request.query_params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(easybroker_id__icontains=search)
                | Q(address__icontains=search)
                | Q(city__icontains=search)
                | Q(zone__icontains=search),
            )

        ordering = self.request.query_params.get("ordering", "newest")
        order_fields = ORDERING_ALIASES.get(ordering, ORDERING_ALIASES["newest"])
        return queryset.order_by(*order_fields)

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        """Conteos ligeros para el resumen del dashboard."""
        return Response(
            {
                "total": Property.objects.count(),
                "featured": Property.objects.filter(is_featured=True).count(),
            },
        )

    @action(detail=True, methods=["get"], url_path="similar")
    def similar(self, request, pk=None):
        property_obj = self.get_object()
        similar_properties = _collect_similar_properties(property_obj)
        serializer = self.get_serializer(
            similar_properties,
            many=True,
            context=self.get_serializer_context(),
        )
        payload = serializer.data
        if isinstance(payload, dict) and "features" in payload:
            return Response(payload)

        return Response(
            {
                "type": "FeatureCollection",
                "features": payload,
            },
        )

    @action(
        detail=True,
        methods=["get", "post", "delete"],
        url_path="technical-sheet",
        parser_classes=[MultiPartParser, FormParser],
    )
    def technical_sheet(self, request, pk=None):
        """
        GET público a propósito: la ficha se descarga en la ficha pública.
        POST/DELETE: solo staff (IsStaffOrReadOnly). Upload valida magic %PDF-.
        """
        property_obj = self.get_object()
        if request.method == "GET":
            return get_technical_sheet(property_obj, request)
        if request.method == "DELETE":
            return delete_technical_sheet(property_obj)
        return upload_technical_sheet(property_obj, request)

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
