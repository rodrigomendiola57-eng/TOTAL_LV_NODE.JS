export type DevelopmentStatus =
  | "Preventa"
  | "En construcción"
  | "Entrega inmediata";

/** Una planta/nivel del modelo (p. ej. "Planta baja", "Terraza"). */
export interface DevelopmentFloorPlan {
  id?: number;
  label: string;
  image: string;
}

/** Modelo/unidad tipo dentro de un desarrollo (p. ej. "DOMI PB"). */
export interface DevelopmentModel {
  id: number;
  slug: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  /** Medios baños adicionales (p. ej. 1 => "2 ½ baños"). */
  halfBathrooms?: number;
  /** Superficie construida en m². */
  areaM2: number;
  /** Superficie de terreno en m² (opcional, para casas/villas). */
  lotM2?: number;
  parking: number;
  /** Precio final / total. */
  priceFrom: number;
  /** Precio de lista antes de descuento (opcional). */
  listPrice?: number;
  image: string;
  description: string;
  /** Galería propia del modelo. */
  gallery?: string[];
  /** Otras características / detalles del modelo. */
  features?: string[];
  /** Plantas del modelo (1 a 4). */
  floorPlans?: DevelopmentFloorPlan[];
  /** Cuántas unidades de este modelo siguen disponibles. */
  available?: number;
  /** Recorrido 3D (Matterport). */
  tour?: DevelopmentModelTour | null;
}

export interface DevelopmentModelTour {
  provider: string;
  id: string;
  url?: string;
  title?: string;
  enabled: boolean;
}

export function formatBathrooms(bathrooms: number, half?: number): string {
  if (half && half > 0) return `${bathrooms} ½ baños`;
  return bathrooms === 1 ? "1 baño" : `${bathrooms} baños`;
}

export interface Development {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  developer: string;
  zone: string;
  city: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  status: DevelopmentStatus;
  priceFrom: number;
  currency: string;
  /** Texto de entrega, p. ej. "Q4 2026" o "Inmediata". */
  delivery: string;
  unitTypes: string[];
  bedroomsRange: [number, number];
  areaRange: [number, number];
  amenities: string[];
  coverImage: string;
  gallery: string[];
  models: DevelopmentModel[];
  totalUnits: number;
  featured?: boolean;
  description: string;
}

export function formatBedroomsRange(range: [number, number]): string {
  const [min, max] = range;
  if (min === max) return `${min} rec`;
  return `${min}–${max} rec`;
}

export function formatAreaRange(range: [number, number]): string {
  const [min, max] = range;
  if (min === max) return `${min} m²`;
  return `${min}–${max} m²`;
}
