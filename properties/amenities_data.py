"""Catálogo semilla de amenidades — Total Living.

Fuente única de verdad para poblar el modelo ``Amenity``. Se usa tanto en la
migración de datos inicial como en el comando ``sync_amenities`` para mantener
el catálogo actualizado sin duplicar registros.

Cada entrada es una tupla ``(slug, nombre, categoría, ícono)`` donde el ícono
corresponde a un componente de ``lucide-react`` en el frontend.
"""

from __future__ import annotations

# Categorías (deben coincidir con AmenityCategory en choices.py)
SEGURIDAD = "Seguridad"
DESARROLLO = "Amenidades del desarrollo"
INTERIOR = "Interiores"
EXTERIOR = "Exteriores y áreas verdes"
SERVICIOS = "Servicios"
UBICACION = "Ubicación y vistas"

# (slug, nombre, categoría, ícono lucide)
AMENITIES: list[tuple[str, str, str, str]] = [
    # Seguridad
    ("caseta-vigilancia", "Caseta de vigilancia", SEGURIDAD, "ShieldCheck"),
    ("vigilancia-24-7", "Vigilancia 24/7", SEGURIDAD, "Shield"),
    ("acceso-controlado", "Acceso controlado", SEGURIDAD, "KeyRound"),
    ("circuito-cerrado", "Circuito cerrado (CCTV)", SEGURIDAD, "Cctv"),
    ("privada-cerrada", "Privada / Coto cerrado", SEGURIDAD, "Fence"),
    ("porton-electrico", "Portón eléctrico", SEGURIDAD, "DoorClosed"),
    ("alarma", "Sistema de alarma", SEGURIDAD, "BellRing"),
    ("interfon", "Interfón / Videoportero", SEGURIDAD, "Phone"),
    # Amenidades del desarrollo
    ("alberca", "Alberca", DESARROLLO, "Waves"),
    ("gimnasio", "Gimnasio", DESARROLLO, "Dumbbell"),
    ("casa-club", "Casa club", DESARROLLO, "Building"),
    ("salon-eventos", "Salón de eventos", DESARROLLO, "PartyPopper"),
    ("juegos-infantiles", "Área de juegos infantiles", DESARROLLO, "ToyBrick"),
    ("cancha-padel", "Cancha de pádel", DESARROLLO, "CircleDot"),
    ("cancha-tenis", "Cancha de tenis", DESARROLLO, "CircleDot"),
    ("cancha-multiusos", "Cancha de usos múltiples", DESARROLLO, "CircleDot"),
    ("asadores", "Área de asadores", DESARROLLO, "Flame"),
    ("business-center", "Business center", DESARROLLO, "Briefcase"),
    ("sala-juntas", "Sala de juntas", DESARROLLO, "Users"),
    ("spa", "Spa", DESARROLLO, "Sparkles"),
    ("sauna", "Sauna / Vapor", DESARROLLO, "Thermometer"),
    ("jacuzzi", "Jacuzzi", DESARROLLO, "Bath"),
    ("roof-garden", "Roof garden / Sky garden", DESARROLLO, "TreePalm"),
    ("pet-friendly", "Área para mascotas", DESARROLLO, "PawPrint"),
    ("ciclovia", "Ciclovía / Bike racks", DESARROLLO, "Bike"),
    ("lago", "Lago / Espejo de agua", DESARROLLO, "Waves"),
    ("ludoteca", "Ludoteca", DESARROLLO, "Blocks"),
    ("cine", "Sala de cine / TV", DESARROLLO, "Clapperboard"),
    # Interiores
    ("cocina-integral", "Cocina integral", INTERIOR, "ChefHat"),
    ("cocina-equipada", "Cocina equipada", INTERIOR, "UtensilsCrossed"),
    ("closets", "Clósets / Vestidor", INTERIOR, "Shirt"),
    ("aire-acondicionado", "Aire acondicionado", INTERIOR, "Snowflake"),
    ("calefaccion", "Calefacción", INTERIOR, "Thermometer"),
    ("chimenea", "Chimenea", INTERIOR, "Flame"),
    ("cuarto-lavado", "Cuarto de lavado", INTERIOR, "WashingMachine"),
    ("cuarto-servicio", "Cuarto de servicio", INTERIOR, "BedSingle"),
    ("estudio", "Estudio / Home office", INTERIOR, "Laptop"),
    ("family-room", "Family room / Sala de TV", INTERIOR, "Tv"),
    ("bodega-storage", "Bodega / Storage", INTERIOR, "Package"),
    ("domotica", "Domótica / Casa inteligente", INTERIOR, "Cpu"),
    ("pisos-madera", "Pisos de madera", INTERIOR, "Layers"),
    ("doble-altura", "Doble altura", INTERIOR, "MoveVertical"),
    ("elevador", "Elevador", INTERIOR, "ArrowUpDown"),
    ("amueblado", "Amueblado", INTERIOR, "Sofa"),
    # Exteriores y áreas verdes
    ("jardin-privado", "Jardín privado", EXTERIOR, "Trees"),
    ("terraza", "Terraza", EXTERIOR, "Sun"),
    ("balcon", "Balcón", EXTERIOR, "PanelTop"),
    ("alberca-privada", "Alberca privada", EXTERIOR, "Waves"),
    ("asador-propio", "Asador / BBQ propio", EXTERIOR, "Flame"),
    ("patio-servicio", "Patio de servicio", EXTERIOR, "SquareStack"),
    ("estacionamiento-techado", "Estacionamiento techado", EXTERIOR, "Car"),
    ("paneles-solares", "Paneles solares", EXTERIOR, "SunMedium"),
    # Servicios
    ("agua-potable", "Agua potable", SERVICIOS, "Droplets"),
    ("drenaje", "Drenaje", SERVICIOS, "Pipette"),
    ("electricidad", "Electricidad", SERVICIOS, "Plug"),
    ("gas-natural", "Gas natural", SERVICIOS, "Flame"),
    ("internet-fibra", "Internet / Fibra óptica", SERVICIOS, "Wifi"),
    ("cisterna", "Cisterna", SERVICIOS, "Container"),
    ("tinaco", "Tinaco", SERVICIOS, "CircleGauge"),
    ("planta-luz", "Planta de luz / Generador", SERVICIOS, "Zap"),
    ("calentador-solar", "Calentador solar", SERVICIOS, "Sun"),
    # Ubicación y vistas
    ("vista-montana", "Vista a la montaña", UBICACION, "Mountain"),
    ("vista-lago", "Vista al lago", UBICACION, "Waves"),
    ("vista-panoramica", "Vista panorámica", UBICACION, "Eye"),
    ("cerca-escuelas", "Cerca de escuelas", UBICACION, "GraduationCap"),
    ("cerca-comercios", "Cerca de centros comerciales", UBICACION, "ShoppingBag"),
    ("cerca-hospitales", "Cerca de hospitales", UBICACION, "Stethoscope"),
    ("acceso-autopista", "Acceso a autopista", UBICACION, "Milestone"),
]


def iter_seed_rows():
    """Devuelve filas normalizadas con su orden dentro de cada categoría."""
    per_category: dict[str, int] = {}
    for slug, name, category, icon in AMENITIES:
        order = per_category.get(category, 0)
        per_category[category] = order + 1
        yield {
            "slug": slug,
            "name": name,
            "category": category,
            "icon": icon,
            "order": order,
        }
