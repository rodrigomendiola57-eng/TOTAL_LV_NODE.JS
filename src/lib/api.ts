import type {
  Amenity,
  FeaturedPropertiesResponse,
  Property,
  PropertyCreatePayload,
  PropertyFeature,
  PropertyType,
} from "@/types/property";
import type { BedroomFilter, PropertySortOption } from "@/lib/property-catalog";
import { CATALOG_PAGE_SIZE } from "@/lib/property-catalog-params";
import type { CatalogQueryState } from "@/lib/property-catalog-params";
import { staticExportFetchInit } from "@/lib/static-export";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { resolveMediaUrl } from "@/lib/media-url";

function mapFeatureToProperty(feature: PropertyFeature): Property {
  const [longitude, latitude] = feature.geometry.coordinates;
  const props = feature.properties;

  return {
    id: feature.id,
    ...props,
    amenities: props.amenities ?? [],
    amenities_detail: props.amenities_detail ?? [],
    easybroker_id: props.easybroker_id ?? null,
    easybroker_synced_at: props.easybroker_synced_at ?? null,
    cover_image_url: resolveMediaUrl(props.cover_image_url) ?? null,
    technical_sheet_url: resolveMediaUrl(props.technical_sheet_url) ?? null,
    latitude,
    longitude,
  };
}

function buildGeoJsonBody(payload: PropertyCreatePayload) {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [payload.longitude, payload.latitude],
    },
    properties: {
      title: payload.title,
      property_type: payload.property_type,
      operation_type: payload.operation_type,
      price: payload.price,
      currency: payload.currency,
      description: payload.description,
      address: payload.address,
      state: payload.state,
      city: payload.city,
      postal_code: payload.postal_code,
      zone: payload.zone,
      maps_link: payload.maps_link,
      bedrooms: payload.bedrooms,
      full_bathrooms: payload.full_bathrooms,
      half_bathrooms: payload.half_bathrooms,
      parking_spaces: payload.parking_spaces,
      build_area_m2: payload.build_area_m2,
      land_area_m2: payload.land_area_m2,
      levels: payload.levels,
      front_measure_m: payload.front_measure_m,
      depth_measure_m: payload.depth_measure_m,
      build_year: payload.build_year,
      environments: payload.environments,
      maintenance_fee: payload.maintenance_fee,
      amenities: payload.amenities,
      is_featured: payload.is_featured,
    },
  };
}

async function fetchPropertiesResponse(
  endpoint: string,
  options?: { revalidate?: number },
): Promise<FeaturedPropertiesResponse> {
  const response = await fetch(
    endpoint,
    options?.revalidate != null
      ? {
          method: "GET",
          headers: { Accept: "application/json" },
          next: { revalidate: options.revalidate },
        }
      : staticExportFetchInit({
          method: "GET",
          headers: { Accept: "application/json" },
        }),
  );

  if (!response.ok) {
    if (process.env.GITHUB_PAGES === "true") {
      return {
        count: 0,
        next: null,
        previous: null,
        results: { type: "FeatureCollection", features: [] },
      };
    }
    throw new Error(`No se pudieron obtener propiedades (${response.status}).`);
  }

  return (await response.json()) as FeaturedPropertiesResponse;
}

function mapPaginatedResponse(
  data: FeaturedPropertiesResponse,
  page: number,
): PropertiesPageResult {
  const properties = (data.results?.features ?? []).map(mapFeatureToProperty);
  const count = data.count ?? properties.length;
  const totalPages = Math.max(1, Math.ceil(count / CATALOG_PAGE_SIZE));

  return {
    properties,
    count,
    page: Math.min(page, totalPages),
    pageSize: CATALOG_PAGE_SIZE,
    totalPages,
    hasNext: Boolean(data.next),
    hasPrevious: Boolean(data.previous),
  };
}

async function fetchProperties(
  endpoint: string,
  options?: { revalidate?: number },
): Promise<Property[]> {
  try {
    const data = await fetchPropertiesResponse(endpoint, options);
    return (data.results?.features ?? []).map(mapFeatureToProperty);
  } catch {
    if (process.env.GITHUB_PAGES === "true") return [];
    throw new Error("No se pudieron obtener propiedades.");
  }
}

