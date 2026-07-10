/** Tipos del contenido editable de la página de inicio. */

export interface HomeFeaturedLink {
  label: string;
  href: string;
}

export interface HomeAboutSlide {
  id: number;
  alt_text: string;
  external_url: string;
  order: number;
  image_url: string | null;
  image_mobile_url: string | null;
}

export interface HomeCityHighlight {
  aria_label: string;
  city_name: string;
  title: string;
  description: string;
  image_desktop_url: string | null;
  image_mobile_url: string | null;
  external_desktop_url: string;
  external_mobile_url: string;
}

export interface HomeExpertiseService {
  id: number;
  slug: string;
  title: string;
  description: string;
  bullets: string[];
  icon: string;
  order: number;
  is_active: boolean;
}

export interface HomeExpertisePillar {
  id: number;
  slug: string;
  title: string;
  description: string;
  bento_class: string;
  order: number;
  is_active: boolean;
}

export interface HomePageContent {
  id: number;
  is_published: boolean;
  updated_at: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_background_url: string | null;
  about_eyebrow: string;
  about_title: string;
  about_body: string;
  about_cta_label: string;
  about_cta_url: string;
  about_social_label: string;
  about_slides: HomeAboutSlide[];
  featured_eyebrow: string;
  featured_title: string;
  featured_empty_message: string;
  featured_links: HomeFeaturedLink[];
  city_highlight: HomeCityHighlight;
  zones_eyebrow: string;
  zones_title: string;
  zones_description: string;
  zones_cta_label: string;
  zones_cta_url: string;
  contact_eyebrow: string;
  contact_title: string;
  contact_description: string;
  contact_cta_label: string;
  contact_cta_url: string;
  expertise_title: string;
  expertise_subtitle: string;
  expertise_services: HomeExpertiseService[];
  expertise_pillars: HomeExpertisePillar[];
}

export type HomePageUpdatePayload = Partial<
  Pick<
    HomePageContent,
    | "is_published"
    | "hero_eyebrow"
    | "hero_title"
    | "hero_subtitle"
    | "about_eyebrow"
    | "about_title"
    | "about_body"
    | "about_cta_label"
    | "about_cta_url"
    | "about_social_label"
    | "featured_eyebrow"
    | "featured_title"
    | "featured_empty_message"
    | "featured_links"
    | "zones_eyebrow"
    | "zones_title"
    | "zones_description"
    | "zones_cta_label"
    | "zones_cta_url"
    | "contact_eyebrow"
    | "contact_title"
    | "contact_description"
    | "contact_cta_label"
    | "contact_cta_url"
    | "expertise_title"
    | "expertise_subtitle"
  >
>;

export type HomeCityHighlightUpdatePayload = Partial<
  Pick<
    HomeCityHighlight,
    | "aria_label"
    | "city_name"
    | "title"
    | "description"
    | "external_desktop_url"
    | "external_mobile_url"
  >
>;

export type HomeAboutSlideWritePayload = Pick<
  HomeAboutSlide,
  "alt_text" | "external_url" | "order"
>;

export type HomeExpertiseServiceWritePayload = Omit<
  HomeExpertiseService,
  "id"
>;

export type HomeExpertisePillarWritePayload = Omit<
  HomeExpertisePillar,
  "id"
>;

export type InicioSectionId =
  | "hero"
  | "about"
  | "featured"
  | "city"
  | "expertise";
