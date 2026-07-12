import { getApiBaseUrl } from "@/lib/api-base-url";
import { resolveMediaUrl } from "@/lib/media-url";
import type {
  Development,
  DevelopmentFloorPlan,
  DevelopmentModel,
  DevelopmentStatus,
} from "@/types/development";
import type {
  DevelopmentsPageContent,
  DevelopmentsPageUpdatePayload,
} from "@/types/developments-page";

/** Shape crudo de la API Django (snake_case). */
export interface DevelopmentApiModel {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  developer: string;
  zone: string;
  city: string;
  state: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  status: DevelopmentStatus;
  price_from: string | number;
  currency: string;
  delivery: string;
  unit_types: string[];
  bedrooms_min: number;
  bedrooms_max: number;
  area_min: number;
  area_max: number;
  amenities: string[];
  cover_image_url: string;
  cover_image_external_url?: string;
  gallery: string[];
  total_units: number;
  featured: boolean;
  is_published: boolean;
  order: number;
  description: string;
  models_count?: number;
  models?: DevelopmentApiUnitModel[];
  updated_at?: string;
}

export interface DevelopmentApiUnitModel {
  id: number;
  slug: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  half_bathrooms: number;
  area_m2: number;
  lot_m2: number | null;
  parking: number;
  price_from: string | number;
  list_price: string | number | null;
  image_url: string;
  cover_image_external_url?: string;
  description: string;
  features: string[];
  available: number | null;
  order: number;
  gallery: string[];
  floor_plans: Array<{
    id: number;
    label: string;
    image_url: string;
    order: number;
  }>;
  tour_provider?: string;
  tour_id?: string;
  tour_url?: string;
  tour_title?: string;
  tour_enabled?: boolean;
}

export type DevelopmentWritePayload = {
  slug?: string;
  name: string;
  tagline?: string;
  developer?: string;
  description?: string;
  zone?: string;
  city?: string;
  state?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  status?: DevelopmentStatus;
  price_from?: number | string;
  currency?: string;
  delivery?: string;
  unit_types?: string[];
  bedrooms_min?: number;
  bedrooms_max?: number;
  area_min?: number;
  area_max?: number;
  amenities?: string[];
  cover_image_external_url?: string;
  total_units?: number;
  featured?: boolean;
  is_published?: boolean;
  order?: number;
};

async function developmentsFetch<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const hasBody = init?.body != null && init.body !== "";
  const isFormData =
    typeof FormData !== "undefined" && init?.body instanceof FormData;

  const base = getApiBaseUrl();
  // Next App Router redirige 308 si la ruta del proxy lleva slash final;
  // el proxy vuelve a añadir el slash que Django exige.
  const path = base.includes("/api/django")
    ? endpoint.replace(/\/+$/, "") || "/"
    : endpoint.endsWith("/")
      ? endpoint
      : `${endpoint}/`;

  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    let message = detail || `Developments request failed (${response.status})`;
    try {
      const parsed = JSON.parse(detail) as { detail?: unknown };
      if (typeof parsed.detail === "string") message = parsed.detail;
    } catch {
      /* texto plano */
    }
    throw new Error(message);
  }

  if (
    response.status === 204 ||
    response.status === 205 ||
    method === "DELETE"
  ) {
    const text = await response.text();
    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return undefined as T;
    }
  }

  return response.json() as Promise<T>;
}