async function mutateProperty(
  endpoint: string,
  method: "POST" | "PUT" | "PATCH",
  payload: PropertyCreatePayload,
): Promise<void> {
  const response = await fetch(endpoint, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildGeoJsonBody(payload)),
  });

  if (!response.ok) {
    const detail = await response.text();
    const jsonDetail = (() => {
      try {
        const parsed = JSON.parse(detail) as { detail?: string };
        return typeof parsed.detail === "string" ? parsed.detail : null;
      } catch {
        return null;
      }
    })();
    throw new Error(
      jsonDetail ??
        `No se pudo guardar la propiedad (${response.status}). ${detail.slice(0, 280)}`,
    );
  }
}

export async function getFeaturedProperties(options?: {
  revalidate?: number;
  /** Filtra el carrusel por operación (Venta / Renta). Sin esto mezcla todas. */
  operation_type?: Property["operation_type"];
}): Promise<Property[]> {
  const { revalidate, operation_type } = options ?? {};
  const query = buildPropertiesQuery({
    is_featured: true,
    ...(operation_type ? { operation_type } : {}),
  });
  return fetchProperties(
    `${getApiBaseUrl()}/properties/?${query}`,
    revalidate != null ? { revalidate } : undefined,
  );
}

export interface GetPropertiesParams {
  /** Alias de `operation_type` para el catálogo público (Venta, Renta, etc.). */
  category?: Property["operation_type"];
  property_type?: PropertyType;
  zone?: Property["zone"];
  state?: Property["state"];
  is_featured?: boolean;
}

export interface GetPropertiesPageParams extends GetPropertiesParams {
  page?: number;
  ordering?: PropertySortOption;
  bedrooms?: BedroomFilter;
  search?: string;
  priceMin?: string;
  priceMax?: string;
}

export function catalogStateToApiParams(
  catalogState: CatalogQueryState,
  category: Property["operation_type"],
): GetPropertiesPageParams {
  return {
    category,
    page: catalogState.page,
    ordering: catalogState.sort,
    bedrooms: catalogState.bedrooms,
    search: catalogState.search || undefined,
    zone: catalogState.zone !== "all" ? catalogState.zone : undefined,
    state: catalogState.state !== "all" ? catalogState.state : undefined,
    property_type:
      catalogState.propertyType !== "all" ? catalogState.propertyType : undefined,
    priceMin: catalogState.priceMin || undefined,
    priceMax: catalogState.priceMax || undefined,
  };
}

