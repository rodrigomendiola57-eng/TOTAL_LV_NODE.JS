"""Mapeo de datos EasyBroker → modelos de Total Living."""

from __future__ import annotations

from decimal import Decimal, InvalidOperation
from typing import Any

from django.contrib.gis.geos import Point

from properties.choices import MexicanState, OperationType, PropertyType, QueretaroZone


def _normalize(value: str | None) -> str:
    return (value or "").strip()


def _match_choice(value: str | None, choices: type) -> str:
    normalized = _normalize(value)
    if not normalized:
        return ""

    for choice_value, _label in choices.choices:
        if normalized.casefold() == choice_value.casefold():
            return choice_value

    return ""


def _parse_location_parts(location_name: str | None) -> tuple[str, str, str]:
    parts = [_normalize(part) for part in (location_name or "").split(",") if _normalize(part)]
    if not parts:
        return "", "", ""

    state = parts[-1]
    city = parts[-2] if len(parts) >= 2 else parts[0]
    address = ", ".join(parts[:-2]) if len(parts) >= 3 else location_name or city
    return address, city, state


def map_operation_type(operations: list[dict[str, Any]] | None) -> str:
    types = {(_normalize(op.get("type"))).casefold() for op in (operations or [])}

    has_sale = "sale" in types
    has_rental = "rental" in types or "rent" in types

    if has_sale and has_rental:
        return OperationType.VENTA_O_RENTA
    if has_rental:
        return OperationType.RENTA
    return OperationType.VENTA


def map_primary_price(operations: list[dict[str, Any]] | None) -> tuple[Decimal, str]:
    if not operations:
        return Decimal("0"), "MXN"

    operation = operations[0]
    amount = operation.get("amount") or 0
    currency = _normalize(operation.get("currency")) or "MXN"

    try:
        price = Decimal(str(amount))
    except (InvalidOperation, TypeError):
        price = Decimal("0")

    return price, currency


def map_property_type(value: str | None) -> str:
    mapped = _match_choice(value, PropertyType)
    return mapped or PropertyType.OTRO


def map_state(value: str | None) -> str:
    mapped = _match_choice(value, MexicanState)
    return mapped or MexicanState.QUERETARO


def map_zone(_value: str | None = None) -> str:
    return QueretaroZone.OTRA


def map_property_fields(detail: dict[str, Any]) -> dict[str, Any]:
    location = detail.get("location") or {}
    location_name = location.get("name")
    parsed_address, parsed_city, parsed_state = _parse_location_parts(location_name)

    operations = detail.get("operations") or []
    price, currency = map_primary_price(operations)

    latitude = location.get("latitude")
    longitude = location.get("longitude")
    point = None
    maps_link = ""
    if latitude is not None and longitude is not None:
        lat = float(latitude)
        lng = float(longitude)
        point = Point(lng, lat, srid=4326)
        # Nunca guardar public_url de EasyBroker aquí: ese campo es el listing,
        # no un enlace de Google Maps.
        maps_link = (
            "https://www.google.com/maps/search/?api=1"
            f"&query={lat},{lng}"
        )

    bathrooms = detail.get("bathrooms") or 0
    half_bathrooms = detail.get("half_bathrooms") or 0

    return {
        "title": _normalize(detail.get("title")) or "Propiedad sin título",
        "property_type": map_property_type(detail.get("property_type")),
        "operation_type": map_operation_type(operations),
        "price": price,
        "currency": currency,
        "description": _normalize(detail.get("description")),
        "address": _normalize(location.get("street")) or parsed_address or parsed_city or "Sin dirección",
        "state": map_state(parsed_state),
        "city": parsed_city or "Sin ciudad",
        "postal_code": _normalize(location.get("postal_code")) or "00000",
        "zone": map_zone(),
        "maps_link": maps_link,
        "location": point,
        "bedrooms": int(detail.get("bedrooms") or 0),
        "full_bathrooms": int(bathrooms),
        "half_bathrooms": int(half_bathrooms),
        "parking_spaces": int(detail.get("parking_spaces") or 0),
        "build_area_m2": Decimal(str(detail.get("construction_size") or 0)),
        "land_area_m2": Decimal(str(detail.get("lot_size") or 0)),
        "levels": int(detail.get("floors") or 1),
        "front_measure_m": Decimal(str(detail.get("lot_width"))) if detail.get("lot_width") else None,
        "depth_measure_m": Decimal(str(detail.get("lot_length"))) if detail.get("lot_length") else None,
        "build_year": None,
        "environments": 0,
        "maintenance_fee": Decimal(str(detail.get("expenses"))) if detail.get("expenses") else None,
    }


def extract_features(detail: dict[str, Any]) -> list[tuple[str, str | None]]:
    """Extrae amenidades/características de una propiedad EasyBroker.

    EasyBroker puede devolver ``features`` como lista de strings o de objetos
    ``{"name": ..., "category": ...}``. Se normaliza a una lista de tuplas
    ``(nombre, categoría | None)`` sin duplicados.
    """
    raw = detail.get("features") or detail.get("amenities") or []
    features: list[tuple[str, str | None]] = []
    seen: set[str] = set()

    if not isinstance(raw, list):
        return features

    for item in raw:
        name = ""
        category: str | None = None

        if isinstance(item, str):
            name = _normalize(item)
        elif isinstance(item, dict):
            name = _normalize(item.get("name") or item.get("title"))
            category = _normalize(item.get("category")) or None

        if not name:
            continue

        key = name.casefold()
        if key in seen:
            continue
        seen.add(key)
        features.append((name, category))

    return features


def extract_image_urls(detail: dict[str, Any]) -> list[str]:
    images = detail.get("property_images") or detail.get("images") or []
    urls: list[str] = []
    for image in images:
        url = _normalize(image.get("url"))
        if url and url not in urls:
            urls.append(url)
    return urls
