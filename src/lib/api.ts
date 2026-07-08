import type {
  FeaturedPropertiesResponse,
  Property,
  PropertyCreatePayload,
  PropertyFeature,
  PropertyType,
} from "@/types/property";
import { staticExportFetchInit } from "@/lib/static-export";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

function mapFeatureToProperty(feature: PropertyFeature): Property {
  const [longitude, latitude] = feature.geometry.coordinates;

  return {
    id: feature.id,
    ...feature.properties,
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
      is_featured: payload.is_featured,
    },
  };
}

async function fetchProperties(endpoint: string): Promise<Property[]> {
  try {
    const response = await fetch(
      endpoint,
      staticExportFetchInit({
        method: "GET",
        headers: { Accept: "application/json" },
      }),
    );

    if (!response.ok) {
      if (process.env.GITHUB_PAGES === "true") return [];
      throw new Error(`No se pudieron obtener propiedades (${response.status}).`);
    }

    const data = (await response.json()) as FeaturedPropertiesResponse;
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
    throw new Error(
      `No se pudo guardar la propiedad (${response.status}). ${detail}`,
    );
  }
}

export async function getFeaturedProperties(): Promise<Property[]> {
  return fetchProperties(`${API_URL}/properties/?is_featured=true`);
}

interface PropertyFilters {
  operation_type?: Property["operation_type"];
  property_type?: PropertyType;
  zone?: Property["zone"];
  is_featured?: boolean;
}

export interface GetPropertiesParams {
  /** Alias de `operation_type` para el catálogo público (Venta, Renta, etc.). */
  category?: Property["operation_type"];
  property_type?: PropertyType;
  zone?: Property["zone"];
  is_featured?: boolean;
}

function buildPropertiesQuery(params: PropertyFilters | GetPropertiesParams): string {
  const searchParams = new URLSearchParams();

  if ("category" in params && params.category) {
    searchParams.set("operation_type", params.category);
  } else if ("operation_type" in params && params.operation_type) {
    searchParams.set("operation_type", params.operation_type);
  }

  if (params.property_type) searchParams.set("property_type", params.property_type);
  if (params.zone) searchParams.set("zone", params.zone);
  if (params.is_featured !== undefined) {
    searchParams.set("is_featured", String(params.is_featured));
  }

  return searchParams.toString();
}

export async function getProperties(
  params: GetPropertiesParams = {},
): Promise<Property[]> {
  const query = buildPropertiesQuery(params);
  const endpoint = query
    ? `${API_URL}/properties/?${query}`
    : `${API_URL}/properties/`;

  return fetchProperties(endpoint);
}

export async function getAllProperties(
  filters: PropertyFilters = {},
): Promise<Property[]> {
  const query = buildPropertiesQuery(filters);
  const endpoint = query
    ? `${API_URL}/properties/?${query}`
    : `${API_URL}/properties/`;

  return fetchProperties(endpoint);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const response = await fetch(
      `${API_URL}/properties/${id}/`,
      staticExportFetchInit({
        method: "GET",
        headers: { Accept: "application/json" },
      }),
    );

    if (response.status === 404) return null;

    if (!response.ok) {
      if (process.env.GITHUB_PAGES === "true") return null;
      throw new Error(`No se pudo obtener la propiedad ${id} (${response.status}).`);
    }

    const data = (await response.json()) as PropertyFeature;
    return mapFeatureToProperty(data);
  } catch {
    if (process.env.GITHUB_PAGES === "true") return null;
    throw new Error(`No se pudo obtener la propiedad ${id}.`);
  }
}

export async function createProperty(payload: PropertyCreatePayload): Promise<number> {
  const response = await fetch(`${API_URL}/properties/`, {
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
  await mutateProperty(`${API_URL}/properties/${id}/`, "PUT", payload);
}

export async function deleteProperty(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/properties/${id}/`, {
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
