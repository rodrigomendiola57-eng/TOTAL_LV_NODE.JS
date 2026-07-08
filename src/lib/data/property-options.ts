import type {
  OperationType,
  PropertyType,
  QueretaroZone,
} from "@/types/property";

export const PROPERTY_TYPES: PropertyType[] = [
  "Casa",
  "Departamento",
  "Terreno",
  "Condominio",
  "Casa en condominio",
  "Penthouse",
  "Local Comercial",
  "Oficina",
  "Consultorio",
  "Bodega",
  "Nave industrial",
  "Rancho",
  "Otro",
];

export const OPERATION_TYPES: OperationType[] = [
  "Venta",
  "Renta",
  "Venta o Renta",
];

export const QUERETARO_ZONES: QueretaroZone[] = [
  "Zona Campanario / Altozano",
  "Zona Centro / Querétaro Tradicional",
  "Zona Centro Sur / Sur de Querétaro",
  "Zona Ciudad del Sol / Poniente",
  "Zona Corregidora",
  "Zona El Refugio / Norte de El Marqués",
  "Zona Juriquilla / Jurica",
  "Zona Zibatá / Zakia",
];

/** Centro por defecto: Querétaro, Qro. */
export const DEFAULT_MAP_CENTER = {
  latitude: 20.5888,
  longitude: -100.3899,
} as const;
