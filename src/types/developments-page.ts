/** CMS textos del listado público de desarrollos. */

export interface DevelopmentsPageContent {
  id: number;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_image_external_url: string;
  empty_message: string;
  empty_cta_label: string;
  empty_cta_url: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  updated_at: string;
}

export type DevelopmentsPageUpdatePayload = Partial<
  Pick<
    DevelopmentsPageContent,
    | "hero_eyebrow"
    | "hero_title"
    | "hero_subtitle"
    | "hero_image_external_url"
    | "empty_message"
    | "empty_cta_label"
    | "empty_cta_url"
    | "meta_title"
    | "meta_description"
    | "is_published"
  >
>;
