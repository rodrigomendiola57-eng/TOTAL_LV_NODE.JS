import type { LeadStatus } from "@/types/lead";

export type CrmStatusFilter = LeadStatus | "all";

export interface CrmLeadFilters {
  search: string;
  status: CrmStatusFilter;
  unreadOnly: boolean;
}

export const DEFAULT_CRM_LEAD_FILTERS: CrmLeadFilters = {
  search: "",
  status: "all",
  unreadOnly: false,
};

export function countActiveCrmFilters(filters: CrmLeadFilters): number {
  let count = 0;
  if (filters.search.trim()) count += 1;
  if (filters.status !== "all") count += 1;
  if (filters.unreadOnly) count += 1;
  return count;
}
