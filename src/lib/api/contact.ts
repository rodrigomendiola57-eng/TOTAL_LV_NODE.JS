import { getApiBaseUrl } from "@/lib/api-base-url";
import {
  CONTACT_PAGE_DEFAULT,
  normalizeContactChannels,
  type ContactPageContent,
} from "@/lib/data/contact-page";
import type { Locale } from "@/lib/i18n/locales";
import type {
  ContactPageApiContent,
  ContactPageUpdatePayload,
} from "@/types/contact-page";

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

export function mapContactApiToPageContent(
  api: ContactPageApiContent,
): ContactPageContent {
  const d = CONTACT_PAGE_DEFAULT;
  // `??` (no `||`): un string vacío del CMS se respeta como borrado intencional.
  return {
    hero: {
      eyebrow: api.hero_eyebrow ?? d.hero.eyebrow,
      title: api.hero_title ?? d.hero.title,
      description: api.hero_description ?? d.hero.description,
    },
    channels: normalizeContactChannels(api.channels),
    form: {
      title: api.form_title ?? d.form.title,
      description: api.form_description ?? d.form.description,
      nameLabel: api.form_name_label ?? d.form.nameLabel,
      namePlaceholder: api.form_name_placeholder ?? d.form.namePlaceholder,
      phoneLabel: api.form_phone_label ?? d.form.phoneLabel,
      phoneHint: api.form_phone_hint ?? d.form.phoneHint,
      phonePlaceholder: api.form_phone_placeholder ?? d.form.phonePlaceholder,
      emailLabel: api.form_email_label ?? d.form.emailLabel,
      emailPlaceholder: api.form_email_placeholder ?? d.form.emailPlaceholder,
      messageLabel: api.form_message_label ?? d.form.messageLabel,
      messagePlaceholder:
        api.form_message_placeholder ?? d.form.messagePlaceholder,
      quickPromptsLabel:
        api.form_quick_prompts_label ?? d.form.quickPromptsLabel,
      quickPrompts: Array.isArray(api.form_quick_prompts)
        ? api.form_quick_prompts
        : d.form.quickPrompts,
      submitLabel: api.form_submit_label ?? d.form.submitLabel,
      submittingLabel: api.form_submitting_label ?? d.form.submittingLabel,
      successTitle: api.form_success_title ?? d.form.successTitle,
      successMessage: api.form_success_message ?? d.form.successMessage,
      resetLabel: api.form_reset_label ?? d.form.resetLabel,
    },
    reassurance: {
      title: api.reassurance_title ?? d.reassurance.title,
      items: Array.isArray(api.reassurance_items)
        ? api.reassurance_items
        : d.reassurance.items,
      footer: api.reassurance_footer ?? d.reassurance.footer,
    },
    property: {
      bannerLabel: api.property_banner_label ?? d.property.bannerLabel,
      bannerCta: api.property_banner_cta ?? d.property.bannerCta,
      formLabel: api.property_form_label ?? d.property.formLabel,
    },
    seo: {
      title: api.seo_title ?? d.seo.title,
      description: api.seo_description ?? d.seo.description,
    },
  };
}

export async function getContactPageContent(options?: {
  revalidate?: number | false;
  /** `edit` = ES + content_en; `en` = textos EN resueltos (fallback ES). */
  lang?: Locale | "edit";
}): Promise<ContactPageApiContent> {
  const lang = options?.lang ?? "es";
  const qs = lang === "es" ? "" : `?lang=${lang}`;
  const response = await fetch(
    `${getApiBaseUrl()}/contact-page/current/${qs}`,
    {
      ...(options?.revalidate === false
        ? { cache: "no-store" as const }
        : { next: { revalidate: options?.revalidate ?? 30 } }),
    },
  );
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as ContactPageApiContent;
}

/** Público: API con fallback al default estático. */
export async function getPublicContactPageContent(
  locale: Locale = "es",
): Promise<ContactPageContent> {
  try {
    const api = await getContactPageContent({
      revalidate: 10,
      lang: locale === "en" ? "en" : "es",
    });
    if (api.is_published === false) {
      return CONTACT_PAGE_DEFAULT;
    }
    return mapContactApiToPageContent(api);
  } catch {
    return CONTACT_PAGE_DEFAULT;
  }
}

export async function updateContactPageContent(
  payload: ContactPageUpdatePayload,
): Promise<ContactPageApiContent> {
  const response = await fetch(`${getApiBaseUrl()}/contact-page/current/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as ContactPageApiContent;
}
