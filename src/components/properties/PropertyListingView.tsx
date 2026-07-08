"use client";

import type { PropertyCatalogConfig } from "@/components/properties/catalog-config";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import {
  applyCatalogFilters,
  type BedroomFilter,
  type PropertySortOption,
} from "@/lib/property-catalog";
import type { Property } from "@/types/property";
import { ArrowUpDown, BedDouble } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface PropertyListingViewProps {
  properties: Property[];
  config: PropertyCatalogConfig;
}

const SORT_OPTIONS: { value: PropertySortOption; label: string }[] = [
  { value: "newest", label: "Más recientes" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
];

const BEDROOM_OPTIONS: { value: BedroomFilter; label: string }[] = [
  { value: "all", label: "Todas las recámaras" },
  { value: "1", label: "1+ recámaras" },
  { value: "2", label: "2+ recámaras" },
  { value: "3", label: "3+ recámaras" },
  { value: "4", label: "4+ recámaras" },
];

const selectClassName =
  "rounded-full border border-white/10 bg-tl-black/60 px-4 py-2.5 font-outfit font-light text-xs uppercase tracking-[0.12em] text-tl-beige/85 outline-none transition-colors focus:border-tl-gold/50";

export function PropertyListingView({
  properties,
  config,
}: PropertyListingViewProps) {
  const [sort, setSort] = useState<PropertySortOption>("newest");
  const [bedrooms, setBedrooms] = useState<BedroomFilter>("all");

  const filteredProperties = useMemo(
    () => applyCatalogFilters(properties, sort, bedrooms),
    [properties, sort, bedrooms],
  );

  return (
    <main className="flex flex-1 flex-col bg-tl-black">
      <section className="relative min-h-[min(78vh,720px)] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${config.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-tl-black/55 via-tl-black/45 to-tl-black/85" />
        <div className="absolute inset-0 bg-tl-black/25" />

        <div className={`relative z-10 mx-auto flex min-h-[min(78vh,720px)] max-w-6xl items-end px-4 pb-16 sm:px-6 sm:pb-20 ${HERO_CONTENT_OFFSET}`}>
          <div className="max-w-3xl">
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.32em] text-tl-gold/90 sm:text-xs">
              Total Living
            </p>
            <h1 className="mt-3 font-outfit text-4xl font-extralight tracking-[0.02em] text-tl-beige sm:text-5xl lg:text-6xl">
              {config.title}
            </h1>
            <p className="mt-4 max-w-2xl font-outfit text-sm font-light leading-relaxed tracking-[0.02em] text-tl-beige/75 sm:text-base">
              {config.subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="sticky top-[4.5rem] z-30 border-b border-white/10 bg-tl-black/75 backdrop-blur-lg sm:top-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-tl-beige/50">
            <ArrowUpDown className="h-4 w-4 text-tl-gold/80" />
            <span className="font-outfit font-light text-[10px] uppercase tracking-[0.16em]">
              Ordenar
            </span>
          </div>
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as PropertySortOption)
            }
            className={selectClassName}
            aria-label="Ordenar propiedades"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="hidden h-6 w-px bg-white/10 sm:block" />

          <div className="flex items-center gap-2 text-tl-beige/50">
            <BedDouble className="h-4 w-4 text-tl-gold/80" />
            <span className="font-outfit font-light text-[10px] uppercase tracking-[0.16em]">
              Recámaras
            </span>
          </div>
          <select
            value={bedrooms}
            onChange={(event) =>
              setBedrooms(event.target.value as BedroomFilter)
            }
            className={selectClassName}
            aria-label="Filtrar por recámaras"
          >
            {BEDROOM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <p className="ml-auto font-outfit font-light text-xs text-tl-beige/55">
            {filteredProperties.length} resultado
            {filteredProperties.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {filteredProperties.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {filteredProperties.map((property, index) => (
              <Reveal key={property.id} delay={index * 0.05}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="rounded-2xl border border-tl-gold/20 bg-tl-black/50 px-6 py-16 text-center">
            <p className="font-outfit font-light text-sm text-tl-beige/70">
              No hay propiedades que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-tl-gold/25 bg-gradient-to-b from-tl-black to-tl-olive/20 px-6 py-20 text-center sm:px-10">
            <p className="mx-auto max-w-2xl font-outfit font-light text-sm leading-relaxed text-tl-beige/75 sm:text-base">
              {config.emptyMessage}
            </p>
            <Link
              href={config.contactHref}
              className="mt-8 inline-flex rounded-full border border-tl-gold px-6 py-3 font-outfit font-light text-xs uppercase tracking-[0.16em] text-tl-gold transition-colors hover:bg-tl-gold hover:text-tl-black"
            >
              Contactar asesor
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
