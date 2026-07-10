"use client";

import {
  buildCatalogHref,
  DEFAULT_CATALOG_STATE,
  getCatalogPathForOperation,
  type CatalogQueryState,
  type StateFilter,
} from "@/lib/property-catalog-params";
import type { BedroomFilter } from "@/lib/property-catalog";
import { MEXICO_STATES } from "@/lib/data/mexico-locations";
import { PROPERTY_TYPES } from "@/lib/data/property-options";
import type { PropertyType } from "@/types/property";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";

const BEDROOM_OPTIONS: { value: BedroomFilter; label: string }[] = [
  { value: "all", label: "Recámaras" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

const HERO_PROPERTY_TYPES = PROPERTY_TYPES.filter((type) =>
  ["Casa", "Departamento", "Terreno", "Condominio", "Penthouse"].includes(type),
);

const PRICE_RANGES = [
  { id: "any", label: "Precio", min: "", max: "" },
  { id: "0-1500000", label: "Hasta $1,500,000", min: "", max: "1500000" },
  {
    id: "1500000-3000000",
    label: "$1,500,000 – $3,000,000",
    min: "1500000",
    max: "3000000",
  },
  {
    id: "3000000-5000000",
    label: "$3,000,000 – $5,000,000",
    min: "3000000",
    max: "5000000",
  },
  {
    id: "5000000-8000000",
    label: "$5,000,000 – $8,000,000",
    min: "5000000",
    max: "8000000",
  },
  {
    id: "8000000-12000000",
    label: "$8,000,000 – $12,000,000",
    min: "8000000",
    max: "12000000",
  },
  {
    id: "12000000-20000000",
    label: "$12,000,000 – $20,000,000",
    min: "12000000",
    max: "20000000",
  },
  { id: "20000000+", label: "Más de $20,000,000", min: "20000000", max: "" },
] as const;

function HeroSelect({
  value,
  onChange,
  ariaLabel,
  shortLabel,
  isActive = false,
  children,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  shortLabel: string;
  isActive?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "group relative block w-full transition-[transform,box-shadow] duration-200 sm:hover:-translate-y-px",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none flex h-9 w-full items-center justify-between rounded-full border px-4 font-outfit text-[10px] font-extralight uppercase tracking-[0.16em] backdrop-blur-[6px] transition-colors sm:hidden",
          isActive
            ? "border-tl-gold/35 bg-tl-gold/[0.08] text-tl-gold"
            : "border-white/[0.1] bg-white/[0.03] text-tl-beige/80",
        )}
      >
        <span className="flex items-center gap-1.5">
          {shortLabel}
          {isActive ? (
            <span className="h-1 w-1 shrink-0 rounded-full bg-tl-gold" />
          ) : null}
        </span>
        <ChevronDown className="h-2.5 w-2.5 shrink-0 opacity-45" strokeWidth={1.5} />
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="absolute inset-0 z-[1] h-full w-full cursor-pointer opacity-0 [color-scheme:dark] sm:static sm:z-auto sm:h-11 sm:cursor-pointer sm:appearance-none sm:rounded-xl sm:border sm:border-white/12 sm:bg-[#121210]/80 sm:py-2.5 sm:pl-3.5 sm:pr-10 sm:font-outfit sm:text-sm sm:font-extralight sm:tracking-[0.01em] sm:text-tl-beige sm:opacity-100 sm:outline-none sm:transition-[border-color,background-color,box-shadow] sm:group-hover:border-white/22 sm:group-focus-within:border-tl-gold/50 sm:group-focus-within:bg-[#161614]/90 sm:group-focus-within:shadow-[0_0_0_1px_rgba(214,181,133,0.18)]"
      >
        {children}
      </select>

      <span className="pointer-events-none absolute right-2 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md border border-white/8 bg-white/[0.04] text-tl-beige/50 transition-colors group-focus-within:border-tl-gold/30 group-focus-within:text-tl-gold/80 sm:flex">
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
      </span>
    </label>
  );
}

export function HeroPropertySearch() {
  const router = useRouter();
  const [state, setState] = useState<StateFilter>("all");
  const [propertyType, setPropertyType] = useState<PropertyType | "all">("all");
  const [bedrooms, setBedrooms] = useState<BedroomFilter>("all");
  const [priceRange, setPriceRange] = useState<(typeof PRICE_RANGES)[number]["id"]>("any");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedRange =
      PRICE_RANGES.find((range) => range.id === priceRange) ?? PRICE_RANGES[0];

    const catalogState: CatalogQueryState = {
      ...DEFAULT_CATALOG_STATE,
      state,
      propertyType,
      bedrooms,
      priceMin: selectedRange.min,
      priceMax: selectedRange.max,
    };

    router.push(buildCatalogHref(getCatalogPathForOperation("Venta"), catalogState));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-5 w-full max-w-[15.5rem] sm:mt-8 sm:max-w-4xl"
    >
      <div className="relative sm:overflow-hidden sm:rounded-2xl sm:border sm:border-white/10 sm:bg-black/45 sm:p-3.5 sm:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.8)] sm:backdrop-blur-md">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 hidden h-px bg-gradient-to-r from-transparent via-tl-gold/40 to-transparent sm:block"
        />

        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1.15fr_1.35fr_1fr_0.85fr_auto] sm:gap-2">
          <HeroSelect
            value={state}
            onChange={(value) => setState(value as StateFilter)}
            ariaLabel="Estado"
            shortLabel="Estado"
            isActive={state !== "all"}
          >
            <option value="all">Estado</option>
            {MEXICO_STATES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </HeroSelect>

          <HeroSelect
            value={priceRange}
            onChange={(value) =>
              setPriceRange(value as (typeof PRICE_RANGES)[number]["id"])
            }
            ariaLabel="Rango de precio"
            shortLabel="Precio"
            isActive={priceRange !== "any"}
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </HeroSelect>

          <HeroSelect
            value={propertyType}
            onChange={(value) =>
              setPropertyType(value as PropertyType | "all")
            }
            ariaLabel="Tipo de propiedad"
            shortLabel="Tipo"
            isActive={propertyType !== "all"}
          >
            <option value="all">Tipo</option>
            {HERO_PROPERTY_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </HeroSelect>

          <HeroSelect
            value={bedrooms}
            onChange={(value) => setBedrooms(value as BedroomFilter)}
            ariaLabel="Recámaras"
            shortLabel="Recámaras"
            isActive={bedrooms !== "all"}
          >
            {BEDROOM_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </HeroSelect>

          <button
            type="submit"
            aria-label="Enviar búsqueda de propiedades"
            className="inline-flex h-10 w-full items-center justify-center rounded-full bg-tl-gold px-5 font-outfit text-[11px] font-extralight uppercase tracking-[0.18em] text-tl-black transition-[transform,filter] active:scale-[0.98] sm:h-11 sm:w-auto sm:rounded-xl sm:px-4 sm:tracking-[0.02em] sm:hover:brightness-105"
          >
            <span>Enviar</span>
            <ArrowRight className="ml-1.5 hidden h-4 w-4 sm:inline" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </form>
  );
}
