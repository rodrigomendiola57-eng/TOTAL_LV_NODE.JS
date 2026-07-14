import { getApiBaseUrl } from "@/lib/api-base-url";
import { ASESORIA_PAGE_DEFAULT } from "@/lib/data/asesoria";
import type { AsesoriaPageContent } from "@/lib/data/asesoria";
import type {
  AsesoriaPageApiContent,
  AsesoriaPageUpdatePayload,
} from "@/types/asesoria-page";

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

export function mapAsesoriaApiToPageContent(
  api: AsesoriaPageApiContent,
): AsesoriaPageContent {
  return {
    hero: {
      eyebrow: api.hero_eyebrow || ASESORIA_PAGE_DEFAULT.hero.eyebrow,
      title: api.hero_title || ASESORIA_PAGE_DEFAULT.hero.title,
      subtitle: api.hero_subtitle || ASESORIA_PAGE_DEFAULT.hero.subtitle,
      imageUrl:
        api.hero_image_url ||
        api.hero_image_external_url ||
        ASESORIA_PAGE_DEFAULT.hero.imageUrl,
    },
    tabs:
      Array.isArray(api.tabs) && api.tabs.length > 0
        ? api.tabs.map((tab) => ({
            id: tab.id,
            tabLabel: tab.tabLabel,
            title: tab.title,
            description: tab.description,
            whatsappMessage: tab.whatsappMessage,
            process: tab.process ?? [],
            features: tab.features ?? [],
          }))
        : ASESORIA_PAGE_DEFAULT.tabs,
    pillars:
      Array.isArray(api.pillars) && api.pillars.length > 0
        ? api.pillars
        : ASESORIA_PAGE_DEFAULT.pillars,
    cta: {
      title: api.cta_title || ASESORIA_PAGE_DEFAULT.cta.title,
      subtitle: api.cta_subtitle || ASESORIA_PAGE_DEFAULT.cta.subtitle,
      ctaLabel: api.cta_label || ASESORIA_PAGE_DEFAULT.cta.ctaLabel,
      whatsappMessage:
        api.cta_whatsapp_message || ASESORIA_PAGE_DEFAULT.cta.whatsappMessage,
    },
  };
}

export async function getAsesoriaPageContent(options?: {
  revalidate?: number | false;
  lang?: "es" | "en" | "edit";
}): Promise<AsesoriaPageApiContent> {
  const lang = options?.lang ?? "es";
  const query = lang === "es" ? "" : `?lang=${lang}`;
  const response = await fetch(`${getApiBaseUrl()}/asesoria-page/current/${query}`, {
    ...(options?.revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate: options?.revalidate ?? 30 } }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as AsesoriaPageApiContent;
}

/** Público: API con fallback al default estático. */
export async function getPublicAsesoriaPageContent(
  locale: "es" | "en" = "es",
): Promise<{
  content: AsesoriaPageContent;
  servicesTitle: string;
  heroImageUrl: string | null;
}> {
  try {
    const api = await getAsesoriaPageContent({ revalidate: 30, lang: locale });
    if (api.is_published === false) {
      return {
        content: ASESORIA_PAGE_DEFAULT,
        servicesTitle: "Servicios de Asesoría Inmobiliaria",
        heroImageUrl: ASESORIA_PAGE_DEFAULT.hero.imageUrl,
      };
    }
    return {
      content: mapAsesoriaApiToPageContent(api),
      servicesTitle:
        api.services_title || "Servicios de Asesoría Inmobiliaria",
      heroImageUrl:
        api.hero_image_url || api.hero_image_external_url || null,
    };
  } catch {
    return {
      content: ASESORIA_PAGE_DEFAULT,
      servicesTitle: "Servicios de Asesoría Inmobiliaria",
      heroImageUrl: ASESORIA_PAGE_DEFAULT.hero.imageUrl,
    };
  }
}

export async function updateAsesoriaPageContent(
  payload: AsesoriaPageUpdatePayload,
): Promise<AsesoriaPageApiContent> {
  const response = await fetch(`${getApiBaseUrl()}/asesoria-page/current/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as AsesoriaPageApiContent;
}

export async function uploadAsesoriaHeroImage(
  file: File,
): Promise<AsesoriaPageApiContent> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(
    `${getApiBaseUrl()}/asesoria-page/current/hero-image/`,
    { method: "POST", body: form },
  );
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as AsesoriaPageApiContent;
}
