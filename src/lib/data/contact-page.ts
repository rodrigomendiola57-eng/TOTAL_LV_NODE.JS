import type { ContactChannelItem } from "@/components/contact/ContactChannelList";
import type { ContactChannelApi } from "@/types/contact-page";

/** Contenido tipado de /contacto (fallback + shape público). */
export type ContactPageContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  channels: ContactChannelItem[];
  form: {
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phoneHint: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    quickPromptsLabel: string;
    quickPrompts: string[];
    submitLabel: string;
    submittingLabel: string;
    successTitle: string;
    successMessage: string;
    resetLabel: string;
  };
  reassurance: {
    title: string;
    items: string[];
    footer: string;
  };
  property: {
    bannerLabel: string;
    bannerCta: string;
    formLabel: string;
  };
  seo: {
    title: string;
    description: string;
  };
};

const DEFAULT_CHANNELS: ContactChannelItem[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "+52 442 327 1417",
    href: "https://wa.me/524423271417",
    hint: "Agenda visitas y consultas rápidas",
  },
  {
    id: "email",
    label: "Correo",
    value: "contacto@totalliving.mx",
    href: "mailto:contacto@totalliving.mx",
    hint: "Respuesta en horario laboral",
  },
  {
    id: "location",
    label: "Ubicación",
    value: "Querétaro, México",
    href: "/zonas",
    hint: "8 zonas premium de operación",
  },
];

export const CONTACT_PAGE_DEFAULT: ContactPageContent = {
  hero: {
    eyebrow: "Total Living · Contacto",
    title: "Hablemos de tu próxima inversión",
    description:
      "Cuéntanos qué buscas y un asesor Total Living te responderá con opciones claras, estrategia y acompañamiento de principio a fin.",
  },
  channels: DEFAULT_CHANNELS,
  form: {
    title: "Envíanos tu consulta",
    description:
      "Completa el formulario en menos de un minuto. Tu navegador puede sugerirte nombre, correo y teléfono guardados.",
    nameLabel: "Tu nombre",
    namePlaceholder: "Ej. Ana Mendiola",
    phoneLabel: "Teléfono",
    phoneHint: "WhatsApp ok",
    phonePlaceholder: "442 123 4567",
    emailLabel: "Correo",
    emailPlaceholder: "tu@correo.com",
    messageLabel: "¿Qué estás buscando?",
    messagePlaceholder: "Ej. Casa en venta en Juriquilla, 3 recámaras...",
    quickPromptsLabel: "Respuestas rápidas",
    quickPrompts: [
      "Busco casa en venta",
      "Busco departamento en renta",
      "Me interesa un desarrollo",
      "Quiero asesoría para invertir",
    ],
    submitLabel: "Enviar consulta",
    submittingLabel: "Enviando...",
    successTitle: "Consulta enviada",
    successMessage:
      "Ya recibimos tu mensaje. Un asesor Total Living revisará tu solicitud y te contactará pronto.",
    resetLabel: "Enviar otra consulta",
  },
  reassurance: {
    title: "Por qué es fácil",
    items: [
      "Respuesta personalizada por un asesor",
      "Sin compromiso en la primera consulta",
      "Acompañamiento legal y estratégico",
    ],
    footer: "Respuesta habitual en horario laboral",
  },
  property: {
    bannerLabel: "Propiedad de interés",
    bannerCta: "Ver ficha",
    formLabel: "Consulta sobre",
  },
  seo: {
    title: "Contacto | Total Living",
    description:
      "Contáctanos para asesoría inmobiliaria en Querétaro. Envía tu consulta y un asesor Total Living te responderá con estrategia y acompañamiento.",
  },
};

/** @deprecated Prefer CONTACT_PAGE_DEFAULT — se mantiene por compatibilidad. */
export const CONTACT_PAGE = CONTACT_PAGE_DEFAULT;

export function normalizeContactChannels(
  channels: ContactChannelApi[] | undefined | null,
): ContactChannelItem[] {
  if (!Array.isArray(channels) || channels.length === 0) {
    return DEFAULT_CHANNELS;
  }
  const allowed = new Set(["whatsapp", "email", "location"]);
  const cleaned = channels
    .filter((ch) => allowed.has(ch.id))
    .map((ch) => ({
      id: ch.id as ContactChannelItem["id"],
      label: ch.label?.trim() || ch.id,
      value: ch.value?.trim() || "",
      href: ch.href?.trim() || "#",
      hint: ch.hint?.trim() || "",
    }));
  return cleaned.length > 0 ? cleaned : DEFAULT_CHANNELS;
}