export interface PropertiesPageResult {
  properties: Property[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface PropertyFilters {
  operation_type?: Property["operation_type"];
  property_type?: PropertyType;
  zone?: Property["zone"];
  state?: Property["state"];
  is_featured?: boolean;
}

function buildPropertiesQuery(
  params: PropertyFilters | GetPropertiesParams | GetPropertiesPageParams,
  options: {
    page?: number;
    pageSize?: number;
    includeCatalogFilters?: boolean;
    alwaysIncludePage?: boolean;
  } = {},
): string {
  const searchParams = new URLSearchParams();

  if ("category" in params && params.category) {
    searchParams.set("operation_type", params.category);
  } else if ("operation_type" in params && params.operation_type) {
    searchParams.set("operation_type", params.operation_type);
  }

  if (params.property_type) searchParams.set("property_type", params.property_type);
  if (params.zone) searchParams.set("zone", params.zone);
  if (params.state) searchParams.set("state", params.state);
  if (params.is_featured !== undefined) {
    searchParams.set("is_featured", String(params.is_featured));
  }

  if (options.pageSize) {
    searchParams.set("page_size", String(options.pageSize));
  }

  if (options.includeCatalogFilters) {
    const pageParams = params as GetPropertiesPageParams;
    const page = options.page ?? pageParams.page ?? 1;
    if (page > 1 || options.alwaysIncludePage) {
      searchParams.set("page", String(page));
    }
    if (pageParams.ordering) {
      searchParams.set("ordering", pageParams.ordering);
    }
    if (pageParams.bedrooms && pageParams.bedrooms !== "all") {
      searchParams.set("bedrooms_min", pageParams.bedrooms);
    }
    if (pageParams.search?.trim()) {
      searchParams.set("search", pageParams.search.trim());
    }
    if (pageParams.priceMin?.trim()) {
      searchParams.set("price_min", pageParams.priceMin.trim());
    }
    if (pageParams.priceMax?.trim()) {
      searchParams.set("price_max", pageParams.priceMax.trim());
    }
  } else if (options.page != null) {
    searchParams.set("page", String(options.page));
  }

  return searchParams.toString();
}

export async function getPropertiesPage(
  params: GetPropertiesPageParams = {},
): Promise<PropertiesPageResult> {
  const page = Math.max(1, params.page ?? 1);

  try {
    const query = buildPropertiesQuery(params, { page, includeCatalogFilters: true });
    const endpoint = query
      ? `${getApiBaseUrl()}/properties/?${query}`
      : `${getApiBaseUrl()}/properties/?page=${page}`;

    const data = await fetchPropertiesResponse(endpoint);
    return mapPaginatedResponse(data, page);
  } catch {
    if (process.env.GITHUB_PAGES === "true") {
      return {
        properties: [],
        count: 0,
        page: 1,
        pageSize: CATALOG_PAGE_SIZE,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      };
    }
    throw new Error("No se pudieron obtener propiedades.");
  }
}

export async function getProperties(
  params: GetPropertiesParams = {},
): Promise<Property[]> {
  const result = await getPropertiesPage({ ...params, page: 1 });
  return result.properties;
}

const MAX_CATALOG_PAGES = 200;
/** Tamaño de página alto para reducir round-trips al cargar catálogos completos. */
const BULK_PAGE_SIZE = 100;

/** Clave estable para cachear propiedades del mapa según filtros. */
export function getCatalogMapCacheKey(
  params: Omit<GetPropertiesPageParams, "page">,
): string {
  return JSON.stringify(params);
}

const catalogMapCache = new Map<string, Promise<Property[]>>();

async function fetchCatalogPageClient(
  params: Omit<GetPropertiesPageParams, "page">,
  page: number,
): Promise<PropertiesPageResult> {
  const query = buildPropertiesQuery(params, { page, includeCatalogFilters: true });
  const endpoint = query
    ? `${getApiBaseUrl()}/properties/?${query}`
    : `${getApiBaseUrl()}/properties/?page=${page}`;

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`No se pudieron obtener propiedades (${response.status}).`);
  }

  const data = (await response.json()) as FeaturedPropertiesResponse;
  return mapPaginatedResponse(data, page);
}

async function fetchAllCatalogMapPagesClient(
  params: Omit<GetPropertiesPageParams, "page">,
): Promise<Property[]> {
  const first = await fetchCatalogPageClient(params, 1);
  const collected = [...first.properties];

  if (first.totalPages <= 1) {
    return collected;
  }

  const remainingPages = Array.from(
    { length: Math.min(first.totalPages - 1, MAX_CATALOG_PAGES - 1) },
    (_, index) => fetchCatalogPageClient(params, index + 2),
  );

  const pages = await Promise.all(remainingPages);
  for (const page of pages) {
    collected.push(...page.properties);
  }

  return collected;
}

/**
 * Obtiene todas las propiedades del catálogo para el mapa (cliente).
 * Usa paginación paralela y cache en memoria por combinación de filtros.
 */
export function fetchCatalogMapPropertiesClient(
  params: Omit<GetPropertiesPageParams, "page">,
): Promise<Property[]> {
  const key = getCatalogMapCacheKey(params);
  const cached = catalogMapCache.get(key);
  if (cached) return cached;

  const promise = fetchAllCatalogMapPagesClient(params).catch((error) => {
    catalogMapCache.delete(key);
    throw error;
  });

  catalogMapCache.set(key, promise);
  return promise;
}

