import { getPropertyWhatsAppShareUrl } from "@/lib/property-share";
import type { Property } from "@/types/property";
import { formatPropertyBathrooms, formatPropertyLocation } from "@/types/property";
import type { LucideIcon } from "lucide-react";
import {
  Bath,
  BedDouble,
  Building2,
  Calendar,
  Car,
  Hash,
  Layers,
  Maximize2,
  Ruler,
  Trees,
  Wallet,
} from "lucide-react";

export interface PropertySpecItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function getCatalogBackHref(property: Property): string {
  switch (property.operation_type) {
    case "Renta":
      return "/propiedades/renta";
    case "Venta o Renta":
      return "/propiedades/venta";
    default:
      return "/propiedades/venta";
  }
}

export function getPropertyMapsUrl(property: Property): string {
  if (property.maps_link?.trim()) {
    return property.maps_link;
  }

  if (property.latitude != null && property.longitude != null) {
    return `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
  }

  const query = encodeURIComponent(
    `${property.address}, ${property.city}, ${property.state}`,
  );
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getPropertyWhatsAppUrl(property: Property): string {
  return getPropertyWhatsAppShareUrl(property);
}

function formatArea(value: string): string | null {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return `${parsed.toLocaleString("es-MX")} m²`;
}

export function buildPropertyHighlights(property: Property): PropertySpecItem[] {
  const items: PropertySpecItem[] = [];

  if (property.bedrooms > 0) {
    items.push({
      label: "Recámaras",
      value: String(property.bedrooms),
      icon: BedDouble,
    });
  }

  if (property.full_bathrooms > 0 || property.half_bathrooms > 0) {
    items.push({
      label: "Baños",
      value: formatPropertyBathrooms(property),
      icon: Bath,
    });
  }

  const buildArea = formatArea(property.build_area_m2);
  if (buildArea) {
    items.push({ label: "Construcción", value: buildArea, icon: Maximize2 });
  }

  if (property.parking_spaces > 0) {
    items.push({
      label: "Estacionamientos",
      value: String(property.parking_spaces),
      icon: Car,
    });
  }

  return items;
}

export function buildPropertySpecs(property: Property): PropertySpecItem[] {
  const specs: PropertySpecItem[] = [];
  const landArea = formatArea(property.land_area_m2);

  if (landArea) {
    specs.push({ label: "Terreno", value: landArea, icon: Trees });
  }

  if (property.levels > 0) {
    specs.push({
      label: "Niveles",
      value: String(property.levels),
      icon: Layers,
    });
  }

  if (property.build_year) {
    specs.push({
      label: "Año",
      value: String(property.build_year),
      icon: Calendar,
    });
  }

  if (property.environments > 0) {
    specs.push({
      label: "Ambientes",
      value: String(property.environments),
      icon: Building2,
    });
  }

  if (property.front_measure_m && Number(property.front_measure_m) > 0) {
    specs.push({
      label: "Frente",
      value: `${property.front_measure_m} m`,
      icon: Ruler,
    });
  }

  if (property.depth_measure_m && Number(property.depth_measure_m) > 0) {
    specs.push({
      label: "Fondo",
      value: `${property.depth_measure_m} m`,
      icon: Ruler,
    });
  }

  if (property.maintenance_fee && Number(property.maintenance_fee) > 0) {
    specs.push({
      label: "Mantenimiento",
      value: new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: property.currency,
        maximumFractionDigits: 0,
      }).format(Number(property.maintenance_fee)),
      icon: Wallet,
    });
  }

  if (property.postal_code?.trim()) {
    specs.push({
      label: "Código postal",
      value: property.postal_code.trim(),
      icon: Hash,
    });
  }

  return specs;
}

export function formatPropertyDescription(description: string): string {
  return description.replace(/\r\n/g, "\n").trim();
}
