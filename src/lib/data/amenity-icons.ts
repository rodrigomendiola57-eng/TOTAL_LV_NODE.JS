import * as LucideIcons from "lucide-react";
import { Sparkles, type LucideIcon } from "lucide-react";
import type { AmenityCategory } from "@/types/property";

const iconRegistry = LucideIcons as unknown as Record<string, LucideIcon>;

export function getAmenityIcon(name?: string): LucideIcon {
  if (name && typeof iconRegistry[name] === "function") {
    return iconRegistry[name];
  }
  return Sparkles;
}

export const AMENITY_CATEGORY_ORDER: AmenityCategory[] = [
  "Seguridad",
  "Amenidades del desarrollo",
  "Interiores",
  "Exteriores y áreas verdes",
  "Servicios",
  "Ubicación y vistas",
];
