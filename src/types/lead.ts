export type LeadStatus = "Nuevo" | "En Contacto" | "Negociación" | "Cerrado";

export type LeadChannel = "Web" | "WhatsApp" | "Meta";

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  interested_in: number | null;
  interested_property_title?: string;
  status: LeadStatus;
  channel: LeadChannel;
  created_at: string;
  last_message?: string;
  unread?: boolean;
}

export interface LeadMessage {
  id: number;
  lead_id: number;
  content: string;
  sender: "lead" | "agent";
  sent_at: string;
}