/** Precarga el bundle del mapa Leaflet en idle time. */
export function prefetchCatalogMapBundle(): void {
  if (typeof window === "undefined") return;
  const preload = () => {
    void import("@/components/properties/PropertyCatalogMap");
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preload, { timeout: 2500 });
  } else {
    setTimeout(preload, 400);
  }
}

export async function getCatalogPropertiesAll(
  params: Omit<GetPropertiesPageParams, "page"> = {},
): Promise<Property[]> {
  const collected: Property[] = [];
  let page = 1;

  while (page <= MAX_CATALOG_PAGES) {
    const query = buildPropertiesQuery(params, {
      page,
      pageSize: BULK_PAGE_SIZE,
      includeCatalogFilters: true,
      alwaysIncludePage: true,
    });
    const endpoint = `${getApiBaseUrl()}/properties/?${query}`;

    const data = await fetchPropertiesResponse(endpoint).catch(() => null);
    if (!data) {
      if (process.env.GITHUB_PAGES === "true") return collected;
      throw new Error("No se pudieron obtener propiedades.");
    }

    collected.push(...(data.results?.features ?? []).map(mapFeatureToProperty));

    if (!data.next) {
      break;
    }

    page += 1;
  }

  return collected;
}

const MAX_PROPERTY_PAGES = 200;

export async function getAllProperties(
  filters: PropertyFilters = {},
): Promise<Property[]> {
  const collected: Property[] = [];
  let page = 1;

  while (page <= MAX_PROPERTY_PAGES) {
    const query = buildPropertiesQuery(filters, {
      page,
      pageSize: BULK_PAGE_SIZE,
    });
    const endpoint = `${getApiBaseUrl()}/properties/?${query}`;

    const data = await fetchPropertiesResponse(endpoint).catch(() => null);
    if (!data) {
      if (process.env.GITHUB_PAGES === "true") return collected;
      throw new Error("No se pudieron obtener propiedades.");
    }

    collected.push(...(data.results?.features ?? []).map(mapFeatureToProperty));

    if (!data.next) {
      break;
    }

    page += 1;
  }

  return collected;
}

interface DashboardPropertyRow {
  id: number;
  title: string;
  property_type: Property["property_type"];
  operation_type: Property["operation_type"];
  price: string;
  currency: string;
  description: string;
  address: string;
  state: string;
  city: string;
  postal_code: string;
  zone: Property["zone"];
  maps_link: string;
  bedrooms: number;
  full_bathrooms: number;
  half_bathrooms: number;
  parking_spaces: number;
  build_area_m2: string;
  land_area_m2: string;
  levels: number;
  front_measure_m: string | null;
  depth_measure_m: string | null;
  build_year: number | null;
  environments: number;
  maintenance_fee: string | null;
  is_featured: boolean;
  easybroker_id?: string | null;
  easybroker_synced_at?: string | null;
  cover_image_url?: string | null;
  created_at: string;
  updated_at: string;
}

interface DashboardPropertiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DashboardPropertyRow[];
}