function toNumber(value: string | number | null | undefined): number {
  if (value == null || value === "") return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function mapFloorPlan(
  plan: DevelopmentApiUnitModel["floor_plans"][number],
): DevelopmentFloorPlan {
  return {
    id: plan.id,
    label: plan.label,
    image: resolveMediaUrl(plan.image_url) ?? plan.image_url,
  };
}

function mapUnitModel(model: DevelopmentApiUnitModel): DevelopmentModel {
  return {
    id: model.id,
    slug: model.slug,
    name: model.name,
    bedrooms: model.bedrooms,
    bathrooms: model.bathrooms,
    halfBathrooms: model.half_bathrooms || undefined,
    areaM2: model.area_m2,
    lotM2: model.lot_m2 ?? undefined,
    parking: model.parking,
    priceFrom: toNumber(model.price_from),
    listPrice: model.list_price != null ? toNumber(model.list_price) : undefined,
    image: resolveMediaUrl(model.image_url) ?? model.image_url,
    description: model.description,
    gallery: (model.gallery ?? [])
      .map((url) => resolveMediaUrl(url) ?? url)
      .filter(Boolean),
    features: model.features ?? [],
    floorPlans: (model.floor_plans ?? []).map(mapFloorPlan),
    available: model.available ?? undefined,
    tour:
      model.tour_enabled && model.tour_id
        ? {
            provider: model.tour_provider || "matterport",
            id: model.tour_id,
            url: model.tour_url || undefined,
            title: model.tour_title || undefined,
            enabled: true,
          }
        : model.tour_id
          ? {
              provider: model.tour_provider || "matterport",
              id: model.tour_id,
              url: model.tour_url || undefined,
              title: model.tour_title || undefined,
              enabled: Boolean(model.tour_enabled),
            }
          : null,
  };
}

/** API → tipo público `Development`. */
export function mapDevelopmentFromApi(data: DevelopmentApiModel): Development {
  const cover =
    resolveMediaUrl(data.cover_image_url) ??
    data.cover_image_url ??
    data.cover_image_external_url ??
    "";

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    tagline: data.tagline ?? "",
    developer: data.developer ?? "",
    zone: data.zone ?? "",
    city: data.city ?? "",
    state: data.state ?? "",
    address: data.address ?? "",
    latitude: data.latitude ?? 0,
    longitude: data.longitude ?? 0,
    status: data.status,
    priceFrom: toNumber(data.price_from),
    currency: data.currency || "MXN",
    delivery: data.delivery ?? "",
    unitTypes: data.unit_types ?? [],
    bedroomsRange: [data.bedrooms_min ?? 1, data.bedrooms_max ?? 1],
    areaRange: [data.area_min ?? 0, data.area_max ?? 0],
    amenities: data.amenities ?? [],
    coverImage: cover,
    gallery: (data.gallery ?? [])
      .map((url) => resolveMediaUrl(url) ?? url)
      .filter(Boolean),
    models: (data.models ?? []).map(mapUnitModel),
    totalUnits: data.total_units ?? 0,
    featured: Boolean(data.featured),
    description: data.description ?? "",
  };
}

export async function getDevelopmentsPageContent(): Promise<DevelopmentsPageContent> {
  const data = await developmentsFetch<DevelopmentsPageContent>(
    "/developments-page/current/",
  );
  return {
    ...data,
    hero_image_url:
      resolveMediaUrl(data.hero_image_url) ?? data.hero_image_url,
  };
}

