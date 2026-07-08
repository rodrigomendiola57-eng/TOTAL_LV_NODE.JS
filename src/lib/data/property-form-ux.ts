import type { PropertyType } from "@/types/property";
import {
  Building2,
  Factory,
  Home,
  LandPlot,
  Layers,
  Store,
  TreePine,
  type LucideIcon,
} from "lucide-react";

export type FormStepId = "basic" | "location" | "features" | "media";

export interface FormStep {
  id: FormStepId;
  label: string;
  shortLabel: string;
  description: string;
}

export const FORM_STEPS: FormStep[] = [
  {
    id: "basic",
    label: "Datos básicos",
    shortLabel: "Básicos",
    description: "Tipo, operación y precio",
  },
  {
    id: "location",
    label: "Ubicación",
    shortLabel: "Ubicación",
    description: "Dirección y mapa",
  },
  {
    id: "features",
    label: "Características",
    shortLabel: "Detalles",
    description: "Distribución y medidas",
  },
  {
    id: "media",
    label: "Fotografías",
    shortLabel: "Fotos",
    description: "Galería y portada",
  },
];

export interface PropertyTypeOption {
  value: PropertyType;
  label: string;
  icon: LucideIcon;
  group: "residencial" | "terreno" | "comercial" | "otro";
}

export const PROPERTY_TYPE_OPTIONS: PropertyTypeOption[] = [
  { value: "Casa", label: "Casa", icon: Home, group: "residencial" },
  { value: "Departamento", label: "Depto", icon: Building2, group: "residencial" },
  { value: "Casa en condominio", label: "Casa condo", icon: Home, group: "residencial" },
  { value: "Condominio", label: "Condominio", icon: Layers, group: "residencial" },
  { value: "Penthouse", label: "Penthouse", icon: Building2, group: "residencial" },
  { value: "Rancho", label: "Rancho", icon: TreePine, group: "residencial" },
  { value: "Terreno", label: "Terreno", icon: LandPlot, group: "terreno" },
  { value: "Local Comercial", label: "Local", icon: Store, group: "comercial" },
  { value: "Oficina", label: "Oficina", icon: Building2, group: "comercial" },
  { value: "Consultorio", label: "Consultorio", icon: Building2, group: "comercial" },
  { value: "Bodega", label: "Bodega", icon: Factory, group: "comercial" },
  { value: "Nave industrial", label: "Nave", icon: Factory, group: "comercial" },
  { value: "Otro", label: "Otro", icon: Layers, group: "otro" },
];

const LAND_TYPES: PropertyType[] = ["Terreno"];
const COMMERCIAL_TYPES: PropertyType[] = [
  "Local Comercial",
  "Oficina",
  "Consultorio",
  "Bodega",
  "Nave industrial",
];

export function getPropertyTypeGroup(
  type: PropertyType,
): PropertyTypeOption["group"] {
  return (
    PROPERTY_TYPE_OPTIONS.find((option) => option.value === type)?.group ?? "otro"
  );
}

export function shouldShowResidentialFields(type: PropertyType): boolean {
  return !LAND_TYPES.includes(type) && !COMMERCIAL_TYPES.includes(type);
}

export function shouldShowLandFields(type: PropertyType): boolean {
  return LAND_TYPES.includes(type) || type === "Rancho";
}

export function shouldShowCommercialFields(type: PropertyType): boolean {
  return COMMERCIAL_TYPES.includes(type);
}

export function formatPricePreview(value: string): string {
  const parsed = Number(value);
  if (!value || Number.isNaN(parsed)) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(parsed);
}
