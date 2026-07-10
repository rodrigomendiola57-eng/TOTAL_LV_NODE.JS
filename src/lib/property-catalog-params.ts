import type {
  BedroomFilter,
  CatalogViewMode,
  PropertySortOption,
  PropertyTypeFilter,
  ZoneFilter,
} from "@/lib/property-catalog";
import type { PropertyType, QueretaroZone } from "@/types/property";
import { MEXICO_STATES } from "@/lib/data/mexico-locations";
import { PROPERTY_TYPES } from "@/lib/data/property-options";
import { QUERETARO_ZONES } from "@/lib/data/property-options";

export type StateFilter = (typeof MEXICO_STATES)[number] | "all";

export interface CatalogSearchParams {
  page?: string;
  sort?: string;
  bedrooms?: string;
  search?: string;
  zone?: string;
  estado?: string;
  tipo?: string;
  vista?: string;
  precio_min?: string;
  precio_max?: string;
}

export interface CatalogQueryState {
  page: number;
  sort: PropertySortOption;
  bedrooms: BedroomFilter;
  search: string;
  zone: ZoneFilter;
  state: StateFilter;
  propertyType: PropertyTypeFilter;
  vista: CatalogViewMode;
  priceMin: string;
  priceMax: string;
}

const SORT_OPTIONS: PropertySortOption[] = ["newest", "price-asc", "price-desc"];
const BEDROOM_OPTIONS: BedroomFilter[] = ["all", "1", "2", "3", "4"];
const VIEW_OPTIONS: CatalogViewMode[] = ["lista", "mapa"];

export const CATALOG_PAGE_SIZE = 12;

export const DEFAULT_CATALOG_STATE: CatalogQueryState = {
  page: 1,
  sort: "newest",
  bedrooms: "all",
  search: "",
  zone: "all",
  state: "all",
  propertyType: "all",
  vista: "lista",
  priceMin: "",
  priceMax: "",
};

export function getCatalogPathForOperation(operation: "Venta" | "Renta"): string {
  return operation === "Renta" ? "/propiedades/renta" : "/propiedades/venta";
}

export function parseCatalogSearchParams(
  params: CatalogSearchParams,
): CatalogQueryState {
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const sort = SORT_OPTIONS.includes(params.sort as PropertySortOption)
    ? (params.sort as PropertySortOption)
    : "newest";
  const bedrooms = BEDROOM_OPTIONS.includes(params.bedrooms as BedroomFilter)
    ? (params.bedrooms as BedroomFilter)
    : "all";
  const vista = VIEW_OPTIONS.includes(params.vista as CatalogViewMode)
    ? (params.vista as CatalogViewMode)
    : "lista";
  const zone = QUERETARO_ZONES.includes(params.zone as QueretaroZone)
    ? (params.zone as QueretaroZone)
    : "all";
  const state = MEXICO_STATES.includes(params.estado ?? "")
    ? (params.estado as StateFilter)
    : "all";
  const propertyType = PROPERTY_TYPES.includes(params.tipo as PropertyType)
    ? (params.tipo as PropertyType)
    : "all";

  return {
    page,
    sort,
    bedrooms,
    search: (params.search ?? "").trim(),
    zone,
    state,
    propertyType,
    vista,
    priceMin: (params.precio_min ?? "").trim(),
    priceMax: (params.precio_max ?? "").trim(),
  };
}

export function buildCatalogHref(
  basePath: string,
  state: CatalogQueryState,
): string {
  const searchParams = new URLSearchParams();

  if (state.page > 1) {
    searchParams.set("page", String(state.page));
  }
  if (state.sort !== "newest") {
    searchParams.set("sort", state.sort);
  }
  if (state.bedrooms !== "all") {
    searchParams.set("bedrooms", state.bedrooms);
  }
  if (state.search) {
    searchParams.set("search", state.search);
  }
  if (state.zone !== "all") {
    searchParams.set("zone", state.zone);
  }
  if (state.state !== "all") {
    searchParams.set("estado", state.state);
  }
  if (state.propertyType !== "all") {
    searchParams.set("tipo", state.propertyType);
  }
  if (state.vista !== "lista") {
    searchParams.set("vista", state.vista);
  }
  if (state.priceMin) {
    searchParams.set("precio_min", state.priceMin);
  }
  if (state.priceMax) {
    searchParams.set("precio_max", state.priceMax);
  }

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 1) {
    return [];
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  for (const offset of [-2, -1, 0, 1, 2]) {
    const candidate = currentPage + offset;
    if (candidate > 1 && candidate < totalPages) {
      pages.add(candidate);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index];
    const previous = sorted[index - 1];

    if (index > 0 && page - previous > 1) {
      result.push("ellipsis");
    }

    result.push(page);
  }

  return result;
}
