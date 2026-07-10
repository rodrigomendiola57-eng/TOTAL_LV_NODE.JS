import type { DevelopmentStatus } from "@/types/development";

export type DevelopmentFormStepId =
  | "basic"
  | "specs"
  | "location"
  | "media"
  | "models";

export interface DevelopmentFormStep {
  id: DevelopmentFormStepId;
  label: string;
  shortLabel: string;
  description: string;
}

export const DEVELOPMENT_FORM_STEPS: DevelopmentFormStep[] = [
  {
    id: "basic",
    label: "Datos generales",
    shortLabel: "General",
    description: "Nombre, estatus, precio y publicación",
  },
  {
    id: "specs",
    label: "Características",
    shortLabel: "Specs",
    description: "Tipologías, rangos y amenidades",
  },
  {
    id: "location",
    label: "Ubicación",
    shortLabel: "Mapa",
    description: "Dirección y pin en el mapa",
  },
  {
    id: "media",
    label: "Fotografías",
    shortLabel: "Fotos",
    description: "Portada y galería del desarrollo",
  },
  {
    id: "models",
    label: "Modelos",
    shortLabel: "Modelos",
    description: "Tipologías con datos y fotos propias",
  },
];

export const DEVELOPMENT_STATUSES: DevelopmentStatus[] = [
  "Preventa",
  "En construcción",
  "Entrega inmediata",
];

export const SUGGESTED_UNIT_TYPES = [
  "Departamentos",
  "Penthouses",
  "Townhouses",
  "Villas",
  "Lofts",
  "Estudios",
];

export const SUGGESTED_AMENITIES = [
  "Alberca",
  "Gimnasio",
  "Rooftop",
  "Lobby",
  "Coworking",
  "Pet friendly",
  "Seguridad 24/7",
  "Estacionamiento visitas",
  "Áreas verdes",
  "Salón de usos múltiples",
  "Business center",
  "Spa",
];

export function formatPricePreview(value: string, currency = "MXN"): string {
  const parsed = Number(value);
  if (!value || Number.isNaN(parsed)) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(parsed);
}

export function slugifyPreview(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
