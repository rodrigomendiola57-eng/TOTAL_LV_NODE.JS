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


def _as_non_negative_int(value, field_name: str) -> int:
    """Convierte id/order a int ≥ 0; lanza ValueError si no es numérico válido."""
    if isinstance(value, bool) or value is None:
        raise ValueError(field_name)
    if isinstance(value, int):
        number = value
    elif isinstance(value, str):
        cleaned = value.strip()
        if not cleaned.isdigit():
            raise ValueError(field_name)
        number = int(cleaned)
    else:
        raise ValueError(field_name)
    if number < 0:
        raise ValueError(field_name)
    return number


def parse_photo_reorder_items(
    items,
    cover_id,
) -> tuple[list[tuple[int, int]], int | None]:
    """
    Valida payload de reorder. Lanza ValueError con mensaje legible.
    Devuelve ([(photo_id, order), ...], cover_id|None).
    """
    if not isinstance(items, list) or not items:
        raise ValueError("Envía `photos` como lista de {id, order}.")

    parsed: list[tuple[int, int]] = []
    for item in items:
        if not isinstance(item, dict):
            raise ValueError("Cada ítem de `photos` debe ser un objeto {id, order}.")
        try:
            photo_id = _as_non_negative_int(item.get("id"), "id")
            order = _as_non_negative_int(item.get("order"), "order")
        except ValueError as exc:
            raise ValueError(
                "Cada foto necesita `id` y `order` enteros no negativos.",
            ) from exc
        parsed.append((photo_id, order))

    parsed_cover: int | None = None
    if cover_id is not None:
        try:
            parsed_cover = _as_non_negative_int(cover_id, "cover_id")
        except ValueError as exc:
            raise ValueError("`cover_id` debe ser un entero no negativo.") from exc

    return parsed, parsed_cover


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
    try:
        parsed, parsed_cover = parse_photo_reorder_items(
            request.data.get("photos"),
            request.data.get("cover_id"),
        )
    except ValueError as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        for photo_id, order in parsed:
            PropertyPhoto.objects.filter(
                pk=photo_id,
                property=property_obj,
            ).update(order=order)

        if parsed_cover is not None:
            PropertyPhoto.objects.filter(property=property_obj).update(is_cover=False)
            PropertyPhoto.objects.filter(
                pk=parsed_cover,
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
