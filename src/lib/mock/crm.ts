import type { Lead, LeadMessage } from "@/types/lead";

export const MOCK_LEADS: Lead[] = [
  {
    id: 1,
    name: "María González",
    phone: "+52 442 123 4567",
    email: "maria.gonzalez@email.com",
    interested_in: 1,
    interested_property_title: "Residencia Juriquilla Hills",
    status: "Nuevo",
    channel: "WhatsApp",
    created_at: "2026-07-07T18:30:00Z",
    last_message: "¿Tienen disponibilidad para visita este sábado?",
    unread: true,
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    phone: "+52 442 987 6543",
    email: "carlos.ruiz@email.com",
    interested_in: null,
    interested_property_title: "Desarrollo El Marqués",
    status: "En Contacto",
    channel: "Web",
    created_at: "2026-07-07T16:15:00Z",
    last_message: "Me interesa conocer opciones de inversión.",
    unread: false,
  },
  {
    id: 3,
    name: "Ana Martínez",
    phone: "+52 442 555 8899",
    email: "ana.mtz@email.com",
    interested_in: 2,
    interested_property_title: "Penthouse Centro Sur",
    status: "Negociación",
    channel: "Meta",
    created_at: "2026-07-06T22:40:00Z",
    last_message: "Vi el anuncio en Instagram, ¿cuál es el enganche?",
    unread: true,
  },
  {
    id: 4,
    name: "Roberto Sánchez",
    phone: "+52 442 333 2211",
    email: "roberto.s@email.com",
    interested_in: null,
    status: "Nuevo",
    channel: "Meta",
    created_at: "2026-07-06T14:20:00Z",
    last_message: "Busco casa en renta en zona corporativa.",
    unread: false,
  },
] as Lead[];

export const MOCK_MESSAGES: Record<number, LeadMessage[]> = {
  1: [
    {
      id: 101,
      lead_id: 1,
      content: "Hola, vi la propiedad en Juriquilla en su sitio web.",
      sender: "lead",
      sent_at: "2026-07-07T18:25:00Z",
    },
    {
      id: 102,
      lead_id: 1,
      content: "¡Hola María! Con gusto te ayudo. ¿Buscas compra o renta?",
      sender: "agent",
      sent_at: "2026-07-07T18:27:00Z",
    },
    {
      id: 103,
      lead_id: 1,
      content: "¿Tienen disponibilidad para visita este sábado?",
      sender: "lead",
      sent_at: "2026-07-07T18:30:00Z",
    },
  ],
  2: [
    {
      id: 201,
      lead_id: 2,
      content: "Me interesa conocer opciones de inversión.",
      sender: "lead",
      sent_at: "2026-07-07T16:15:00Z",
    },
  ],
  3: [
    {
      id: 301,
      lead_id: 3,
      content: "Vi el anuncio en Instagram, ¿cuál es el enganche?",
      sender: "lead",
      sent_at: "2026-07-06T22:40:00Z",
    },
  ],
  4: [
    {
      id: 401,
      lead_id: 4,
      content: "Busco casa en renta en zona corporativa.",
      sender: "lead",
      sent_at: "2026-07-06T14:20:00Z",
    },
  ],
};
