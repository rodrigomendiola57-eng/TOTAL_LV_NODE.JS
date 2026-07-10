import type { HomePageContent, HomePageUpdatePayload } from "@/types/home-content";

export function buildHomeUpdatePayload(
  content: HomePageContent,
): HomePageUpdatePayload {
  return {
    is_published: content.is_published,
    hero_eyebrow: content.hero_eyebrow,
    hero_title: content.hero_title,
    hero_subtitle: content.hero_subtitle,
    about_eyebrow: content.about_eyebrow,
    about_title: content.about_title,
    about_body: content.about_body,
    about_cta_label: content.about_cta_label,
    about_cta_url: content.about_cta_url,
    about_social_label: content.about_social_label,
    featured_eyebrow: content.featured_eyebrow,
    featured_title: content.featured_title,
    featured_empty_message: content.featured_empty_message,
    featured_links: content.featured_links,
    zones_eyebrow: content.zones_eyebrow,
    zones_title: content.zones_title,
    zones_description: content.zones_description,
    zones_cta_label: content.zones_cta_label,
    zones_cta_url: content.zones_cta_url,
    contact_eyebrow: content.contact_eyebrow,
    contact_title: content.contact_title,
    contact_description: content.contact_description,
    contact_cta_label: content.contact_cta_label,
    contact_cta_url: content.contact_cta_url,
    expertise_title: content.expertise_title,
    expertise_subtitle: content.expertise_subtitle,
  };
}