export async function updateDevelopmentsPageContent(
  payload: DevelopmentsPageUpdatePayload,
): Promise<DevelopmentsPageContent> {
  const data = await developmentsFetch<DevelopmentsPageContent>(
    "/developments-page/current/",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return {
    ...data,
    hero_image_url:
      resolveMediaUrl(data.hero_image_url) ?? data.hero_image_url,
  };
}

export async function uploadDevelopmentsPageHero(
  file: File,
): Promise<DevelopmentsPageContent> {
  const body = new FormData();
  body.append("file", file);
  const data = await developmentsFetch<DevelopmentsPageContent>(
    "/developments-page/current/hero-image/",
    { method: "POST", body },
  );
  return {
    ...data,
    hero_image_url:
      resolveMediaUrl(data.hero_image_url) ?? data.hero_image_url,
  };
}

export async function listDevelopmentsApi(options?: {
  publishedOnly?: boolean;
}): Promise<DevelopmentApiModel[]> {
  const query = options?.publishedOnly ? "?public=1" : "";
  return developmentsFetch<DevelopmentApiModel[]>(`/developments/${query}`);
}

export async function getDevelopmentBySlugApi(
  slug: string,
): Promise<DevelopmentApiModel> {
  return developmentsFetch<DevelopmentApiModel>(`/developments/${slug}/`);
}

export async function createDevelopmentApi(
  payload: DevelopmentWritePayload,
): Promise<DevelopmentApiModel> {
  return developmentsFetch<DevelopmentApiModel>("/developments/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateDevelopmentApi(
  slug: string,
  payload: Partial<DevelopmentWritePayload>,
): Promise<DevelopmentApiModel> {
  return developmentsFetch<DevelopmentApiModel>(`/developments/${slug}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteDevelopmentApi(slug: string): Promise<void> {
  await developmentsFetch<void>(`/developments/${slug}/`, {
    method: "DELETE",
  });
}

export async function uploadDevelopmentCover(
  slug: string,
  file: File,
): Promise<DevelopmentApiModel> {
  const body = new FormData();
  body.append("file", file);
  return developmentsFetch<DevelopmentApiModel>(
    `/developments/${slug}/cover-image/`,
    { method: "POST", body },
  );
}

export interface DevelopmentMediaItem {
  id: number;
  image_url: string;
  external_url?: string;
  alt_text?: string;
  order?: number;
  label?: string;
}

export type DevelopmentUnitModelWritePayload = {
  development?: number;
  slug?: string;
  name: string;
  bedrooms?: number;
  bathrooms?: number;
  half_bathrooms?: number;
  area_m2?: number;
  lot_m2?: number | null;
  parking?: number;
  price_from?: number | string;
  list_price?: number | string | null;
  cover_image_external_url?: string;
  description?: string;
  features?: string[];
  available?: number | null;
  order?: number;
  tour_provider?: string;
  tour_id?: string;
  tour_url?: string;
  tour_title?: string;
  tour_enabled?: boolean;
};

export async function listDevelopmentGallery(
  slug: string,
): Promise<DevelopmentMediaItem[]> {
  const rows = await developmentsFetch<DevelopmentMediaItem[]>(
    `/developments/${slug}/gallery/`,
  );
  return rows.map((row) => ({
    ...row,
    image_url: resolveMediaUrl(row.image_url) ?? row.image_url,
  }));
}

export async function addDevelopmentGalleryImage(
  slug: string,
  file: File,
): Promise<DevelopmentMediaItem> {
  const body = new FormData();
  body.append("file", file);
  const row = await developmentsFetch<DevelopmentMediaItem>(
    `/developments/${slug}/gallery/`,
    { method: "POST", body },
  );
  return {
    ...row,
    image_url: resolveMediaUrl(row.image_url) ?? row.image_url,
  };
}

export async function deleteDevelopmentGalleryImage(
  slug: string,
  imageId: number,
): Promise<void> {
  await developmentsFetch<void>(`/developments/${slug}/gallery/${imageId}/`, {
    method: "DELETE",
  });
}

export async function listDevelopmentModels(
  slug: string,
): Promise<DevelopmentApiUnitModel[]> {
  return developmentsFetch<DevelopmentApiUnitModel[]>(
    `/developments/${slug}/models/`,
  );
}

export async function createDevelopmentModel(
  slug: string,
  payload: DevelopmentUnitModelWritePayload,
): Promise<DevelopmentApiUnitModel> {
  return developmentsFetch<DevelopmentApiUnitModel>(
    `/developments/${slug}/models/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function updateDevelopmentModel(
  modelId: number,
  payload: Partial<DevelopmentUnitModelWritePayload>,
): Promise<DevelopmentApiUnitModel> {
  return developmentsFetch<DevelopmentApiUnitModel>(
    `/development-models/${modelId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteDevelopmentModel(modelId: number): Promise<void> {
  await developmentsFetch<void>(`/development-models/${modelId}/`, {
    method: "DELETE",
  });
}

export async function uploadDevelopmentModelCover(
  modelId: number,
  file: File,
): Promise<DevelopmentApiUnitModel> {
  const body = new FormData();
  body.append("file", file);
  return developmentsFetch<DevelopmentApiUnitModel>(
    `/development-models/${modelId}/cover-image/`,
    { method: "POST", body },
  );
}

export async function listDevelopmentModelGallery(
  modelId: number,
): Promise<DevelopmentMediaItem[]> {
  const rows = await developmentsFetch<DevelopmentMediaItem[]>(
    `/development-models/${modelId}/gallery/`,
  );
  return rows.map((row) => ({
    ...row,
    image_url: resolveMediaUrl(row.image_url) ?? row.image_url,
  }));
}

export async function addDevelopmentModelGalleryImage(
  modelId: number,
  file: File,
): Promise<DevelopmentMediaItem> {
  const body = new FormData();
  body.append("file", file);
  const row = await developmentsFetch<DevelopmentMediaItem>(
    `/development-models/${modelId}/gallery/`,
    { method: "POST", body },
  );
  return {
    ...row,
    image_url: resolveMediaUrl(row.image_url) ?? row.image_url,
  };
}

export async function deleteDevelopmentModelGalleryImage(
  modelId: number,
  imageId: number,
): Promise<void> {
  await developmentsFetch<void>(
    `/development-models/${modelId}/gallery/${imageId}/`,
    { method: "DELETE" },
  );
}

export async function listDevelopmentModelFloorPlans(
  modelId: number,
): Promise<DevelopmentMediaItem[]> {
  const rows = await developmentsFetch<DevelopmentMediaItem[]>(
    `/development-models/${modelId}/floor-plans/`,
  );
  return rows.map((row) => ({
    ...row,
    image_url: resolveMediaUrl(row.image_url) ?? row.image_url,
  }));
}

export async function addDevelopmentModelFloorPlan(
  modelId: number,
  file: File,
  label: string,
): Promise<DevelopmentMediaItem> {
  const body = new FormData();
  body.append("file", file);
  body.append("label", label);
  const row = await developmentsFetch<DevelopmentMediaItem>(
    `/development-models/${modelId}/floor-plans/`,
    { method: "POST", body },
  );
  return {
    ...row,
    image_url: resolveMediaUrl(row.image_url) ?? row.image_url,
  };
}

export async function updateDevelopmentModelFloorPlan(
  modelId: number,
  planId: number,
  payload: { label?: string; file?: File; order?: number },
): Promise<DevelopmentMediaItem> {
  const body = new FormData();
  if (payload.label != null) body.append("label", payload.label);
  if (payload.file) body.append("file", payload.file);
  if (payload.order != null) body.append("order", String(payload.order));
  const row = await developmentsFetch<DevelopmentMediaItem>(
    `/development-models/${modelId}/floor-plans/${planId}/`,
    { method: "PATCH", body },
  );
  return {
    ...row,
    image_url: resolveMediaUrl(row.image_url) ?? row.image_url,
  };
}

export async function deleteDevelopmentModelFloorPlan(
  modelId: number,
  planId: number,
): Promise<void> {
  await developmentsFetch<void>(
    `/development-models/${modelId}/floor-plans/${planId}/`,
    { method: "DELETE" },
  );
}

/**
 * Listado público desde la API.
 * Si la API responde vacía → lista vacía (CMS empty state).
 * Solo si la API no está disponible → fallback a mock (dev offline).
 */
export async function getPublicDevelopments(): Promise<Development[]> {
  try {
    const rows = await listDevelopmentsApi({ publishedOnly: true });
    return rows.map((row) =>
      mapDevelopmentFromApi({ ...row, models: row.models ?? [] }),
    );
  } catch {
    const { getDevelopments } = await import("@/lib/mock/developments");
    return getDevelopments();
  }
}

export async function getPublicDevelopmentBySlug(
  slug: string,
): Promise<Development | null> {
  try {
    const row = await getDevelopmentBySlugApi(slug);
    return mapDevelopmentFromApi(row);
  } catch {
    const { getDevelopmentBySlug } = await import("@/lib/mock/developments");
    return getDevelopmentBySlug(slug) ?? null;
  }
}

export async function getPublicDevelopmentsPage(): Promise<DevelopmentsPageContent | null> {
  try {
    return await getDevelopmentsPageContent();
  } catch {
    return null;
  }
}
