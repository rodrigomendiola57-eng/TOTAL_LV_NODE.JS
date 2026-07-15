"use client";

import type { CatalogViewMode } from "@/lib/property-catalog";
import {
  buildCatalogHref,
  type CatalogQueryState,
  type StateFilter,
} from "@/lib/property-catalog-params";
import type { BedroomFilter, PropertySortOption } from "@/lib/property-catalog";
import { MEXICO_STATES } from "@/lib/data/mexico-locations";
import { PROPERTY_TYPES, QUERETARO_ZONES } from "@/lib/data/property-options";
import type { PropertyType, QueretaroZone } from "@/types/property";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  BedDouble,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  Map,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

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
  { value: "all", label: "Todas" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

const ZONE_OPTIONS = QUERETARO_ZONES.filter(
  (z) => z !== "Otra / Sin clasificar",
).map((zone) => ({
  value: zone,
  label: zone.replace(/^Zona /, ""),
}));

const labelClass =
  "mb-2 block font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-gold/80 sm:mb-2.5";

const fieldShell =
  "w-full min-h-12 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 font-outfit text-base font-light text-tl-beige/90 outline-none transition-colors placeholder:text-tl-beige/30 focus:border-tl-gold/45 focus:bg-white/[0.06] sm:min-h-11 sm:py-2.5 sm:text-sm";

type SelectOption = { value: string; label: string };

function useIsMobile(breakpointPx = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [breakpointPx]);

  return isMobile;
}

function hasActiveFilters(state: CatalogQueryState): boolean {
  return (
    state.search !== "" ||
    state.zone !== "all" ||
    state.state !== "all" ||
    state.propertyType !== "all" ||
    state.bedrooms !== "all" ||
    state.sort !== "newest" ||
    state.priceMin !== "" ||
    state.priceMax !== ""
  );
}

function activeFilterCount(state: CatalogQueryState): number {
  let n = 0;
  if (state.search) n += 1;
  if (state.zone !== "all") n += 1;
  if (state.state !== "all") n += 1;
  if (state.propertyType !== "all") n += 1;
  if (state.bedrooms !== "all") n += 1;
  if (state.sort !== "newest") n += 1;
  if (state.priceMin || state.priceMax) n += 1;
  return n;
}

