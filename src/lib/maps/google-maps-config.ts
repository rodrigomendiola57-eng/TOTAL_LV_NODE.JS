import { DEFAULT_MAP_CENTER } from "@/lib/data/property-options";

/**
 * Configuración Google Maps Platform.
 * Guía: docs/GOOGLE_MAPS_FASE1.md · docs/GOOGLE_MAPS_FASE2.md
 */

const ENV_KEY = "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY";

/** Superficies del sitio con Google Maps. */
export const GOOGLE_MAPS_SURFACES = [
  "catalog",
  "property-detail",
  "development-detail",
  "dashboard-location-picker",
] as const;

export type GoogleMapsSurface = (typeof GOOGLE_MAPS_SURFACES)[number];

export const GOOGLE_MAPS_DEFAULT_CENTER = {
  lat: DEFAULT_MAP_CENTER.latitude,
  lng: DEFAULT_MAP_CENTER.longitude,
} as const;

export const GOOGLE_MAPS_DEFAULT_ZOOM = 12;

export const GOOGLE_MAPS_MEXICO_CENTER = {
  lat: 23.6345,
  lng: -102.5528,
} as const;

export const GOOGLE_MAPS_MEXICO_ZOOM = 5;

/** Bounds aproximados de México. */
export const GOOGLE_MAPS_MEXICO_BOUNDS = {
  south: 14.5,
  west: -118.4,
  north: 32.8,
  east: -86.5,
} as const;

/**
 * Map ID para Advanced Markers / clusters.
 * `DEMO_MAP_ID` funciona en desarrollo; en producción define
 * NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID desde Cloud Console.
 */
export function getGoogleMapsMapId(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() || "DEMO_MAP_ID";
}

export function getGoogleMapsApiKey(): string | null {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return key ? key : null;
}

export function isGoogleMapsConfigured(): boolean {
  return Boolean(getGoogleMapsApiKey());
}

export function assertGoogleMapsConfigured(): string {
  const key = getGoogleMapsApiKey();
  if (!key) {
    throw new Error(
      `[maps] Falta ${ENV_KEY}. Agrégala en .env y reinicia npm run dev.`,
    );
  }
  return key;
}
