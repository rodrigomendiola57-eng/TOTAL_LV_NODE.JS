/** Shape API del singleton Asesoría (snake_case + JSON camelCase anidado). */

export type AsesoriaFeatureApi = {
  icon: string;
  title: string;
  description: string;
  detail?: string;
};

export type AsesoriaProcessStepApi = {
  id: string;
  title: string;
  description: string;
};

export type AsesoriaTabApi = {
  id: string;
  tabLabel: string;
  title: string;
  description: string;
  whatsappMessage: string;
  process?: AsesoriaProcessStepApi[];
  features: AsesoriaFeatureApi[];
};

export type AsesoriaPillarApi = {
  id: string;
  title: string;
  description: string;
};

export type AsesoriaPageApiContent = {
  id: number;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_image_external_url: string;
  services_title: string;
  tabs: AsesoriaTabApi[];
  pillars: AsesoriaPillarApi[];
  cta_title: string;
  cta_subtitle: string;
  cta_label: string;
  cta_whatsapp_message: string;
  is_published: boolean;
  updated_at: string;
  content_en?: Record<string, any>;
};

export type AsesoriaPageUpdatePayload = {
  hero_eyebrow?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_external_url?: string;
  services_title?: string;
  tabs?: AsesoriaTabApi[];
  pillars?: AsesoriaPillarApi[];
  cta_title?: string;
  cta_subtitle?: string;
  cta_label?: string;
  cta_whatsapp_message?: string;
  is_published?: boolean;
  content_en?: Record<string, any>;
};

export type AsesoriaDashboardSectionId =
  | "hero"
  | "compra"
  | "venta"
  | "inversion"
  | "enfoque"
  | "cta";
