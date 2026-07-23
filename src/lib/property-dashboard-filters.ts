import type { OperationType, Property, PropertyType } from "@/types/property";

export type PropertySourceFilter = "all" | "easybroker" | "manual";

export interface PropertyDashboardFilters {
  search: string;
  operationType: OperationType | "all";
  propertyType: PropertyType | "all";
  zone: string;
  source: PropertySourceFilter;
}

export const DEFAULT_PROPERTY_DASHBOARD_FILTERS: PropertyDashboardFilters = {
  search: "",
  operationType: "all",
  propertyType: "all",
  zone: "all",
  source: "all",
};

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

export function filterDashboardProperties(
  properties: Property[],
  filters: PropertyDashboardFilters,
): Property[] {
  const search = normalizeSearch(filters.search);

  return properties.filter((property) => {
    if (filters.operationType !== "all" && property.operation_type !== filters.operationType) {
      return false;
    }

    if (filters.propertyType !== "all" && property.property_type !== filters.propertyType) {
      return false;
    }

    if (filters.zone !== "all" && property.zone !== filters.zone) {
      return false;
    }

    if (filters.source === "easybroker" && !property.easybroker_synced_at) {
      return false;
    }

    if (filters.source === "manual" && Boolean(property.easybroker_synced_at)) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = [
      property.title,
      property.easybroker_id,
      property.address,
      property.city,
      property.zone,
      String(property.id),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });
}

export function getDashboardZoneOptions(properties: Property[]): string[] {
  const zones = new Set(properties.map((property) => property.zone));
  return Array.from(zones).sort((a, b) => a.localeCompare(b, "es"));
}

export function hasActiveDashboardFilters(
  filters: PropertyDashboardFilters,
): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.operationType !== "all" ||
    filters.propertyType !== "all" ||
    filters.zone !== "all" ||
    filters.source !== "all"
  );
}
