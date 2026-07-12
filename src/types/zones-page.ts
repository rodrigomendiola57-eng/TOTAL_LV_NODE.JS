/** CMS textos del intro público /zonas. */

export interface ZonesPageContent {
  id: number;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_image_external_url: string;
  scroll_hint: string;
  is_published: boolean;
  updated_at: string;
}

export type ZonesPageUpdatePayload = Partial<
  Pick<
    ZonesPageContent,
    | "hero_eyebrow"
    | "hero_title"
    | "hero_subtitle"
    | "hero_image_external_url"
    | "scroll_hint"
    | "is_published"
  >
>;
