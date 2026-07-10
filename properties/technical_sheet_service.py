"""Lógica de negocio para fichas técnicas PDF de propiedades."""

from __future__ import annotations

from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from .document_validators import validate_technical_sheet_pdf
from .models import Property


def _build_sheet_url(property_obj: Property, request: Request) -> str | None:
    if not property_obj.technical_sheet:
        return None
    return request.build_absolute_uri(property_obj.technical_sheet.url)


def get_technical_sheet(property_obj: Property, request: Request) -> Response:
    if not property_obj.technical_sheet:
        return Response({"url": None, "filename": None})

    return Response(
        {
            "url": _build_sheet_url(property_obj, request),
            "filename": property_obj.technical_sheet.name.rsplit("/", 1)[-1],
        },
    )


def upload_technical_sheet(property_obj: Property, request: Request) -> Response:
    uploaded_file = request.FILES.get("file") or request.FILES.get("technical_sheet")
    if not uploaded_file:
        return Response(
            {"detail": "Envía un PDF en el campo `file`."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        validate_technical_sheet_pdf(uploaded_file)
    except ValidationError as exc:
        return Response(
            {"detail": exc.messages[0] if exc.messages else str(exc)},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if property_obj.technical_sheet:
        property_obj.technical_sheet.delete(save=False)

    property_obj.technical_sheet = uploaded_file
    property_obj.save(update_fields=["technical_sheet", "updated_at"])

    return Response(
        {
            "url": _build_sheet_url(property_obj, request),
            "filename": property_obj.technical_sheet.name.rsplit("/", 1)[-1],
        },
        status=status.HTTP_201_CREATED,
    )


def delete_technical_sheet(property_obj: Property) -> Response:
    if property_obj.technical_sheet:
        property_obj.technical_sheet.delete(save=False)
        property_obj.technical_sheet = None
        property_obj.save(update_fields=["technical_sheet", "updated_at"])

    return Response(status=status.HTTP_204_NO_CONTENT)
