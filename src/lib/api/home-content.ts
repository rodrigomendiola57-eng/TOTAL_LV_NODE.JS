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
  HomeJournalPost,
  HomeJournalPostWritePayload,
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

function normalizeJournalPost(post: HomeJournalPost): HomeJournalPost {
  return {
    ...post,
    image_url: resolveMediaUrl(post.image_url) ?? post.image_url,
    video_url: resolveMediaUrl(post.video_url) ?? post.video_url,
  };
}

function normalizeHomeContent(data: HomePageContent): HomePageContent {
  return {
    ...data,
    hero_background_url:
      resolveMediaUrl(data.hero_background_url) ?? data.hero_background_url,
    hero_video_url:
      resolveMediaUrl(data.hero_video_url) ?? data.hero_video_url ?? null,
    about_slides: (data.about_slides ?? []).map(normalizeSlide),
    city_highlight: normalizeCity(data.city_highlight),
    journal_posts: (data.journal_posts ?? []).map(normalizeJournalPost),
    expertise_services: data.expertise_services ?? [],
    expertise_pillars: data.expertise_pillars ?? [],
  };
}

export async function getHomeContent(options?: {
  lang?: "es" | "en" | "edit";
}): Promise<HomePageContent> {
  const lang = options?.lang ?? "es";
  const query = lang === "es" ? "" : `?lang=${lang}`;
  const data = await homeFetch<HomePageContent>(`/home/current/${query}`);
  return normalizeHomeContent(data);
}

/** Carga del homepage público (servidor) con fallback si la API no responde. */
export async function getPublicHomeContent(
  locale: "es" | "en" = "es",
): Promise<HomePageContent> {
  try {
    const query = locale === "en" ? "?lang=en" : "";
    const response = await fetch(`${getApiBaseUrl()}/home/current/${query}`, {
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

export async function uploadHeroVideo(file: File): Promise<HomePageContent> {
  const formData = new FormData();
  formData.append("file", file);

  const data = await homeFetch<HomePageContent>("/home/current/hero-video/", {
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

export async function createJournalPost(
  payload: HomeJournalPostWritePayload,
): Promise<HomeJournalPost> {
  const data = await homeFetch<HomeJournalPost>("/home/journal-posts/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return normalizeJournalPost(data);
}

export async function updateJournalPost(
  id: number,
  payload: Partial<HomeJournalPostWritePayload>,
): Promise<HomeJournalPost> {
  const data = await homeFetch<HomeJournalPost>(`/home/journal-posts/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return normalizeJournalPost(data);
}

export async function deleteJournalPost(id: number): Promise<void> {
  await homeFetch<void>(`/home/journal-posts/${id}/`, { method: "DELETE" });
}

export async function uploadJournalPostImage(
  id: number,
  file: File,
): Promise<HomeJournalPost> {
  const formData = new FormData();
  formData.append("file", file);
  const data = await homeFetch<HomeJournalPost>(
    `/home/journal-posts/${id}/image/`,
    { method: "POST", body: formData },
  );
  return normalizeJournalPost(data);
}

export async function uploadJournalPostVideo(
  id: number,
  file: File,
): Promise<HomeJournalPost> {
  const formData = new FormData();
  formData.append("file", file);
  const data = await homeFetch<HomeJournalPost>(
    `/home/journal-posts/${id}/video/`,
    { method: "POST", body: formData },
  );
  return normalizeJournalPost(data);
}
