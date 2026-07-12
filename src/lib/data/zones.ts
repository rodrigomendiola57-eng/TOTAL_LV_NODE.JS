import type { ZoneCatalogEntry } from "@/types/zone";

/**
 * Fallback estático si la API no responde.
 * Fuente de verdad en producción: GET /api/zones/
 */
export const ZONE_CATALOG: ZoneCatalogEntry[] = [
  {
    id: 1,
    slug: "campanario-altozano",
    name: "Zona Campanario / Altozano",
    growthLabel: "Plusvalía premium",
    description:
      "Las zonas residenciales más exclusivas y lujosas de Querétaro, con residencias premium, estricta seguridad, clubes deportivos y campos de golf.",
    subZones: [
      "El Campanario",
      "Campanario Norte",
      "Lomas del Campanario",
      "Altozano",
      "La Espiga",
    ],
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    slug: "centro-tradicional",
    name: "Zona Centro / Querétaro Tradicional",
    growthLabel: "Crecimiento medio",
    description:
      "El corazón histórico y cultural de la ciudad. Arquitectura colonial, vida urbana vibrante y patrimonio UNESCO a pasos de tu hogar.",
    subZones: [
      "Centro Histórico",
      "Jardines de la Hacienda",
      "Alameda",
      "Cimatario",
    ],
    image:
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    slug: "centro-sur",
    name: "Zona Centro Sur / Sur de Querétaro",
    growthLabel: "Crecimiento alto",
    description:
      "Corredor urbano en expansión con conectividad estratégica, desarrollos verticales modernos y acceso rápido al centro y al aeropuerto.",
    subZones: [
      "Centro Sur",
      "5 de Febrero",
      "La Pradera",
      "Satélite",
    ],
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    slug: "ciudad-del-sol",
    name: "Zona Ciudad del Sol / Poniente",
    growthLabel: "Crecimiento medio",
    description:
      "Zona poniente consolidada con excelente infraestructura, centros comerciales, escuelas de prestigio y comunidades familiares establecidas.",
    subZones: [
      "Ciudad del Sol",
      "Villas del Sol",
      "Paseos del Sol",
      "Del Sol",
    ],
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 5,
    slug: "corregidora",
    name: "Zona Corregidora",
    growthLabel: "Crecimiento alto",
    description:
      "Municipio en constante crecimiento con desarrollos residenciales accesibles, plusvalía sostenida y conectividad hacia Querétaro capital.",
    subZones: [
      "El Pueblito",
      "Los Ángeles",
      "Villas del Mesón",
      "San Antonio",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 6,
    slug: "el-refugio",
    name: "Zona El Refugio / Norte de El Marqués",
    growthLabel: "Emergente",
    description:
      "Una de las zonas de mayor expansión reciente. Desarrollos modernos, vialidades nuevas y alta demanda de vivienda para familias jóvenes.",
    subZones: [
      "El Refugio",
      "La Cañada",
      "Paseo de la República",
      "Milenio III",
    ],
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 7,
    slug: "juriquilla-jurica",
    name: "Zona Juriquilla / Jurica",
    growthLabel: "Plusvalía premium",
    description:
      "Referente de exclusividad en el norte de Querétaro. Residencias de alto nivel, universidades, centros corporativos y calidad de vida superior.",
    subZones: [
      "Juriquilla",
      "Jurica",
      "Bosques del Lago",
      "Lomas de Juriquilla",
    ],
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 8,
    slug: "zibata-zakia",
    name: "Zona Zibatá / Zakia",
    growthLabel: "Crecimiento alto",
    description:
      "Master plan de clase mundial con campo de golf, amenidades tipo resort, arquitectura contemporánea y la comunidad más dinámica del Bajío.",
    subZones: [
      "Zibatá",
      "Zakia",
      "La Pradera",
      "Balvanera",
    ],
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop",
  },
];

export function getZoneCatalogFallback(): ZoneCatalogEntry[] {
  return ZONE_CATALOG;
}

/** @deprecated Prefer listZoneCatalog() desde API; se mantiene por compatibilidad. */
export function getZoneCatalog(): ZoneCatalogEntry[] {
  return ZONE_CATALOG;
}

export function getZoneBySlug(slug: string): ZoneCatalogEntry | undefined {
  return ZONE_CATALOG.find((zone) => zone.slug === slug);
}

export function zonePropertiesHref(zoneName: string): string {
  const params = new URLSearchParams();
  params.set("zone", zoneName);
  return `/propiedades/venta?${params.toString()}`;
}
