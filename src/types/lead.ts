export type LeadStatus = "Nuevo" | "En Contacto" | "Negociación" | "Cerrado";

export type LeadChannel = "Web";

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  interested_in: number | null;
  interested_property_title?: string | null;
  assigned_agent?: number | null;
  status: LeadStatus;
  channel: LeadChannel;
  created_at: string;
  updated_at: string;
  last_message?: string;
  unread?: boolean;
  unread_count?: number;
}

export interface LeadMessage {
  id: number;
  lead: number;
  content: string;
  sender: "lead" | "agent";
  direction: "inbound" | "outbound";
  channel: LeadChannel;
  delivery_status: "pending" | "sent" | "delivered" | "failed";
  sent_at: string;
  read_at: string | null;
}

export interface CreateLeadPayload {
  name: string;
  phone?: string;
  email?: string;
  channel?: LeadChannel;
  interested_in?: number | null;
  initial_message?: string;
  /** Honeypot — debe ir vacío. */
  website?: string;
}

export interface LeadFilters {
  status?: LeadStatus | "all";
  unread?: boolean;
  search?: string;
}
