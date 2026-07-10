"use client";

import type { CatalogViewMode } from "@/lib/property-catalog";
import {
  buildCatalogHref,
  type CatalogQueryState,
} from "@/lib/property-catalog-params";
import type { BedroomFilter, PropertySortOption } from "@/lib/property-catalog";
import { PROPERTY_TYPES, QUERETARO_ZONES } from "@/lib/data/property-options";
import type { PropertyType, QueretaroZone } from "@/types/property";
import { cn } from "@/lib/utils";
import {
  BedDouble,
  LayoutGrid,
  List,
  Map,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface PropertyCatalogFiltersProps {
  catalogState: CatalogQueryState;
  basePath: string;
  count: number;
  operationLabel?: string;
  viewMode?: CatalogViewMode;
  onViewChange?: (vista: CatalogViewMode) => void;
}

const SORT_OPTIONS: { value: PropertySortOption; label: string }[] = [
  { value: "newest", label: "Más recientes" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
];

const BEDROOM_OPTIONS: { value: BedroomFilter; label: string }[] = [
  { value: "all", label: "Cualquiera" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

const selectClassName =
  "w-full min-h-11 rounded-xl border border-white/10 bg-tl-black/60 px-3 py-2.5 font-outfit font-light text-base text-tl-beige/85 outline-none transition-colors focus:border-tl-gold/45 sm:text-xs";

const chipClassName =
  "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 font-outfit text-[10px] font-light uppercase tracking-[0.12em] transition-colors sm:min-h-0 sm:flex-none sm:px-3.5 sm:py-2 sm:tracking-[0.14em]";

function hasActiveFilters(state: CatalogQueryState): boolean {
  return (
    state.search !== "" ||
    state.zone !== "all" ||
    state.propertyType !== "all" ||
    state.bedrooms !== "all" ||
    state.sort !== "newest" ||
    state.priceMin !== "" ||
    state.priceMax !== ""
  );
}

export function PropertyCatalogFilters({
  catalogState,
  basePath,
  count,
  operationLabel = "propiedades",
  viewMode,
  onViewChange,
}: PropertyCatalogFiltersProps) {
  const router = useRouter();
  const [searchDraft, setSearchDraft] = useState(catalogState.search);
  const [priceMinDraft, setPriceMinDraft] = useState(catalogState.priceMin);
  const [priceMaxDraft, setPriceMaxDraft] = useState(catalogState.priceMax);
  const [expanded, setExpanded] = useState(hasActiveFilters(catalogState));

  const navigate = useCallback(
    (nextState: CatalogQueryState) => {
      router.push(buildCatalogHref(basePath, nextState), { scroll: false });
      document.getElementById("catalog-content")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [basePath, router],
  );

  useEffect(() => {
    setSearchDraft(catalogState.search);
    setPriceMinDraft(catalogState.priceMin);
    setPriceMaxDraft(catalogState.priceMax);
  }, [catalogState.search, catalogState.priceMin, catalogState.priceMax]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchDraft === catalogState.search) return;
      navigate({
        ...catalogState,
        search: searchDraft.trim(),
        page: 1,
      });
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [searchDraft, catalogState, navigate]);

  function buildLinkState(
    patch: Partial<CatalogQueryState>,
  ): CatalogQueryState {
    return {
      ...catalogState,
      ...patch,
      page: 1,
    };
  }

  const listHref = buildCatalogHref(basePath, {
    ...catalogState,
    vista: "lista",
    page: catalogState.vista === "lista" ? catalogState.page : 1,
  });

  const mapHref = buildCatalogHref(basePath, {
    ...catalogState,
    vista: "mapa",
    page: 1,
  });

  const clearHref = buildCatalogHref(basePath, {
    ...catalogState,
    search: "",
    zone: "all",
    propertyType: "all",
    bedrooms: "all",
    sort: "newest",
    priceMin: "",
    priceMax: "",
    page: 1,
  });

  const activeView = viewMode ?? catalogState.vista;
  const isMapView = activeView === "mapa";

  return (
    <div className="border-b border-white/10 bg-[#1a1a18]/90 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl space-y-3 px-3 py-3 sm:space-y-4 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <div className="flex w-full rounded-full border border-white/10 bg-tl-black/60 p-1 sm:inline-flex sm:w-auto">
            {onViewChange ? (
              <>
                <button
                  type="button"
                  onClick={() => onViewChange("lista")}
                  className={cn(
                    chipClassName,
                    activeView === "lista"
                      ? "bg-tl-gold text-tl-black"
                      : "text-tl-beige/65 active:text-tl-gold sm:hover:text-tl-gold",
                  )}
                  aria-current={activeView === "lista" ? "page" : undefined}
                >
                  <List className="h-4 w-4 shrink-0" />
                  <span>Lista</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewChange("mapa")}
                  className={cn(
                    chipClassName,
                    activeView === "mapa"
                      ? "bg-tl-gold text-tl-black"
                      : "text-tl-beige/65 active:text-tl-gold sm:hover:text-tl-gold",
                  )}
                  aria-current={activeView === "mapa" ? "page" : undefined}
                >
                  <Map className="h-4 w-4 shrink-0" />
                  <span>Mapa</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href={listHref}
                  className={cn(
                    chipClassName,
                    activeView === "lista"
                      ? "bg-tl-gold text-tl-black"
                      : "text-tl-beige/65 active:text-tl-gold sm:hover:text-tl-gold",
                  )}
                  aria-current={activeView === "lista" ? "page" : undefined}
                >
                  <List className="h-4 w-4 shrink-0" />
                  <span>Lista</span>
                </Link>
                <Link
                  href={mapHref}
                  className={cn(
                    chipClassName,
                    activeView === "mapa"
                      ? "bg-tl-gold text-tl-black"
                      : "text-tl-beige/65 active:text-tl-gold sm:hover:text-tl-gold",
                  )}
                  aria-current={activeView === "mapa" ? "page" : undefined}
                >
                  <Map className="h-4 w-4 shrink-0" />
                  <span>Mapa</span>
                </Link>
              </>
            )}
          </div>

          <p className="font-outfit text-xs font-light text-tl-beige/55 sm:ml-auto">
            <span className="text-tl-gold">{count}</span> {operationLabel}
          </p>
        </div>

        {!isMapView ? (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tl-gold/70" />
            <input
              type="search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Buscar por título, zona o dirección..."
              className="w-full min-h-11 rounded-xl border border-white/10 bg-tl-black/60 py-2.5 pl-10 pr-4 font-outfit font-light text-base text-tl-beige outline-none transition-colors placeholder:text-tl-beige/35 focus:border-tl-gold/45 sm:text-sm"
              aria-label="Buscar propiedades"
            />
          </div>
        ) : (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tl-gold/70" />
            <input
              type="search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Buscar en el mapa..."
              className="w-full min-h-11 rounded-xl border border-white/10 bg-tl-black/60 py-2.5 pl-10 pr-4 font-outfit font-light text-base text-tl-beige outline-none transition-colors placeholder:text-tl-beige/35 focus:border-tl-gold/45 sm:text-sm"
              aria-label="Buscar propiedades en el mapa"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/10 px-4 py-2.5 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/70 transition-colors active:border-tl-gold/35 active:text-tl-gold sm:min-h-0 sm:px-3 sm:py-2 sm:hover:border-tl-gold/35 sm:hover:text-tl-gold"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {expanded ? "Ocultar" : "Filtros"}
          </button>

          {hasActiveFilters(catalogState) ? (
            <Link
              href={clearHref}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/10 px-4 py-2.5 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/60 transition-colors active:border-tl-gold/35 active:text-tl-gold sm:min-h-0 sm:px-3 sm:py-2 sm:hover:border-tl-gold/35 sm:hover:text-tl-gold"
            >
              <RotateCcw className="h-4 w-4" />
              Limpiar
            </Link>
          ) : null}
        </div>

        {expanded ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/45">
                <LayoutGrid className="h-3.5 w-3.5 text-tl-gold/70" />
                Tipo
              </span>
              <select
                value={catalogState.propertyType}
                onChange={(event) => {
                  navigate(
                    buildLinkState({
                      propertyType: event.target.value as PropertyType | "all",
                    }),
                  );
                }}
                className={selectClassName}
                aria-label="Filtrar por tipo"
              >
                <option value="all">Todos los tipos</option>
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
                value={catalogState.zone}
                onChange={(event) => {
                  navigate(
                    buildLinkState({
                      zone: event.target.value as QueretaroZone | "all",
                    }),
                  );
                }}
                className={selectClassName}
                aria-label="Filtrar por zona"
              >
                <option value="all">Todas las zonas</option>
                {QUERETARO_ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone.replace("Zona ", "")}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/45">
                <BedDouble className="h-3.5 w-3.5 text-tl-gold/70" />
                Recámaras
              </span>
              <select
                value={catalogState.bedrooms}
                onChange={(event) => {
                  navigate(
                    buildLinkState({
                      bedrooms: event.target.value as BedroomFilter,
                    }),
                  );
                }}
                className={selectClassName}
                aria-label="Filtrar por recámaras"
              >
                {BEDROOM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/45">
                Ordenar
              </span>
              <select
                value={catalogState.sort}
                onChange={(event) => {
                  navigate(
                    buildLinkState({
                      sort: event.target.value as PropertySortOption,
                    }),
                  );
                }}
                className={selectClassName}
                aria-label="Ordenar propiedades"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 sm:col-span-2 lg:col-span-2">
              <span className="font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/45">
                Rango de precio (MXN)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={priceMinDraft}
                  placeholder="Mínimo"
                  onChange={(event) => setPriceMinDraft(event.target.value)}
                  onBlur={() => {
                    if (priceMinDraft === catalogState.priceMin) return;
                    navigate(buildLinkState({ priceMin: priceMinDraft.trim() }));
                  }}
                  className={selectClassName}
                  aria-label="Precio mínimo"
                />
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={priceMaxDraft}
                  placeholder="Máximo"
                  onChange={(event) => setPriceMaxDraft(event.target.value)}
                  onBlur={() => {
                    if (priceMaxDraft === catalogState.priceMax) return;
                    navigate(buildLinkState({ priceMax: priceMaxDraft.trim() }));
                  }}
                  className={selectClassName}
                  aria-label="Precio máximo"
                />
              </div>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}
