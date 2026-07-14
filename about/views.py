"""Vistas API del módulo Nosotros."""

from __future__ import annotations

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from totalliving_backend.image_uploads import upload_image_error

from .models import AboutPage, TeamMember
from .serializers import (
    AboutPageSerializer,
    AboutPageUpdateSerializer,
    TeamMemberSerializer,
    TeamMemberWriteSerializer,
)
from .services import (
    ensure_about_page_seeded,
    ensure_team_seeded,
    resolve_about_payload,
    resolve_image_url,
)


class AboutPageViewSet(viewsets.ViewSet):
    """Singleton CMS: GET/PATCH /api/about-page/current/."""

    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def _get_page(self) -> AboutPage:
        return ensure_about_page_seeded()

    @action(detail=False, methods=["get", "patch"], url_path="current")
    def current(self, request):
        page = self._get_page()

        if request.method == "GET":
            lang = str(request.query_params.get("lang", "es")).lower()
            if lang in ("all", "raw", "edit"):
                return Response(
                    AboutPageSerializer(page, context={"request": request}).data,
                )
            if lang == "en":
                resolved = resolve_about_payload(page, "en")
                return Response({**resolved, "content_en": {}})
            return Response(
                AboutPageSerializer(page, context={"request": request}).data,
            )

        serializer = AboutPageUpdateSerializer(
            page,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            AboutPageSerializer(page, context={"request": request}).data,
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="current/mission-image",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_mission_image(self, request):
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
        page.mission_image = upload
        page.save(update_fields=["mission_image", "updated_at"])
        return Response(
            AboutPageSerializer(page, context={"request": request}).data,
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="current/vision-image",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_vision_image(self, request):
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
        page.vision_image = upload
        page.save(update_fields=["vision_image", "updated_at"])
        return Response(
            AboutPageSerializer(page, context={"request": request}).data,
        )


class TeamMemberViewSet(viewsets.ModelViewSet):
    """CRUD del equipo público /nosotros."""

    parser_classes = [JSONParser, MultiPartParser, FormParser]
    lookup_field = "slug"
    queryset = TeamMember.objects.all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return TeamMemberWriteSerializer
        return TeamMemberSerializer

    def get_queryset(self):
        ensure_team_seeded()
        qs = TeamMember.objects.all()
        if self.action == "list":
            include_all = self.request.query_params.get("all") in (
                "1",
                "true",
                "yes",
            )
            if not include_all:
                qs = qs.filter(is_published=True)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        return Response(
            TeamMemberSerializer(member, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
        )
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        return Response(
            TeamMemberSerializer(member, context={"request": request}).data,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=True,
        methods=["post"],
        url_path="photo",
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_photo(self, request, slug=None):
        upload = request.FILES.get("file") or request.FILES.get("image")
        if not upload:
            return Response(
                {"detail": "Envía el archivo en el campo 'file' o 'image'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        err = upload_image_error(upload)
        if err:
            return Response({"detail": err}, status=status.HTTP_400_BAD_REQUEST)
        member = self.get_object()
        member.photo = upload
        member.save(update_fields=["photo", "updated_at"])
        return Response(
            {
                "photo_url": resolve_image_url(
                    request,
                    member.photo,
                    member.photo_external_url,
                ),
                "member": TeamMemberSerializer(
                    member,
                    context={"request": request},
                ).data,
            },
        )
