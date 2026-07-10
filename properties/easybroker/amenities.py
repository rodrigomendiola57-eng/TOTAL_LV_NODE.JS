"""Resolución de amenidades EasyBroker → catálogo de Total Living.

Empareja las ``features`` de EasyBroker con amenidades existentes (por alias,
nombre o slug) y crea automáticamente las que no existan en la base de datos.
"""

from __future__ import annotations

from django.utils.text import slugify

from properties.choices import AmenityCategory
from properties.models import Amenity

# Reglas para inferir la categoría a partir de la categoría de EasyBroker.
_CATEGORY_RULES: list[tuple[str, str]] = [
    ("segur", AmenityCategory.SEGURIDAD),
    ("vigil", AmenityCategory.SEGURIDAD),
    ("servic", AmenityCategory.SERVICIOS),
    ("interior", AmenityCategory.INTERIOR),
    ("exterior", AmenityCategory.EXTERIOR),
    ("jard", AmenityCategory.EXTERIOR),
    ("verde", AmenityCategory.EXTERIOR),
    ("vista", AmenityCategory.UBICACION),
    ("ubica", AmenityCategory.UBICACION),
    ("cercan", AmenityCategory.UBICACION),
]

# Alias EasyBroker (nombre en minúsculas) → slug del catálogo Total Living.
EB_FEATURE_ALIASES: dict[str, str] = {
    "alberca": "alberca",
    "pool": "alberca",
    "gimnasio": "gimnasio",
    "gym": "gimnasio",
    "casa club": "casa-club",
    "clubhouse": "casa-club",
    "salón de eventos": "salon-eventos",
    "salon de eventos": "salon-eventos",
    "salón de usos múltiples": "salon-eventos",
    "área de juegos": "juegos-infantiles",
    "area de juegos": "juegos-infantiles",
    "juegos infantiles": "juegos-infantiles",
    "playground": "juegos-infantiles",
    "cancha de pádel": "cancha-padel",
    "cancha de padel": "cancha-padel",
    "cancha de tenis": "cancha-tenis",
    "cancha de usos múltiples": "cancha-multiusos",
    "asador": "asadores",
    "asadores": "asadores",
    "área de asadores": "asadores",
    "roof garden": "roof-garden",
    "sky garden": "roof-garden",
    "pet friendly": "pet-friendly",
    "área para mascotas": "pet-friendly",
    "spa": "spa",
    "sauna": "sauna",
    "vapor": "sauna",
    "jacuzzi": "jacuzzi",
    "business center": "business-center",
    "sala de juntas": "sala-juntas",
    "elevador": "elevador",
    "elevator": "elevador",
    "cocina integral": "cocina-integral",
    "cocina equipada": "cocina-equipada",
    "closets": "closets",
    "clósets": "closets",
    "vestidor": "closets",
    "aire acondicionado": "aire-acondicionado",
    "calefacción": "calefaccion",
    "calefaccion": "calefaccion",
    "chimenea": "chimenea",
    "cuarto de lavado": "cuarto-lavado",
    "cuarto de servicio": "cuarto-servicio",
    "estudio": "estudio",
    "home office": "estudio",
    "family room": "family-room",
    "cuarto de tv": "family-room",
    "bodega": "bodega-storage",
    "storage": "bodega-storage",
    "domótica": "domotica",
    "casa inteligente": "domotica",
    "smart home": "domotica",
    "amueblado": "amueblado",
    "jardín": "jardin-privado",
    "jardin": "jardin-privado",
    "jardín privado": "jardin-privado",
    "terraza": "terraza",
    "balcón": "balcon",
    "balcon": "balcon",
    "paneles solares": "paneles-solares",
    "calentador solar": "calentador-solar",
    "agua potable": "agua-potable",
    "gas natural": "gas-natural",
    "internet": "internet-fibra",
    "fibra óptica": "internet-fibra",
    "wifi": "internet-fibra",
    "cisterna": "cisterna",
    "tinaco": "tinaco",
    "planta de luz": "planta-luz",
    "generador": "planta-luz",
    "caseta de vigilancia": "caseta-vigilancia",
    "vigilancia": "vigilancia-24-7",
    "vigilancia 24 horas": "vigilancia-24-7",
    "seguridad 24 horas": "vigilancia-24-7",
    "acceso controlado": "acceso-controlado",
    "circuito cerrado": "circuito-cerrado",
    "cctv": "circuito-cerrado",
    "cámaras de seguridad": "circuito-cerrado",
    "alarma": "alarma",
    "portón eléctrico": "porton-electrico",
    "porton electrico": "porton-electrico",
    "estacionamiento techado": "estacionamiento-techado",
    "vista a la montaña": "vista-montana",
    "vista al lago": "vista-lago",
    "vista panorámica": "vista-panoramica",
    # Sinónimos EasyBroker que mapean a amenidades existentes
    "cine": "cine",
    "clóset": "closets",
    "closet": "closets",
    "panel solar": "paneles-solares",
    "mascotas permitidas": "pet-friendly",
    "oficina": "estudio",
    "parrilla": "asadores",
    "garaje": "estacionamiento-techado",
}

# Features de EasyBroker que NO son amenidades (atributos de la propiedad).
# Se ignoran para no ensuciar el catálogo.
EB_IGNORED_FEATURES: set[str] = {
    "dos plantas",
    "una sola planta",
    "planta baja",
    "penthouse",
}


def _infer_category(eb_category: str | None) -> str:
    if eb_category:
        low = eb_category.casefold()
        for needle, category in _CATEGORY_RULES:
            if needle in low:
                return category
    return AmenityCategory.DESARROLLO


def _unique_slug(base: str, taken: set[str]) -> str:
    slug = (base or "amenidad")[:90]
    candidate = slug
    counter = 2
    while candidate in taken:
        suffix = f"-{counter}"
        candidate = f"{slug[: 90 - len(suffix)]}{suffix}"
        counter += 1
    return candidate


def resolve_amenities(
    features: list[tuple[str, str | None]],
) -> tuple[list[Amenity], list[Amenity]]:
    """Devuelve ``(amenidades, creadas)`` a partir de features EasyBroker.

    - Empareja por alias, nombre (case-insensitive) o slug.
    - Crea las amenidades faltantes con categoría inferida e ícono vacío
      (el frontend usa un ícono de respaldo).
    """
    all_amenities = list(Amenity.objects.all())
    by_name = {a.name.casefold(): a for a in all_amenities}
    by_slug = {a.slug: a for a in all_amenities}
    taken_slugs = set(by_slug.keys())

    resolved: list[Amenity] = []
    created: list[Amenity] = []
    seen_ids: set[int] = set()

    for name, eb_category in features:
        key = name.casefold()

        if key in EB_IGNORED_FEATURES:
            continue

        amenity: Amenity | None = None

        alias_slug = EB_FEATURE_ALIASES.get(key)
        if alias_slug:
            amenity = by_slug.get(alias_slug)

        if amenity is None:
            amenity = by_name.get(key)

        if amenity is None:
            slug = _unique_slug(slugify(name), taken_slugs)
            amenity = Amenity.objects.create(
                name=name[:80],
                slug=slug,
                category=_infer_category(eb_category),
                icon="",
                order=900,
                is_active=True,
            )
            taken_slugs.add(slug)
            by_name[key] = amenity
            by_slug[slug] = amenity
            created.append(amenity)

        if amenity.id not in seen_ids:
            seen_ids.add(amenity.id)
            resolved.append(amenity)

    return resolved, created
