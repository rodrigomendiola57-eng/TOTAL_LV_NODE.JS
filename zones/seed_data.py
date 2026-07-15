"""Datos iniciales del catálogo de zonas (alineado al front estático)."""

ZONE_SEED = [
    {
        "slug": "zibata-zakia",
        "name": "Zona Zibatá / Zakia",
        "growth_label": "Crecimiento alto",
        "description": (
            "Master plan de clase mundial con campo de golf, amenidades tipo "
            "resort, arquitectura contemporánea y la comunidad más dinámica del Bajío."
        ),
        "sub_zones": ["Zibatá", "Zakia", "Zizana", "Ziré", "La Vista", "El Mayorazgo"],
        "image_external_url": (
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"
            "?q=80&w=2070&auto=format&fit=crop"
        ),
    },
    {
        "slug": "el-refugio",
        "name": "Zona El Refugio / Norte de El Marqués",
        "growth_label": "Emergente",
        "description": (
            "Una de las zonas de mayor expansión reciente. Desarrollos modernos, "
            "vialidades nuevas y alta demanda de vivienda para familias jóvenes."
        ),
        "sub_zones": [
            "El Refugio",
            "Nuevo Refugio",
            "La Pradera",
            "Real Solare",
            "Paseos del Marqués",
            "El Mirador",
            "Capital Sur",
        ],
        "image_external_url": (
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
            "?q=80&w=2070&auto=format&fit=crop"
        ),
    },
    {
        "slug": "campanario-altozano",
        "name": "Zona Campanario / Altozano",
        "growth_label": "Plusvalía premium",
        "description": (
            "Las zonas residenciales más exclusivas y lujosas de Querétaro, "
            "con residencias premium, estricta seguridad, clubes deportivos y campos de golf."
        ),
        "sub_zones": [
            "El Campanario",
            "Campanario Norte",
            "Lomas del Campanario",
            "Altozano",
            "La Espiga",
        ],
        "image_external_url": (
            "https://images.unsplash.com/photo-1613977257363-707ba9348227"
            "?q=80&w=2070&auto=format&fit=crop"
        ),
    },
    {
        "slug": "juriquilla-jurica",
        "name": "Zona Juriquilla / Jurica",
        "growth_label": "Plusvalía premium",
        "description": (
            "Referente de exclusividad en el norte de Querétaro. Residencias "
            "de alto nivel, universidades, centros corporativos y calidad de vida superior."
        ),
        "sub_zones": [
            "Juriquilla",
            "Jurica",
            "Cumbres del Lago",
            "Santa Fe Juriquilla",
            "San Isidro Juriquilla",
            "Lomas de Juriquilla",
            "Villas del Mesón",
        ],
        "image_external_url": (
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde"
            "?q=80&w=2070&auto=format&fit=crop"
        ),
    },
    {
        "slug": "centro-tradicional",
        "name": "Zona Centro / Querétaro Tradicional",
        "growth_label": "Crecimiento medio",
        "description": (
            "El corazón histórico y cultural de la ciudad. Arquitectura colonial, "
            "vida urbana vibrante y patrimonio UNESCO a pasos de tu hogar."
        ),
        "sub_zones": [
            "Centro Histórico",
            "Álamos",
            "Carretas",
            "Calesa",
            "Milenio III",
            "Loma Dorada",
            "Jardines de Querétaro",
            "Hércules",
            "La Cañada",
        ],
        "image_external_url": (
            "https://images.unsplash.com/photo-1596436889106-be35e843f974"
            "?q=80&w=2070&auto=format&fit=crop"
        ),
    },
    {
        "slug": "corregidora",
        "name": "Zona Corregidora",
        "growth_label": "Crecimiento alto",
        "description": (
            "Municipio en constante crecimiento con desarrollos residenciales "
            "accesibles, plusvalía sostenida y conectividad hacia Querétaro capital."
        ),
        "sub_zones": [
            "El Pueblito",
            "Tejeda",
            "Candiles",
            "Cañadas del Lago",
            "Cañadas del Arroyo",
            "Vista Real",
            "Balvanera",
            "Puerta Real",
        ],
        "image_external_url": (
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            "?q=80&w=2070&auto=format&fit=crop"
        ),
    },
    {
        "slug": "ciudad-del-sol",
        "name": "Zona Ciudad del Sol / Poniente",
        "growth_label": "Crecimiento medio",
        "description": (
            "Zona poniente consolidada con excelente infraestructura, "
            "centros comerciales, escuelas de prestigio y comunidades familiares establecidas."
        ),
        "sub_zones": [
            "Ciudad del Sol",
            "Cerrito Colorado",
            "Sonterra",
            "Viñedos",
            "Rancho Bellavista",
            "Puertas del Sol",
            "Satélite",
        ],
        "image_external_url": (
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
            "?q=80&w=2070&auto=format&fit=crop"
        ),
    },
    {
        "slug": "centro-sur",
        "name": "Zona Centro Sur / Sur de Querétaro",
        "growth_label": "Crecimiento alto",
        "description": (
            "Corredor urbano en expansión con conectividad estratégica, "
            "desarrollos verticales modernos y acceso rápido al centro y al aeropuerto."
        ),
        "sub_zones": [
            "Centro Sur",
            "Cumbres del Cimatario",
            "Vista Dorada",
            "Colinas del Cimatario",
            "Claustros del Sur",
            "Lomas de Casa Blanca",
        ],
        "image_external_url": (
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
            "?q=80&w=2070&auto=format&fit=crop"
        ),
    },
    {
        "slug": "industrial-logistica",
        "name": "Zona Industrial / Logística",
        "growth_label": "Crecimiento alto",
        "description": (
            "Corredor industrial y logístico de primer nivel con alta "
            "conectividad terrestre, parques corporativos y cercanía al aeropuerto."
        ),
        "sub_zones": [
            "Parque Industrial Querétaro",
            "Bernardo Quintana",
            "El Marqués",
            "FINSA",
            "Terra Business Park",
            "Aeropuerto",
            "5 de Febrero",
            "Santa Rosa Jáuregui",
        ],
        "image_external_url": (
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
            "?q=80&w=2070&auto=format&fit=crop"
        ),
    },
]
