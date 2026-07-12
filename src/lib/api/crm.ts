import type {
  CreateLeadPayload,
  Lead,
  LeadFilters,
  LeadMessage,
  LeadStatus,
} from "@/types/lead";

import { getApiBaseUrl } from "@/lib/api-base-url";

function buildQuery(filters?: LeadFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.unread) {
    params.set("unread", "true");
  }
  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

async function crmFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `CRM request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getLeads(filters?: LeadFilters): Promise<Lead[]> {
  return crmFetch<Lead[]>(`/leads/${buildQuery(filters)}`);
}

/** Conteos ligeros del CRM (evita listar todos los leads). */
export async function getLeadStats(init?: {
  headers?: HeadersInit;
}): Promise<{ total: number; active: number }> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/leads/stats/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
      next: { revalidate: 20, tags: ["dashboard-leads"] },
    });
    if (!response.ok) return { total: 0, active: 0 };
    const data = (await response.json()) as {
      total?: number;
      active?: number;
    };
    return {
      total: Number(data.total) || 0,
      active: Number(data.active) || 0,
    };
  } catch {
    return { total: 0, active: 0 };
  }
}

export async function getLeadMessages(leadId: number): Promise<LeadMessage[]> {
  return crmFetch<LeadMessage[]>(`/leads/${leadId}/messages/`);
}

export async function sendLeadMessage(
  leadId: number,
  content: string,
): Promise<LeadMessage> {
  return crmFetch<LeadMessage>(`/leads/${leadId}/send_message/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export async function markLeadRead(leadId: number): Promise<void> {
  await crmFetch(`/leads/${leadId}/mark_read/`, { method: "POST" });
}

export async function updateLeadStatus(
  leadId: number,
  status: LeadStatus,
): Promise<Lead> {
  return crmFetch<Lead>(`/leads/${leadId}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  return crmFetch<Lead>("/leads/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      channel: "Web",
      website: payload.website ?? "",
      ...payload,
    }),
  });
}