function mapDashboardRowToProperty(row: DashboardPropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    property_type: row.property_type,
    operation_type: row.operation_type,
    price: row.price,
    currency: row.currency || "MXN",
    description: row.description ?? "",
    address: row.address ?? "",
    state: row.state ?? "",
    city: row.city ?? "",
    postal_code: row.postal_code ?? "",
    zone: row.zone,
    maps_link: row.maps_link ?? "",
    bedrooms: row.bedrooms ?? 0,
    full_bathrooms: row.full_bathrooms ?? 0,
    half_bathrooms: row.half_bathrooms ?? 0,
    parking_spaces: row.parking_spaces ?? 0,
    build_area_m2: row.build_area_m2 ?? "0",
    land_area_m2: row.land_area_m2 ?? "0",
    levels: row.levels ?? 0,
    front_measure_m: row.front_measure_m,
    depth_measure_m: row.depth_measure_m,
    build_year: row.build_year,
    environments: row.environments ?? 0,
    maintenance_fee: row.maintenance_fee,
    amenities: [],
    amenities_detail: [],
    is_featured: Boolean(row.is_featured),
    easybroker_id: row.easybroker_id ?? null,
    easybroker_synced_at: row.easybroker_synced_at ?? null,
    cover_image_url: resolveMediaUrl(row.cover_image_url) ?? null,
    technical_sheet_url: null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Listado optimizado del panel: JSON plano, sin GeoJSON/GDAL, page_size alto.
 */
export async function getDashboardProperties(): Promise<Property[]> {
  const collected: Property[] = [];
  let page = 1;

  while (page <= MAX_PROPERTY_PAGES) {
    const query = new URLSearchParams({
      view: "dashboard",
      page: String(page),
      page_size: String(BULK_PAGE_SIZE),
      ordering: "newest",
    });
    const response = await fetch(
      `${getApiBaseUrl()}/properties/?${query}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        next: { revalidate: 20, tags: ["dashboard-properties"] },
      },
    );

    if (!response.ok) {
      if (process.env.GITHUB_PAGES === "true") return collected;
      throw new Error(`No se pudieron obtener propiedades (${response.status}).`);
    }

    const data = (await response.json()) as DashboardPropertiesResponse;
    const rows = Array.isArray(data.results) ? data.results : [];
    collected.push(...rows.map(mapDashboardRowToProperty));

    if (!data.next) break;
    page += 1;
  }

  return collected;
}

export async function getPropertyStats(): Promise<{
  total: number;
  featured: number;
}> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/properties/stats/`, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 20, tags: ["dashboard-properties"] },
    });
    if (!response.ok) return { total: 0, featured: 0 };
    const data = (await response.json()) as { total?: number; featured?: number };
    return {
      total: Number(data.total) || 0,
      featured: Number(data.featured) || 0,
    };
  } catch {
    return { total: 0, featured: 0 };
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/properties/${id}/`,
      staticExportFetchInit({
        method: "GET",
        headers: { Accept: "application/json" },
      }),
    );

    if (response.status === 404) return null;

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as PropertyFeature;
    return mapFeatureToProperty(data);
  } catch {
    return null;
  }
}

interface SimilarPropertiesResponse {
  type: "FeatureCollection";
  features: PropertyFeature[];
}

export async function getSimilarProperties(id: string | number): Promise<Property[]> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/properties/${id}/similar/`,
      staticExportFetchInit({
        method: "GET",
        headers: { Accept: "application/json" },
      }),
    );

    if (!response.ok) {
      if (process.env.GITHUB_PAGES === "true") return [];
      return [];
    }

    const data = (await response.json()) as SimilarPropertiesResponse;
    const rawFeatures = data.features;
    const features = Array.isArray(rawFeatures)
      ? rawFeatures
      : (rawFeatures as SimilarPropertiesResponse | undefined)?.features ?? [];

    return features.map(mapFeatureToProperty);
  } catch {
    if (process.env.GITHUB_PAGES === "true") return [];
    return [];
  }
}

export async function createProperty(payload: PropertyCreatePayload): Promise<number> {
  const response = await fetch(`${getApiBaseUrl()}/properties/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildGeoJsonBody(payload)),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `No se pudo guardar la propiedad (${response.status}). ${detail}`,
    );
  }

  const data = (await response.json()) as PropertyFeature;
  return data.id;
}

export async function updateProperty(
  id: number,
  payload: PropertyCreatePayload,
): Promise<void> {
  await mutateProperty(`${getApiBaseUrl()}/properties/${id}/`, "PUT", payload);
}

export async function getAmenities(): Promise<Amenity[]> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/amenities/`,
      staticExportFetchInit({
        method: "GET",
        headers: { Accept: "application/json" },
      }),
    );

    if (!response.ok) {
      if (process.env.GITHUB_PAGES === "true") return [];
      throw new Error(`No se pudieron obtener las amenidades (${response.status}).`);
    }

    const data = (await response.json()) as Amenity[] | { results?: Amenity[] };
    return Array.isArray(data) ? data : data.results ?? [];
  } catch {
    if (process.env.GITHUB_PAGES === "true") return [];
    throw new Error("No se pudieron obtener las amenidades.");
  }
}

export async function deleteProperty(id: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/properties/${id}/`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `No se pudo eliminar la propiedad (${response.status}). ${detail}`,
    );
  }
}
