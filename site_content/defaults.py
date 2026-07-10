"""Valores por defecto del módulo Inicio (espejo del contenido actual del frontend)."""

from __future__ import annotations

from typing import Any

HOME_PAGE_DEFAULTS: dict[str, Any] = {
    "hero_eyebrow": "Real Estate Premium",
    "hero_title": "Total Living",
    "hero_subtitle": "Estrategia Real detrás de cada Propiedad",
    "about_eyebrow": "Quiénes somos",
    "about_title": "Estrategia Real detrás de cada Propiedad",
    "about_body": (
        "Total Living es una firma inmobiliaria premium en Querétaro. "
        "Acompañamos cada decisión con análisis, estrategia y ejecución "
        "para que inviertas con claridad y tranquilidad."
    ),
    "about_cta_label": "Conoce al equipo",
    "about_cta_url": "/nosotros",
    "about_social_label": "Síguenos",
    "featured_eyebrow": "Selección Total Living",
    "featured_title": "Propiedades Destacadas",
    "featured_empty_message": (
        "Aún no hay propiedades destacadas publicadas. "
        "En breve mostraremos nuevas oportunidades premium."
    ),
    "featured_links": [
        {"label": "Propiedades en Venta", "href": "/propiedades/venta"},
        {"label": "Propiedades en Renta", "href": "/propiedades/renta"},
        {"label": "Desarrollos", "href": "/propiedades/desarrollos"},
    ],
    "zones_eyebrow": "Zonas",
    "zones_title": "Ubicaciones Estratégicas",
    "zones_description": (
        "Explora las 8 zonas principales de Querétaro con experiencia "
        "inmersiva a pantalla completa: Campanario, Juriquilla, Zibatá, "
        "Centro y más."
    ),
    "zones_cta_label": "Explorar zonas",
    "zones_cta_url": "/zonas",
    "contact_eyebrow": "Contacto",
    "contact_title": "¿Listo para dar el siguiente paso?",
    "contact_description": (
        "Visita nuestro módulo de contacto y cuéntanos qué buscas. "
        "Tu consulta llegará directo al equipo comercial."
    ),
    "contact_cta_label": "Ir a contacto",
    "contact_cta_url": "/contacto",
    "expertise_title": "Inteligencia Inmobiliaria para Decisiones Reales",
    "expertise_subtitle": (
        "Un solo equipo para asesorarte, analizar el mercado y ejecutar con el "
        "estándar premium que tu patrimonio merece."
    ),
}

CITY_HIGHLIGHT_DEFAULTS: dict[str, Any] = {
    "aria_label": "Querétaro — epicentro del lujo inmobiliario",
    "city_name": "Querétaro",
    "title": "El epicentro del lujo y la plusvalía",
    "description": (
        "Querétaro concentra la mayor proyección de desarrollo inmobiliario "
        "premium en el Bajío. La zona correcta, en el momento exacto, "
        "transforma una simple compra en un legado patrimonial."
    ),
}

EXPERTISE_SERVICES_DEFAULTS: list[dict[str, Any]] = [
    {
        "slug": "asesoria",
        "title": "Asesoría personalizada",
        "description": (
            "Alineamos objetivos patrimoniales, presupuesto y timing para "
            "construir una estrategia inmobiliaria a tu medida."
        ),
        "bullets": [
            "Perfil de inversión y estilo de vida",
            "Acompañamiento 1:1 durante todo el proceso",
            "Negociación táctica con enfoque en valor",
        ],
        "icon": "UsersRound",
        "order": 0,
    },
    {
        "slug": "analisis",
        "title": "Análisis de mercado",
        "description": (
            "Combinamos data local y lectura comercial para detectar "
            "oportunidades con mayor plusvalía y menor riesgo."
        ),
        "bullets": [
            "Comparables por zona y segmento",
            "Estimación de retorno y horizonte de salida",
            "Monitoreo de tendencia por micromercado",
        ],
        "icon": "BarChart3",
        "order": 1,
    },
    {
        "slug": "cvr",
        "title": "Compra, venta y renta",
        "description": (
            "Gestionamos el ciclo completo de la operación con ejecución "
            "premium en legal, marketing y cierre."
        ),
        "bullets": [
            "Estrategia de colocación de activos",
            "Filtrado y calificación de prospectos",
            "Cierre notarial con control documental",
        ],
        "icon": "Building2",
        "order": 2,
    },
]

EXPERTISE_PILLARS_DEFAULTS: list[dict[str, Any]] = [
    {
        "slug": "legal",
        "title": "Seguridad Legal",
        "description": (
            "Blindamos cada operación con validación documental y "
            "acompañamiento jurídico experto."
        ),
        "bento_class": "sm:col-span-2",
        "order": 0,
    },
    {
        "slug": "marketing",
        "title": "Marketing Premium",
        "description": (
            "Narrativa visual de alto impacto y posicionamiento estratégico "
            "para acelerar cierres."
        ),
        "bento_class": "sm:col-span-1",
        "order": 1,
    },
    {
        "slug": "trust",
        "title": "Confianza Total",
        "description": (
            "Proceso transparente de punta a punta, con asesoría humana y "
            "seguimiento continuo."
        ),
        "bento_class": "sm:col-span-1",
        "order": 2,
    },
]

ABOUT_SLIDES_DEFAULTS: list[dict[str, Any]] = [
    {
        "alt_text": "Fachada residencial contemporánea",
        "external_url": (
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            "?auto=format&fit=crop&w=1600&q=80"
        ),
        "order": 0,
    },
    {
        "alt_text": "Propiedad premium con vista panorámica",
        "external_url": (
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
            "?auto=format&fit=crop&w=1600&q=80"
        ),
        "order": 1,
    },
    {
        "alt_text": "Interior de diseño minimalista",
        "external_url": (
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
            "?auto=format&fit=crop&w=1600&q=80"
        ),
        "order": 2,
    },
    {
        "alt_text": "Residencia moderna con jardín",
        "external_url": (
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3"
            "?auto=format&fit=crop&w=1600&q=80"
        ),
        "order": 3,
    },
]
