"""Lógica de negocio para fotos de propiedades."""

from __future__ import annotations

from django.db import transaction
from django.db.models import Max
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from .image_processing import optimize_uploaded_file
from .models import Property, PropertyPhoto
from .photo_serializers import PropertyPhotoSerializer, PropertyPhotoUploadSerializer


def ensure_cover(property_obj: Property) -> None:
    photos = PropertyPhoto.objects.filter(property=property_obj).order_by("order", "id")
    if not photos.exists():
        return

    cover = photos.filter(is_cover=True).first()
    if cover is None:
        first = photos.first()
        if first is not None:
            first.is_cover = True
            first.save(update_fields=["is_cover"])


def list_property_photos(property_obj: Property, request: Request) -> Response:
    photos = property_obj.photos.all().order_by("order", "id")
    serializer = PropertyPhotoSerializer(
        photos,
        many=True,
        context={"request": request},
    )
    return Response(serializer.data)


def upload_property_photos(property_obj: Property, request: Request) -> Response:
    files = request.FILES.getlist("images")
    if not files and request.FILES.get("image"):
        files = [request.FILES["image"]]

    if not files:
        return Response(
            {"detail": "Envía al menos una imagen en el campo `images`."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    max_order = (
        PropertyPhoto.objects.filter(property=property_obj).aggregate(Max("order"))[
            "order__max"
        ]
        or -1
    )
    has_photos = PropertyPhoto.objects.filter(property=property_obj).exists()

    created: list[PropertyPhoto] = []
    errors: list[str] = []

    for index, uploaded_file in enumerate(files):
        upload_serializer = PropertyPhotoUploadSerializer(
            data={"image": uploaded_file},
        )
        if not upload_serializer.is_valid():
            errors.append(
                f"{uploaded_file.name}: {upload_serializer.errors.get('image', upload_serializer.errors)}",
            )
            continue

        photo = PropertyPhoto.objects.create(
            property=property_obj,
            image=optimize_uploaded_file(upload_serializer.validated_data["image"]),
            order=max_order + 1 + index,
            is_cover=not has_photos and index == 0,
        )
        has_photos = True
        created.append(photo)

    if not created and errors:
        return Response({"detail": errors}, status=status.HTTP_400_BAD_REQUEST)

    serializer = PropertyPhotoSerializer(
        created,
        many=True,
        context={"request": request},
    )
    response_status = status.HTTP_201_CREATED if created else status.HTTP_400_BAD_REQUEST
    return Response(
        {"created": serializer.data, "errors": errors},
        status=response_status,
    )


def delete_property_photo(
    property_obj: Property,
    photo_pk: int,
) -> Response:
    photo = get_object_or_404(PropertyPhoto, pk=photo_pk, property=property_obj)
    was_cover = photo.is_cover
    photo.image.delete(save=False)
    photo.delete()

    if was_cover:
        ensure_cover(property_obj)

    return Response(status=status.HTTP_204_NO_CONTENT)


def reorder_property_photos(property_obj: Property, request: Request) -> Response:
    items = request.data.get("photos")

    if not isinstance(items, list) or not items:
        return Response(
            {"detail": "Envía `photos` como lista de {id, order}."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cover_id = request.data.get("cover_id")

    with transaction.atomic():
        for item in items:
            photo_id = item.get("id")
            order = item.get("order")
            if photo_id is None or order is None:
                continue
            PropertyPhoto.objects.filter(
                pk=photo_id,
                property=property_obj,
            ).update(order=order)

        if cover_id is not None:
            PropertyPhoto.objects.filter(property=property_obj).update(is_cover=False)
            PropertyPhoto.objects.filter(
                pk=cover_id,
                property=property_obj,
            ).update(is_cover=True)

        ensure_cover(property_obj)

    photos = property_obj.photos.all().order_by("order", "id")
    serializer = PropertyPhotoSerializer(
        photos,
        many=True,
        context={"request": request},
    )
    return Response(serializer.data)
