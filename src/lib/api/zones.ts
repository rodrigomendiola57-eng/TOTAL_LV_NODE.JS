import { getApiBaseUrl } from "@/lib/api-base-url";
import { resolveMediaUrl } from "@/lib/media-url";
import type { QueretaroZone } from "@/types/property";
import type { ZoneCatalogEntry, ZoneGrowthLabel } from "@/types/zone";
import type {
  ZonesPageContent,
  ZonesPageUpdatePayload,
} from "@/types/zones-page";

/** Shape crudo de la API Django (snake_case). */
export interface ZoneApiModel {
  id: number;
  slug: string;
  name: string;
  growth_label: ZoneGrowthLabel;
  description: string;
  sub_zones: string[];
  image_url: string;
  image_external_url?: string;
  is_published: boolean;
  order: number;
  updated_at?: string;
  content_en?: Record<string, any>;
}

export type ZoneWritePayload = {
  slug?: string;
  name: string;
  growth_label: ZoneGrowthLabel;
  description: string;
  sub_zones: string[];
  image_external_url?: string;
  is_published?: boolean;
  order?: number;
  content_en?: Record<string, any>;
};

async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as Record<string, unknown>;
    if (typeof data.detail === "string") return data.detail;
    const first = Object.values(data)[0];
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
    if (typeof first === "string") return first;
  } catch {
    /* ignore */
  }
  return `Error ${response.status}`;
}

export function mapZoneApiToCatalog(row: ZoneApiModel): ZoneCatalogEntry {
  const image =
    resolveMediaUrl(row.image_url) ||
    row.image_external_url ||
    row.image_url ||
    "";

  return {
    id: row.id,
    slug: row.slug,
    name: row.name as QueretaroZone,
    growthLabel: row.growth_label,
    description: row.description,
    subZones: Array.isArray(row.sub_zones) ? row.sub_zones : [],
    image,
    isPublished: row.is_published,
    order: row.order,
    updatedAt: row.updated_at,
  };
}

export async function listZonesApi(options?: {
  all?: boolean;
  revalidate?: number | false;
  lang?: "es" | "en";
}): Promise<ZoneApiModel[]> {
  const queryParams = [];
  if (options?.all) queryParams.push("all=1");
  if (options?.lang && options.lang !== "es") queryParams.push(`lang=${options.lang}`);
  const query = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  const response = await fetch(`${getApiBaseUrl()}/zones/${query}`, {
    ...(options?.revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate: options?.revalidate ?? 30 } }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  const data = (await response.json()) as
    | ZoneApiModel[]
    | { results: ZoneApiModel[] };
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function listZoneCatalog(
  options?: {
    all?: boolean;
    revalidate?: number | false;
    lang?: "es" | "en";
  },
): Promise<ZoneCatalogEntry[]> {
  const rows = await listZonesApi(options);
  return rows.map(mapZoneApiToCatalog);
}

export async function getZoneApi(slug: string): Promise<ZoneApiModel> {
  const response = await fetch(`${getApiBaseUrl()}/zones/${slug}/`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as ZoneApiModel;
}

export async function createZoneApi(
  payload: ZoneWritePayload,
): Promise<ZoneApiModel> {
  const response = await fetch(`${getApiBaseUrl()}/zones/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as ZoneApiModel;
}

export async function updateZoneApi(
  slug: string,
  payload: Partial<ZoneWritePayload>,
): Promise<ZoneApiModel> {
  const response = await fetch(`${getApiBaseUrl()}/zones/${slug}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as ZoneApiModel;
}

export async function deleteZoneApi(slug: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/zones/${slug}/`, {
    method: "DELETE",
  });
  if (!response.ok && response.status !== 204) {
    throw new Error(await parseError(response));
  }
}

export async function uploadZoneImageApi(
  slug: string,
  file: File,
): Promise<ZoneApiModel> {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch(`${getApiBaseUrl()}/zones/${slug}/image/`, {
    method: "POST",
    body,
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  const data = (await response.json()) as { zone: ZoneApiModel };
  return data.zone;
}

export async function getZonesPageContent(options?: {
  revalidate?: number | false;
  lang?: "es" | "en" | "edit";
}): Promise<ZonesPageContent> {
  const lang = options?.lang ?? "es";
  const query = lang === "es" ? "" : `?lang=${lang}`;
  const response = await fetch(`${getApiBaseUrl()}/zones-page/current/${query}`, {
    ...(options?.revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate: options?.revalidate ?? 30 } }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  const data = (await response.json()) as ZonesPageContent;
  return {
    ...data,
    hero_image_url:
      resolveMediaUrl(data.hero_image_url) ?? data.hero_image_url,
  };
}

export async function updateZonesPageContent(
  payload: ZonesPageUpdatePayload,
): Promise<ZonesPageContent> {
  const response = await fetch(`${getApiBaseUrl()}/zones-page/current/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  const data = (await response.json()) as ZonesPageContent;
  return {
    ...data,
    hero_image_url:
      resolveMediaUrl(data.hero_image_url) ?? data.hero_image_url,
  };
}

export async function uploadZonesPageHero(
  file: File,
): Promise<ZonesPageContent> {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch(
    `${getApiBaseUrl()}/zones-page/current/hero-image/`,
    { method: "POST", body },
  );
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  const data = (await response.json()) as ZonesPageContent;
  return {
    ...data,
    hero_image_url:
      resolveMediaUrl(data.hero_image_url) ?? data.hero_image_url,
  };
}
