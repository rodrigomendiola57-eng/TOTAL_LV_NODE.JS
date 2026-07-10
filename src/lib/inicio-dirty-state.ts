import type { HomePageContent } from "@/types/home-content";
import { buildHomeUpdatePayload } from "@/lib/home-content-payload";

/** Solo campos de texto: las imágenes se guardan al subirlas. */
export function hasPendingTextChanges(
  content: HomePageContent,
  baseline: HomePageContent,
): boolean {
  const homeChanged =
    JSON.stringify(buildHomeUpdatePayload(content)) !==
    JSON.stringify(buildHomeUpdatePayload(baseline));

  const cityChanged =
    JSON.stringify({
      aria_label: content.city_highlight.aria_label,
      city_name: content.city_highlight.city_name,
      title: content.city_highlight.title,
      description: content.city_highlight.description,
      external_desktop_url: content.city_highlight.external_desktop_url,
      external_mobile_url: content.city_highlight.external_mobile_url,
    }) !==
    JSON.stringify({
      aria_label: baseline.city_highlight.aria_label,
      city_name: baseline.city_highlight.city_name,
      title: baseline.city_highlight.title,
      description: baseline.city_highlight.description,
      external_desktop_url: baseline.city_highlight.external_desktop_url,
      external_mobile_url: baseline.city_highlight.external_mobile_url,
    });

  const slidesChanged = content.about_slides.some((slide) => {
    const original = baseline.about_slides.find((item) => item.id === slide.id);
    if (!original) return true;
    return (
      original.alt_text !== slide.alt_text ||
      original.external_url !== slide.external_url ||
      original.order !== slide.order
    );
  });

  const servicesChanged = content.expertise_services.some((service) => {
    const original = baseline.expertise_services.find(
      (item) => item.id === service.id,
    );
    if (!original) return true;
    return (
      original.slug !== service.slug ||
      original.title !== service.title ||
      original.description !== service.description ||
      JSON.stringify(original.bullets) !== JSON.stringify(service.bullets) ||
      original.icon !== service.icon ||
      original.order !== service.order ||
      original.is_active !== service.is_active
    );
  });

  const pillarsChanged = content.expertise_pillars.some((pillar) => {
    const original = baseline.expertise_pillars.find(
      (item) => item.id === pillar.id,
    );
    if (!original) return true;
    return (
      original.slug !== pillar.slug ||
      original.title !== pillar.title ||
      original.description !== pillar.description ||
      original.bento_class !== pillar.bento_class ||
      original.order !== pillar.order ||
      original.is_active !== pillar.is_active
    );
  });

  return (
    homeChanged || cityChanged || slidesChanged || servicesChanged || pillarsChanged
  );
}
