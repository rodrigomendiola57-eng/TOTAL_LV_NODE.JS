/** Shape API del singleton Contacto (snake_case + JSON anidado). */

export type ContactChannelId = "whatsapp" | "email" | "location";

export type ContactChannelApi = {
  id: ContactChannelId;
  label: string;
  value: string;
  href: string;
  hint: string;
};

export type ContactPageEnPack = {
  hero_eyebrow?: string;
  hero_title?: string;
  hero_description?: string;
  channels?: ContactChannelApi[];
  form_title?: string;
  form_description?: string;
  form_name_label?: string;
  form_name_placeholder?: string;
  form_phone_label?: string;
  form_phone_hint?: string;
  form_phone_placeholder?: string;
  form_email_label?: string;
  form_email_placeholder?: string;
  form_message_label?: string;
  form_message_placeholder?: string;
  form_quick_prompts_label?: string;
  form_quick_prompts?: string[];
  form_submit_label?: string;
  form_submitting_label?: string;
  form_success_title?: string;
  form_success_message?: string;
  form_reset_label?: string;
  reassurance_title?: string;
  reassurance_items?: string[];
  reassurance_footer?: string;
  property_banner_label?: string;
  property_banner_cta?: string;
  property_form_label?: string;
  seo_title?: string;
  seo_description?: string;
};

export type ContactPageApiContent = {
  id: number;
  hero_eyebrow: string;
  hero_title: string;
  hero_description: string;
  channels: ContactChannelApi[];
  form_title: string;
  form_description: string;
  form_name_label: string;
  form_name_placeholder: string;
  form_phone_label: string;
  form_phone_hint: string;
  form_phone_placeholder: string;
  form_email_label: string;
  form_email_placeholder: string;
  form_message_label: string;
  form_message_placeholder: string;
  form_quick_prompts_label: string;
  form_quick_prompts: string[];
  form_submit_label: string;
  form_submitting_label: string;
  form_success_title: string;
  form_success_message: string;
  form_reset_label: string;
  reassurance_title: string;
  reassurance_items: string[];
  reassurance_footer: string;
  property_banner_label: string;
  property_banner_cta: string;
  property_form_label: string;
  seo_title: string;
  seo_description: string;
  /** Pack inglés (solo en lang=edit / default ES sin resolver). */
  content_en?: ContactPageEnPack;
  is_published: boolean;
  updated_at: string;
};

export type ContactPageUpdatePayload = {
  hero_eyebrow?: string;
  hero_title?: string;
  hero_description?: string;
  channels?: ContactChannelApi[];
  form_title?: string;
  form_description?: string;
  form_name_label?: string;
  form_name_placeholder?: string;
  form_phone_label?: string;
  form_phone_hint?: string;
  form_phone_placeholder?: string;
  form_email_label?: string;
  form_email_placeholder?: string;
  form_message_label?: string;
  form_message_placeholder?: string;
  form_quick_prompts_label?: string;
  form_quick_prompts?: string[];
  form_submit_label?: string;
  form_submitting_label?: string;
  form_success_title?: string;
  form_success_message?: string;
  form_reset_label?: string;
  reassurance_title?: string;
  reassurance_items?: string[];
  reassurance_footer?: string;
  property_banner_label?: string;
  property_banner_cta?: string;
  property_form_label?: string;
  seo_title?: string;
  seo_description?: string;
  content_en?: ContactPageEnPack;
  is_published?: boolean;
};

export type ContactDashboardSectionId =
  | "hero"
  | "channels"
  | "form"
  | "reassurance"
  | "seo";
