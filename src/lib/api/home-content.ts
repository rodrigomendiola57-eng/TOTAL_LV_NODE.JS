import { getApiBaseUrl } from "@/lib/api-base-url";
import { HOME_CONTENT_FALLBACK } from "@/lib/home-content-defaults";
import { resolveMediaUrl } from "@/lib/media-url";
import type {
  HomeAboutSlide,
  HomeAboutSlideWritePayload,
  HomeCityHighlight,
  HomeCityHighlightUpdatePayload,
  HomeExpertisePillar,
  HomeExpertisePillarWritePayload,
  HomeExpertiseService,
  HomeExpertiseServiceWritePayload,
  HomePageContent,
  HomePageUpdatePayload,
} from "@/types/home-content";

async function homeFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Home content request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function normalizeSlide(slide: HomeAboutSlide): HomeAboutSlide {
  return {
    ...slide,
    image_url: resolveMediaUrl(slide.image_url) ?? slide.image_url,
    image_mobile_url:
      resolveMediaUrl(slide.image_mobile_url) ?? slide.image_mobile_url,
  };
}

function normalizeCity(city: HomeCityHighlight): HomeCityHighlight {
  return {
    ...city,
    image_desktop_url:
      resolveMediaUrl(city.image_desktop_url) ?? city.image_desktop_url,
    image_mobile_url:
      resolveMediaUrl(city.image_mobile_url) ?? city.image_mobile_url,
  };
}

function normalizeHomeContent(data: HomePageContent): HomePageContent {
  return {
    ...data,
    hero_background_url:
      resolveMediaUrl(data.hero_background_url) ?? data.hero_background_url,
    about_slides: data.about_slides.map(normalizeSlide),
    city_highlight: normalizeCity(data.city_highlight),
  };
}

export async function getHomeContent(): Promise<HomePageContent> {
  const data = await homeFetch<HomePageContent>("/home/current/");
  return normalizeHomeContent(data);
}

/** Carga del homepage público (servidor) con fallback si la API no responde. */
export async function getPublicHomeContent(): Promise<HomePageContent> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/home/current/`, {
      method: "GET",
      headers: { Accept: "application/json" },
      // Cache corto: evita re-render completo en cada navegación al inicio.
      // Tras editar en el dashboard, el sitio público se actualiza en ≤30s.
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`Home content failed (${response.status})`);
    }

    const data = (await response.json()) as HomePageContent;
    return normalizeHomeContent(data);
  } catch {
    return HOME_CONTENT_FALLBACK;
  }
}

export async function updateHomeContent(
  payload: HomePageUpdatePayload,
): Promise<HomePageContent> {
  const data = await homeFetch<HomePageContent>("/home/current/", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return normalizeHomeContent(data);
}

export async function uploadHeroBackground(file: File): Promise<HomePageContent> {
  const formData = new FormData();
  formData.append("file", file);

  const data = await homeFetch<HomePageContent>("/home/current/hero-background/", {
    method: "POST",
    body: formData,
  });
  return normalizeHomeContent(data);
}

export async function updateCityHighlight(
  payload: HomeCityHighlightUpdatePayload,
): Promise<HomeCityHighlight> {
  const data = await homeFetch<HomeCityHighlight>("/home/current/city-highlight/", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return normalizeCity(data);
}

export async function uploadCityImage(
  file: File,
  variant: "desktop" | "mobile",
): Promise<HomeCityHighlight> {
  const formData = new FormData();
  formData.append("file", file);

  const data = await homeFetch<HomeCityHighlight>(
    `/home/current/city-highlight/image/?variant=${variant}`,
    {
      method: "POST",
      body: formData,
    },
  );
  return normalizeCity(data);
}

export async function createAboutSlide(
  payload: HomeAboutSlideWritePayload,
): Promise<HomeAboutSlide> {
  const data = await homeFetch<HomeAboutSlide>("/home/about-slides/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return normalizeSlide(data);
}

export async function updateAboutSlide(
  id: number,
  payload: Partial<HomeAboutSlideWritePayload>,
): Promise<HomeAboutSlide> {
  const data = await homeFetch<HomeAboutSlide>(`/home/about-slides/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return normalizeSlide(data);
}

export async function deleteAboutSlide(id: number): Promise<void> {
  await homeFetch<void>(`/home/about-slides/${id}/`, { method: "DELETE" });
}

export async function uploadAboutSlideImage(
  id: number,
  file: File,
  variant: "desktop" | "mobile" = "desktop",
): Promise<HomeAboutSlide> {
  const formData = new FormData();
  formData.append("file", file);

  const data = await homeFetch<HomeAboutSlide>(
    `/home/about-slides/${id}/image/?variant=${variant}`,
    {
      method: "POST",
      body: formData,
    },
  );
  return normalizeSlide(data);
}

export async function updateExpertiseService(
  id: number,
  payload: Partial<HomeExpertiseServiceWritePayload>,
): Promise<HomeExpertiseService> {
  return homeFetch<HomeExpertiseService>(`/home/expertise-services/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateExpertisePillar(
  id: number,
  payload: Partial<HomeExpertisePillarWritePayload>,
): Promise<HomeExpertisePillar> {
  return homeFetch<HomeExpertisePillar>(`/home/expertise-pillars/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
