"use client";

import {
  DEFAULT_PROPERTY_DASHBOARD_FILTERS,
  type PropertyDashboardFilters,
  type PropertySourceFilter,
} from "@/lib/property-dashboard-filters";
import {
  OPERATION_TYPES,
  PROPERTY_TYPES,
} from "@/lib/data/property-options";
import type { OperationType, PropertyType } from "@/types/property";
import { RotateCcw, Search } from "lucide-react";

interface PropertiesFiltersBarProps {
  filters: PropertyDashboardFilters;
  zoneOptions: string[];
  resultCount: number;
  totalCount: number;
  onChange: (filters: PropertyDashboardFilters) => void;
}

const selectClassName =
  "w-full rounded-xl border border-tl-gold/20 bg-tl-black/60 px-3 py-2.5 font-outfit font-light text-xs text-tl-beige/85 outline-none transition-colors focus:border-tl-gold/45";

export function PropertiesFiltersBar({
  filters,
  zoneOptions,
  resultCount,
  totalCount,
  onChange,
}: PropertiesFiltersBarProps) {
  const hasFilters =
    filters.search ||
    filters.operationType !== "all" ||
    filters.propertyType !== "all" ||
    filters.zone !== "all" ||
    filters.source !== "all";

  return (
    <div className="space-y-4 rounded-2xl border border-tl-gold/20 bg-tl-black/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-gold/85">
            Filtros
          </p>
          <p className="mt-1 font-outfit text-sm font-light text-tl-beige/55">
            {resultCount} de {totalCount} propiedades
          </p>
        </div>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_PROPERTY_DASHBOARD_FILTERS)}
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
          placeholder="Buscar por título, ID EasyBroker (EB-UW4836), ciudad..."
          className="w-full rounded-xl border border-tl-gold/20 bg-tl-black/60 py-2.5 pl-10 pr-4 font-outfit font-light text-sm text-tl-beige outline-none transition-colors placeholder:text-tl-beige/35 focus:border-tl-gold/45"
          aria-label="Buscar propiedades"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-1.5">
          <span className="font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/45">
            Operación
          </span>
          <select
            value={filters.operationType}
            onChange={(event) =>
              onChange({
                ...filters,
                operationType: event.target.value as OperationType | "all",
              })
            }
            className={selectClassName}
          >
            <option value="all">Todas</option>
            {OPERATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/45">
            Tipo
          </span>
          <select
            value={filters.propertyType}
            onChange={(event) =>
              onChange({
                ...filters,
                propertyType: event.target.value as PropertyType | "all",
              })
            }
            className={selectClassName}
          >
            <option value="all">Todos</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/45">
            Zona
          </span>
          <select
            value={filters.zone}
            onChange={(event) =>
              onChange({ ...filters, zone: event.target.value })
            }
            className={selectClassName}
          >
            <option value="all">Todas</option>
            {zoneOptions.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/45">
            Origen
          </span>
          <select
            value={filters.source}
            onChange={(event) =>
              onChange({
                ...filters,
                source: event.target.value as PropertySourceFilter,
              })
            }
            className={selectClassName}
          >
            <option value="all">Todas</option>
            <option value="easybroker">EasyBroker</option>
            <option value="manual">Manuales</option>
          </select>
        </label>
      </div>
    </div>
  );
}
