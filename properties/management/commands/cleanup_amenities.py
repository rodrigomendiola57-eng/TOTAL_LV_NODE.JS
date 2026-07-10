"""Limpieza del catálogo de amenidades importadas desde EasyBroker.

- Fusiona sinónimos con las amenidades existentes (reasigna propiedades y borra
  el duplicado).
- Oculta y desvincula las "amenidades" que en realidad son atributos.
- Asigna ícono y categoría a las amenidades reales que llegaron sin ícono.

Es idempotente: puede ejecutarse varias veces sin efectos adversos.
"""

from __future__ import annotations

from django.core.management.base import BaseCommand
from django.db import transaction

from properties.choices import AmenityCategory
from properties.models import Amenity

# Nombre EasyBroker (minúsculas) → slug de la amenidad destino existente.
MERGES: dict[str, str] = {
    "cine": "cine",
    "clóset": "closets",
    "panel solar": "paneles-solares",
    "mascotas permitidas": "pet-friendly",
    "oficina": "estudio",
    "parrilla": "asadores",
    "garaje": "estacionamiento-techado",
}

# Atributos que no son amenidades: se ocultan y desvinculan.
HIDE: list[str] = [
    "dos plantas",
    "una sola planta",
    "planta baja",
    "penthouse",
]

# Amenidades reales: nombre (minúsculas) → (ícono lucide, categoría).
ASSIGN: dict[str, tuple[str, str]] = {
    "accesible para adultos mayores": ("Accessibility", AmenityCategory.DESARROLLO),
    "accesible para personas con discapacidad": (
        "Accessibility",
        AmenityCategory.DESARROLLO,
    ),
    "cocina": ("ChefHat", AmenityCategory.INTERIOR),
    "conmutador": ("Phone", AmenityCategory.SERVICIOS),
    "conexión para lavadora": ("WashingMachine", AmenityCategory.INTERIOR),
    "dormitorio principal": ("BedDouble", AmenityCategory.INTERIOR),
    "estacionamiento de visitas": ("Car", AmenityCategory.EXTERIOR),
    "fogatero": ("Flame", AmenityCategory.EXTERIOR),
    "fraccionamiento privado": ("Fence", AmenityCategory.SEGURIDAD),
    "hidroneumático": ("Gauge", AmenityCategory.SERVICIOS),
    "portero": ("BellRing", AmenityCategory.SEGURIDAD),
    "recámara en planta baja": ("BedDouble", AmenityCategory.INTERIOR),
    "permitido fumar": ("Cigarette", AmenityCategory.SERVICIOS),
    "facilidad para estacionarse": ("Car", AmenityCategory.EXTERIOR),
    "patio": ("Fence", AmenityCategory.EXTERIOR),
    "riego por aspersión": ("Droplets", AmenityCategory.EXTERIOR),
}


class Command(BaseCommand):
    help = "Fusiona, oculta y normaliza las amenidades importadas de EasyBroker."

    @transaction.atomic
    def handle(self, *args, **options) -> None:
        merged = 0
        hidden = 0
        assigned = 0

        # 1) Fusionar sinónimos con la amenidad existente.
        for source_name, target_slug in MERGES.items():
            source = Amenity.objects.filter(name__iexact=source_name).first()
            target = Amenity.objects.filter(slug=target_slug).first()
            if source is None or target is None or source.pk == target.pk:
                continue

            for prop in source.properties.all():
                prop.amenities.add(target)
            source.delete()
            merged += 1
            self.stdout.write(f"  Fusionada '{source_name}' -> {target_slug}")

        # 2) Ocultar y desvincular atributos que no son amenidades.
        for name in HIDE:
            attr = Amenity.objects.filter(name__iexact=name).first()
            if attr is None:
                continue
            attr.properties.clear()
            attr.is_active = False
            attr.save(update_fields=["is_active"])
            hidden += 1
            self.stdout.write(f"  Oculta '{name}'")

        # 3) Asignar ícono y categoría a las amenidades reales.
        for name, (icon, category) in ASSIGN.items():
            amenity = Amenity.objects.filter(name__iexact=name).first()
            if amenity is None:
                continue
            amenity.icon = icon
            amenity.category = category
            amenity.save(update_fields=["icon", "category"])
            assigned += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Limpieza completada: {merged} fusionadas, {hidden} ocultas, "
                f"{assigned} normalizadas."
            )
        )
