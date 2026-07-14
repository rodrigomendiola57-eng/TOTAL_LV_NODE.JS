"""Vistas API del módulo de contenido del sitio."""

from __future__ import annotations

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from .models import (
    HomeAboutSlide,
    HomeCityHighlight,
    HomeExpertisePillar,
    HomeExpertiseService,
    HomeJournalPost,
    HomePage,
)
from .serializers import (
    HomeAboutSlideSerializer,
    HomeAboutSlideWriteSerializer,
    HomeCityHighlightSerializer,
    HomeCityHighlightUpdateSerializer,
    HomeExpertisePillarSerializer,
    HomeExpertisePillarWriteSerializer,
    HomeExpertiseServiceSerializer,
    HomeExpertiseServiceWriteSerializer,
    HomeJournalPostSerializer,
    HomeJournalPostWriteSerializer,
    HomePageDetailSerializer,
    HomePageUpdateSerializer,
)
from .services import (
    ensure_home_content_seeded,
    resolve_home_payload,
    upload_about_slide_image,
    upload_city_image,
    upload_hero_background,
    upload_hero_video,
    upload_journal_image,
    upload_journal_video,
)


class HomePageViewSet(viewsets.ViewSet):
    """Singleton de contenido de inicio: GET/PATCH en /api/home/current/."""

    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def _get_home(self) -> HomePage:
        return ensure_home_content_seeded()

    @action(detail=False, methods=["get", "patch"], url_path="current")
    def current(self, request):
        home = self._get_home()

        if request.method == "GET":
            lang = str(request.query_params.get("lang", "es")).lower()
            if lang in ("all", "raw", "edit"):
                serializer = HomePageDetailSerializer(home, context={"request": request})
                return Response(serializer.data)
            if lang == "en":
                serializer = HomePageDetailSerializer(home, context={"request": request})
                resolved = resolve_home_payload(home, "en", serializer.data)
                return Response({**serializer.data, **resolved, "content_en": {}})
            serializer = HomePageDetailSerializer(home, context={"request": request})
            return Response(serializer.data)

        update_serializer = HomePageUpdateSerializer(
            home,
            data=request.data,
            partial=True,
        )
        update_serializer.is_valid(raise_exception=True)
        update_serializer.save()
        detail = HomePageDetailSerializer(home, context={"request": request})
        return Response(detail.data)

    @action(
        detail=False,
        methods=["post"],
        url_path="current/hero-background",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_hero_background(self, request):
        upload = request.FILES.get("file") or request.FILES.get("image")
        if not upload:
            return Response(
                {"detail": "Envía el archivo en el campo 'file' o 'image'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        home = self._get_home()
        upload_hero_background(home, upload)
        serializer = HomePageDetailSerializer(home, context={"request": request})
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["post"],
        url_path="current/hero-video",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_hero_video(self, request):
        upload = request.FILES.get("file") or request.FILES.get("video")
        if not upload:
            return Response(
                {"detail": "Envía el archivo en el campo 'file' o 'video'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        home = self._get_home()
        upload_hero_video(home, upload)
        serializer = HomePageDetailSerializer(home, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["patch"], url_path="current/city-highlight")
    def update_city_highlight(self, request):
        home = self._get_home()
        city = home.city_highlight
        serializer = HomeCityHighlightUpdateSerializer(
            city,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            HomeCityHighlightSerializer(city, context={"request": request}).data,
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="current/city-highlight/image",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_city_image(self, request):
        upload = request.FILES.get("file") or request.FILES.get("image")
        if not upload:
            return Response(
                {"detail": "Envía el archivo en el campo 'file' o 'image'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        variant = request.query_params.get("variant", "desktop")
        if variant not in {"desktop", "mobile"}:
            return Response(
                {"detail": "El parámetro variant debe ser 'desktop' o 'mobile'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        home = self._get_home()
        city = home.city_highlight
        upload_city_image(city, variant, upload)
        return Response(
            HomeCityHighlightSerializer(city, context={"request": request}).data,
        )


class HomeAboutSlideViewSet(viewsets.ModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        home = ensure_home_content_seeded()
        return HomeAboutSlide.objects.filter(home_page=home)

    def get_serializer_class(self):
        if self.action in {"create", "partial_update", "update"}:
            return HomeAboutSlideWriteSerializer
        return HomeAboutSlideSerializer

    def perform_create(self, serializer):
        home = ensure_home_content_seeded()
        serializer.save(home_page=home)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return Response(
            HomeAboutSlideSerializer(instance, context={"request": request}).data,
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = HomeAboutSlideSerializer(
            queryset,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        write = HomeAboutSlideWriteSerializer(
            instance,
            data=request.data,
            partial=True,
        )
        write.is_valid(raise_exception=True)
        write.save()
        return Response(
            HomeAboutSlideSerializer(instance, context={"request": request}).data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="image",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_image(self, request, pk=None):
        upload = request.FILES.get("file") or request.FILES.get("image")
        if not upload:
            return Response(
                {"detail": "Envía el archivo en el campo 'file' o 'image'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        slide = self.get_object()
        mobile = request.query_params.get("variant") == "mobile"
        upload_about_slide_image(slide, upload, mobile=mobile)
        return Response(
            HomeAboutSlideSerializer(slide, context={"request": request}).data,
        )


class HomeExpertiseServiceViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        home = ensure_home_content_seeded()
        return HomeExpertiseService.objects.filter(home_page=home)

    def get_serializer_class(self):
        if self.action in {"create", "partial_update", "update"}:
            return HomeExpertiseServiceWriteSerializer
        return HomeExpertiseServiceSerializer

    def perform_create(self, serializer):
        home = ensure_home_content_seeded()
        serializer.save(home_page=home)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        return Response(HomeExpertiseServiceSerializer(queryset, many=True).data)

    def retrieve(self, request, *args, **kwargs):
        return Response(HomeExpertiseServiceSerializer(self.get_object()).data)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        write = HomeExpertiseServiceWriteSerializer(
            instance,
            data=request.data,
            partial=True,
        )
        write.is_valid(raise_exception=True)
        write.save()
        return Response(HomeExpertiseServiceSerializer(instance).data)


class HomeExpertisePillarViewSet(viewsets.ModelViewSet):
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        home = ensure_home_content_seeded()
        return HomeExpertisePillar.objects.filter(home_page=home)

    def get_serializer_class(self):
        if self.action in {"create", "partial_update", "update"}:
            return HomeExpertisePillarWriteSerializer
        return HomeExpertisePillarSerializer

    def perform_create(self, serializer):
        home = ensure_home_content_seeded()
        serializer.save(home_page=home)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        return Response(HomeExpertisePillarSerializer(queryset, many=True).data)

    def retrieve(self, request, *args, **kwargs):
        return Response(HomeExpertisePillarSerializer(self.get_object()).data)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        write = HomeExpertisePillarWriteSerializer(
            instance,
            data=request.data,
            partial=True,
        )
        write.is_valid(raise_exception=True)
        write.save()
        return Response(HomeExpertisePillarSerializer(instance).data)


class HomeJournalPostViewSet(viewsets.ModelViewSet):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        home = ensure_home_content_seeded()
        return HomeJournalPost.objects.filter(home_page=home)

    def get_serializer_class(self):
        if self.action in {"create", "partial_update", "update"}:
            return HomeJournalPostWriteSerializer
        return HomeJournalPostSerializer

    def perform_create(self, serializer):
        home = ensure_home_content_seeded()
        serializer.save(home_page=home)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        return Response(
            HomeJournalPostSerializer(
                queryset,
                many=True,
                context={"request": request},
            ).data,
        )

    def retrieve(self, request, *args, **kwargs):
        return Response(
            HomeJournalPostSerializer(
                self.get_object(),
                context={"request": request},
            ).data,
        )

    def create(self, request, *args, **kwargs):
        write = HomeJournalPostWriteSerializer(data=request.data)
        write.is_valid(raise_exception=True)
        self.perform_create(write)
        post = write.instance
        return Response(
            HomeJournalPostSerializer(post, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        write = HomeJournalPostWriteSerializer(
            instance,
            data=request.data,
            partial=True,
        )
        write.is_valid(raise_exception=True)
        write.save()
        return Response(
            HomeJournalPostSerializer(instance, context={"request": request}).data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="image",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_image(self, request, pk=None):
        upload = request.FILES.get("file") or request.FILES.get("image")
        if not upload:
            return Response(
                {"detail": "Envía el archivo en el campo 'file' o 'image'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        post = self.get_object()
        upload_journal_image(post, upload)
        return Response(
            HomeJournalPostSerializer(post, context={"request": request}).data,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="video",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_video(self, request, pk=None):
        upload = request.FILES.get("file") or request.FILES.get("video")
        if not upload:
            return Response(
                {"detail": "Envía el archivo en el campo 'file' o 'video'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        post = self.get_object()
        upload_journal_video(post, upload)
        return Response(
            HomeJournalPostSerializer(post, context={"request": request}).data,
        )
