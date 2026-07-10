"use client";

import type { CrmLeadFilters } from "@/lib/crm-lead-filters";
import { DEFAULT_CRM_LEAD_FILTERS } from "@/lib/crm-lead-filters";
import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/types/lead";
import { RotateCcw, Search } from "lucide-react";

const STATUS_OPTIONS: Array<{ value: CrmLeadFilters["status"]; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "Nuevo", label: "Nuevo" },
  { value: "En Contacto", label: "En contacto" },
  { value: "Negociación", label: "Negociación" },
  { value: "Cerrado", label: "Cerrado" },
];

interface CrmFiltersBarProps {
  filters: CrmLeadFilters;
  resultCount: number;
  totalCount: number;
  onChange: (filters: CrmLeadFilters) => void;
}

export function CrmFiltersBar({
  filters,
  resultCount,
  totalCount,
  onChange,
}: CrmFiltersBarProps) {
  const hasFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.unreadOnly;

  return (
    <div className="space-y-4 rounded-2xl border border-tl-gold/20 bg-tl-black/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-gold/85">
            Filtros
          </p>
          <p className="mt-1 font-outfit text-sm font-light text-tl-beige/55">
            {resultCount} de {totalCount} leads
          </p>
        </div>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_CRM_LEAD_FILTERS)}
            className="inline-flex items-center gap-1.5 rounded-full border border-tl-gold/25 px-3 py-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/65 transition-colors hover:border-tl-gold/45 hover:text-tl-gold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Limpiar
          </button>
        ) : null}
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tl-gold/70" />
        <input
          type="search"
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Buscar por nombre, correo, teléfono o mensaje..."
          className="w-full rounded-xl border border-tl-gold/20 bg-tl-black/60 py-2.5 pl-10 pr-4 font-outfit font-light text-sm text-tl-beige outline-none transition-colors placeholder:text-tl-beige/35 focus:border-tl-gold/45"
          aria-label="Buscar leads"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange({ ...filters, status: option.value })}
            className={cn(
              "rounded-full border px-3 py-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.12em] transition-colors",
              filters.status === option.value
                ? "border-tl-gold/60 bg-tl-gold/15 text-tl-beige"
                : "border-white/10 text-tl-beige/55 hover:border-white/20 hover:text-tl-beige",
            )}
          >
            {option.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() =>
            onChange({ ...filters, unreadOnly: !filters.unreadOnly })
          }
          className={cn(
            "rounded-full border px-3 py-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.12em] transition-colors",
            filters.unreadOnly
              ? "border-tl-gold/60 bg-tl-gold/15 text-tl-beige"
              : "border-white/10 text-tl-beige/55 hover:border-white/20 hover:text-tl-beige",
          )}
        >
          Sin leer
        </button>
      </div>
    </div>
  );
}

export function getStatusStyle(status: LeadStatus): string {
  switch (status) {
    case "Nuevo":
      return "border-tl-gold/40 bg-tl-gold/10 text-tl-gold";
    case "En Contacto":
      return "border-sky-500/35 bg-sky-500/10 text-sky-300";
    case "Negociación":
      return "border-amber-500/35 bg-amber-500/10 text-amber-200";
    case "Cerrado":
      return "border-white/15 bg-white/5 text-tl-beige/55";
    default:
      return "border-white/15 bg-white/5 text-tl-beige/55";
  }
}