function SelectOptionsList({
  options,
  value,
  onSelect,
  dense = false,
}: {
  options: SelectOption[];
  value: string;
  onSelect: (value: string) => void;
  dense?: boolean;
}) {
  return (
    <ul className={cn("overscroll-contain py-1.5", dense ? "max-h-56 overflow-y-auto" : "")}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <li key={opt.value}>
            <button
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onSelect(opt.value)}
              className={cn(
                "flex w-full items-center justify-between gap-3 text-left font-outfit font-light transition-colors",
                dense
                  ? "px-3.5 py-2.5 text-sm"
                  : "min-h-12 px-4 py-3.5 text-[15px]",
                active
                  ? "bg-tl-gold/12 text-tl-gold"
                  : "text-tl-beige/80 active:bg-white/[0.05] hover:bg-white/[0.04] hover:text-tl-beige",
              )}
            >
              <span className="min-w-0 flex-1 break-words pr-2">{opt.label}</span>
              {active ? (
                <Check className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function CatalogSelect({
  label,
  value,
  options,
  placeholder,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  icon?: typeof LayoutGrid;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const isMobile = useIsMobile();

  const selected = options.find((opt) => opt.value === value);
  const display = selected?.label ?? placeholder;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || isMobile) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, isMobile]);

  useEffect(() => {
    if (!open || !isMobile) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, isMobile]);

  function pick(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <span className={labelClass}>
        <span className="inline-flex items-center gap-1.5">
          {Icon ? <Icon className="h-3 w-3" strokeWidth={1.5} /> : null}
          {label}
        </span>
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full min-h-12 items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors sm:min-h-11 sm:py-2.5",
          open
            ? "border-tl-gold/45 bg-white/[0.06]"
            : "border-white/10 bg-white/[0.04] hover:border-white/20",
        )}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-outfit text-[15px] font-light sm:text-sm",
            selected ? "text-tl-beige" : "text-tl-beige/40",
          )}
        >
          {display}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-tl-gold/70 transition-transform duration-200",
            open && "rotate-180",
          )}
          strokeWidth={1.5}
        />
      </button>

      {/* Desktop: menú anclado */}
      {!isMobile ? (
        <AnimatePresence>
          {open ? (
            <motion.div
              id={listId}
              role="listbox"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-30 overflow-hidden rounded-xl border border-tl-gold/25 bg-[#141412] shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
            >
              <div
                aria-hidden
                className="h-px bg-gradient-to-r from-transparent via-tl-gold/40 to-transparent"
              />
              <SelectOptionsList
                options={options}
                value={value}
                onSelect={pick}
                dense
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : null}

      {/* Móvil: sheet propio (no se corta con el scroll del modal) */}
      {mounted && isMobile
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <div className="fixed inset-0 z-[230] flex flex-col justify-end">
                  <motion.button
                    type="button"
                    aria-label={`Cerrar ${label}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setOpen(false)}
                    className="absolute inset-0 bg-black/70"
                  />
                  <motion.div
                    id={listId}
                    role="listbox"
                    aria-label={label}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 340 }}
                    className="relative z-10 flex max-h-[min(78dvh,34rem)] flex-col rounded-t-[1.35rem] border border-b-0 border-tl-gold/30 bg-[#141412] shadow-[0_-16px_60px_rgba(0,0,0,0.55)]"
                  >
                    <div className="flex justify-center pb-1 pt-3">
                      <span className="h-1 w-10 rounded-full bg-white/20" />
                    </div>
                    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 pb-3.5 pt-1">
                      <div className="min-w-0">
                        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-gold/80">
                          Elegir
                        </p>
                        <p className="mt-0.5 truncate font-outfit text-lg font-extralight text-tl-beige">
                          {label}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 text-tl-beige/55"
                        aria-label="Cerrar lista"
                      >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                      <SelectOptionsList
                        options={options}
                        value={value}
                        onSelect={pick}
                      />
                    </div>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}

function ViewToggle({
  activeView,
  onViewChange,
  listHref,
  mapHref,
}: {
  activeView: CatalogViewMode;
  onViewChange?: (vista: CatalogViewMode) => void;
  listHref: string;
  mapHref: string;
}) {
  const itemClass = (active: boolean) =>
    cn(
      "inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full px-4 font-outfit text-xs font-light uppercase tracking-[0.14em] transition-all duration-300 sm:flex-none sm:min-w-[6.5rem]",
      active
        ? "bg-tl-gold text-tl-black shadow-[0_0_20px_rgba(214,181,133,0.25)]"
        : "text-white/80 hover:text-white",
    );

  const content = (label: string, Icon: typeof List) => (
    <>
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
      <span>{label}</span>
    </>
  );

  return (
    <div
      role="group"
      aria-label="Vista del catálogo"
      className="inline-flex w-full rounded-full border border-white/10 bg-white/[0.02] p-1 sm:w-auto"
    >
      {onViewChange ? (
        <>
          <button
            type="button"
            onClick={() => onViewChange("lista")}
            className={itemClass(activeView === "lista")}
            aria-pressed={activeView === "lista"}
          >
            {content("Lista", List)}
          </button>
          <button
            type="button"
            onClick={() => onViewChange("mapa")}
            className={itemClass(activeView === "mapa")}
            aria-pressed={activeView === "mapa"}
          >
            {content("Mapa", Map)}
          </button>
        </>
      ) : (
        <>
          <Link
            href={listHref}
            className={itemClass(activeView === "lista")}
            aria-current={activeView === "lista" ? "page" : undefined}
          >
            {content("Lista", List)}
          </Link>
          <Link
            href={mapHref}
            className={itemClass(activeView === "mapa")}
            aria-current={activeView === "mapa" ? "page" : undefined}
          >
            {content("Mapa", Map)}
          </Link>
        </>
      )}
    </div>
  );
}

type FilterDraft = Pick<
  CatalogQueryState,
  "zone" | "state" | "propertyType" | "bedrooms" | "sort" | "priceMin" | "priceMax"
>;

function draftFromCatalog(state: CatalogQueryState): FilterDraft {
  return {
    zone: state.zone,
    state: state.state,
    propertyType: state.propertyType,
    bedrooms: state.bedrooms,
    sort: state.sort,
    priceMin: state.priceMin,
    priceMax: state.priceMax,
  };
}

function FiltersModal({
  open,
  onClose,
  panelId,
  draft,
  setDraft,
  onApply,
  onClearDraft,
  count,
  operationLabel,
}: {
  open: boolean;
  onClose: () => void;
  panelId: string;
  draft: FilterDraft;
  setDraft: (patch: Partial<FilterDraft>) => void;
  onApply: () => void;
  onClearDraft: () => void;
  count: number;
  operationLabel: string;
}) {
  const [mounted, setMounted] = useState(false);
  const draftActive =
    draft.zone !== "all" ||
    draft.state !== "all" ||
    draft.propertyType !== "all" ||
    draft.bedrooms !== "all" ||
    draft.sort !== "newest" ||
    draft.priceMin !== "" ||
    draft.priceMax !== "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  const typeOptions: SelectOption[] = [
    { value: "all", label: "Todos" },
    ...PROPERTY_TYPES.map((type) => ({ value: type, label: type })),
  ];

  const stateOptions: SelectOption[] = [
    { value: "all", label: "Todos los estados" },
    ...MEXICO_STATES.map((state) => ({ value: state, label: state })),
  ];

  const zoneOptions: SelectOption[] = [
    { value: "all", label: "Todas las zonas" },
    ...ZONE_OPTIONS,
  ];

  const sortOptions: SelectOption[] = SORT_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Cerrar filtros"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-[6px]"
          />

          <motion.div
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${panelId}-title`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="relative z-10 flex h-[min(94dvh,100%)] w-full max-w-xl flex-col overflow-hidden rounded-t-[1.5rem] border border-b-0 border-tl-gold/30 bg-[linear-gradient(165deg,rgba(32,32,30,0.98)_0%,rgba(16,16,14,0.99)_55%,rgba(10,10,9,1)_100%)] shadow-[0_32px_100px_rgba(0,0,0,0.65),0_0_0_1px_rgba(214,181,133,0.08)] sm:h-auto sm:max-h-[min(90vh,42rem)] sm:rounded-[1.5rem] sm:border"
          >
            <div className="flex justify-center pb-0.5 pt-3 sm:hidden">
              <span className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            <div
              aria-hidden
              className="hidden h-px shrink-0 bg-gradient-to-r from-transparent via-tl-gold/55 to-transparent sm:block"
            />

            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.06] px-4 pb-4 pt-2 sm:gap-4 sm:px-7 sm:py-6">
              <div className="min-w-0 pr-2">
                <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/85">
                  Catálogo
                </p>
                <h2
                  id={`${panelId}-title`}
                  className="mt-1 font-outfit text-[1.65rem] font-extralight tracking-[0.02em] text-tl-beige sm:text-[1.75rem]"
                >
                  Filtros
                </h2>
                <p className="mt-1.5 font-outfit text-[13px] font-extralight leading-snug text-tl-beige/50 sm:text-sm">
                  Ajusta y pulsa{" "}
                  <span className="text-tl-gold/90">Ver resultados</span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 text-tl-beige/55 transition-colors hover:border-white/25 hover:text-tl-beige sm:h-10 sm:w-10"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain px-4 py-5 sm:space-y-6 sm:px-7 sm:py-6">
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
                <CatalogSelect
                  label="Tipo de propiedad"
                  icon={LayoutGrid}
                  value={draft.propertyType}
                  placeholder="Todos"
                  options={typeOptions}
                  onChange={(value) =>
                    setDraft({
                      propertyType: value as PropertyType | "all",
                    })
                  }
                />

                <CatalogSelect
                  label="Estado"
                  icon={MapPin}
                  value={draft.state}
                  placeholder="Todos los estados"
                  options={stateOptions}
                  onChange={(value) =>
                    setDraft({ state: value as StateFilter })
                  }
                />
              </div>

              <CatalogSelect
                label="Zona"
                value={draft.zone}
                placeholder="Todas las zonas"
                options={zoneOptions}
                onChange={(value) =>
                  setDraft({ zone: value as QueretaroZone | "all" })
                }
              />

              <div>
                <span className={cn(labelClass, "mb-3")}>
                  <span className="inline-flex items-center gap-1.5">
                    <BedDouble className="h-3 w-3" strokeWidth={1.5} />
                    Recámaras
                  </span>
                </span>
                <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
                  {BEDROOM_OPTIONS.map((option) => {
                    const active = draft.bedrooms === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDraft({ bedrooms: option.value })}
                        className={cn(
                          "min-h-11 rounded-full border px-2 font-outfit text-[11px] font-light tracking-[0.04em] transition-colors sm:min-h-10 sm:px-4 sm:tracking-[0.06em]",
                          active
                            ? "border-tl-gold/55 bg-tl-gold/15 text-tl-gold"
                            : "border-white/10 text-tl-beige/55 hover:border-white/25 hover:text-tl-beige",
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className={labelClass}>Rango de precio (MXN)</span>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={draft.priceMin}
                    placeholder="Mínimo"
                    onChange={(event) =>
                      setDraft({ priceMin: event.target.value })
                    }
                    className={fieldShell}
                    aria-label="Precio mínimo"
                  />
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={draft.priceMax}
                    placeholder="Máximo"
                    onChange={(event) =>
                      setDraft({ priceMax: event.target.value })
                    }
                    className={fieldShell}
                    aria-label="Precio máximo"
                  />
                </div>
              </div>

              <CatalogSelect
                label="Ordenar por"
                value={draft.sort}
                placeholder="Más recientes"
                options={sortOptions}
                onChange={(value) =>
                  setDraft({ sort: value as PropertySortOption })
                }
              />

              <p className="pb-1 font-outfit text-[12px] font-extralight leading-relaxed text-tl-beige/40 sm:text-xs">
                Ahora hay{" "}
                <span className="text-tl-gold/80">{count}</span> {operationLabel}{" "}
                con los filtros actuales del catálogo.
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.06] bg-black/30 px-4 py-3.5 pb-[max(0.9rem,env(safe-area-inset-bottom))] sm:px-7 sm:py-4 sm:pb-4">
              {draftActive ? (
                <button
                  type="button"
                  onClick={onClearDraft}
                  className="inline-flex min-h-11 items-center gap-1.5 px-1 font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-beige/50 transition-colors hover:text-tl-gold"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Limpiar
                </button>
              ) : (
                <span className="font-outfit text-[11px] font-extralight text-tl-beige/35">
                  Sin filtros
                </span>
              )}
              <button
                type="button"
                onClick={onApply}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-tl-gold px-5 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-black transition-opacity hover:opacity-90 sm:min-h-11 sm:max-w-[14rem] sm:flex-none sm:px-6"
              >
                Ver resultados
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
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
  const panelId = useId();
  const [searchDraft, setSearchDraft] = useState(catalogState.search);
  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraftState] = useState<FilterDraft>(() =>
    draftFromCatalog(catalogState),
  );

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
  }, [catalogState.search]);

  useEffect(() => {
    if (!panelOpen) {
      setDraftState(draftFromCatalog(catalogState));
    }
  }, [catalogState, panelOpen]);

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

  function openPanel() {
    setDraftState(draftFromCatalog(catalogState));
    setPanelOpen(true);
  }

  function patchDraft(patch: Partial<FilterDraft>) {
    setDraftState((current) => ({ ...current, ...patch }));
  }

  function applyFilters() {
    navigate({
      ...catalogState,
      ...draft,
      priceMin: draft.priceMin.trim(),
      priceMax: draft.priceMax.trim(),
      page: 1,
    });
    setPanelOpen(false);
  }

  function clearDraft() {
    setDraftState({
      zone: "all",
      state: "all",
      propertyType: "all",
      bedrooms: "all",
      sort: "newest",
      priceMin: "",
      priceMax: "",
    });
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

  const activeView = viewMode ?? catalogState.vista;
  const filtersOn = hasActiveFilters(catalogState);
  const filterCount = activeFilterCount(catalogState);

  const filtersButton = (
    <button
      type="button"
      onClick={openPanel}
      aria-haspopup="dialog"
      aria-expanded={panelOpen}
      aria-controls={panelId}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-5 font-outfit text-xs font-light uppercase tracking-[0.14em] transition-all duration-300",
        filtersOn || panelOpen
          ? "border-tl-gold/45 bg-tl-gold/10 text-tl-gold"
          : "border-white/10 bg-transparent text-white/95 hover:border-white/25 hover:text-white",
      )}
    >
      <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
      Filtros
      {filterCount > 0 ? (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-tl-gold px-1.5 font-outfit text-[10px] font-medium text-tl-black">
          {filterCount}
        </span>
      ) : null}
    </button>
  );

  return (
    <>
      <div className="border-b border-white/5 bg-transparent">
        <div className="mx-auto max-w-6xl px-3 py-3.5 sm:px-6 sm:py-5">
          <div className="hidden items-center gap-4 lg:flex">
            <ViewToggle
              activeView={activeView}
              onViewChange={onViewChange}
              listHref={listHref}
              mapHref={mapHref}
            />

            <p className="font-outfit text-base font-light tracking-[0.04em] text-white">
              <span className="font-medium text-white">{count}</span> {operationLabel}
            </p>

            <div className="ml-auto flex items-center gap-2.5">
              <div className="relative w-[min(18rem,28vw)]">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/60"
                  strokeWidth={1.5}
                />
                <input
                  type="search"
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                  placeholder="Buscar…"
                  className="w-full min-h-10 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-9 pr-4 font-outfit text-sm font-light text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/25"
                  aria-label="Buscar propiedades"
                />
              </div>
              {filtersButton}
            </div>
          </div>

          <div className="space-y-3.5 lg:hidden">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
              <ViewToggle
                activeView={activeView}
                onViewChange={onViewChange}
                listHref={listHref}
                mapHref={mapHref}
              />
              <p className="px-0.5 font-outfit text-sm font-light text-white sm:ml-auto sm:px-0">
                <span className="font-medium text-white">{count}</span> {operationLabel}
              </p>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                type="search"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder={
                  activeView === "mapa"
                    ? "Buscar en el mapa..."
                    : "Buscar por título, zona o dirección..."
                }
                className="w-full min-h-12 rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 font-outfit text-base font-light text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/25 sm:min-h-11 sm:py-2.5 sm:text-sm"
                aria-label="Buscar propiedades"
              />
            </div>

            <button
              type="button"
              onClick={openPanel}
              className={cn(
                "inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-full border px-5 font-outfit text-xs font-light uppercase tracking-[0.14em] transition-colors sm:w-auto sm:min-h-11 sm:justify-start",
                filtersOn || panelOpen
                  ? "border-tl-gold/40 bg-tl-gold/10 text-tl-gold"
                  : "border-white/10 text-white/95 hover:text-white",
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {filterCount > 0 ? (
                <span className="rounded-full bg-tl-gold px-1.5 py-0.5 text-[9px] text-tl-black">
                  {filterCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>

      <FiltersModal
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        panelId={panelId}
        draft={draft}
        setDraft={patchDraft}
        onApply={applyFilters}
        onClearDraft={clearDraft}
        count={count}
        operationLabel={operationLabel}
      />
    </>
  );
}
