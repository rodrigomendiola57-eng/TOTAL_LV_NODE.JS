"use client";

import { getAmenityIcon, AMENITY_CATEGORY_ORDER } from "@/lib/data/amenity-icons";
import { cn } from "@/lib/utils";
import type { Amenity, AmenityCategory } from "@/types/property";
import { Check, Loader2, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

interface AmenitiesSelectorProps {
  amenities: Amenity[];
  selected: number[];
  onChange: (ids: number[]) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function AmenitiesSelector({
  amenities,
  selected,
  onChange,
  isLoading = false,
  error = null,
}: AmenitiesSelectorProps) {
  const [query, setQuery] = useState("");

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const grouped = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const map = new Map<AmenityCategory, Amenity[]>();

    for (const amenity of amenities) {
      if (
        normalizedQuery &&
        !amenity.name.toLowerCase().includes(normalizedQuery)
      ) {
        continue;
      }
      const list = map.get(amenity.category) ?? [];
      list.push(amenity);
      map.set(amenity.category, list);
    }

    return AMENITY_CATEGORY_ORDER.filter((category) => map.has(category)).map(
      (category) => ({ category, items: map.get(category) ?? [] }),
    );
  }, [amenities, query]);

  function toggle(id: number) {
    if (selectedSet.has(id)) {
      onChange(selected.filter((value) => value !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] font-outfit text-sm font-light text-tl-beige/45">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Cargando amenidades...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-950/25 px-4 py-3 font-outfit text-sm font-light text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tl-beige/35" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar amenidad..."
            className="w-full rounded-xl border border-tl-gold/20 bg-[#0a0a0a] py-2.5 pl-10 pr-4 font-outfit text-sm font-light text-tl-beige outline-none transition-all placeholder:text-tl-beige/30 focus:border-tl-gold/55 focus:shadow-[0_0_0_3px_rgba(214,181,133,0.12)]"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-gold">
            {selected.length} seleccionadas
          </span>
          {selected.length > 0 ? (
            <button
              type="button"
              onClick={() => onChange([])}
              className="inline-flex items-center gap-1 rounded-full border border-tl-gold/25 px-3 py-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/60 transition-colors hover:border-tl-gold hover:text-tl-gold"
            >
              <X className="h-3 w-3" />
              Limpiar
            </button>
          ) : null}
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-6 text-center font-outfit text-sm font-light text-tl-beige/45">
          Sin amenidades que coincidan con la búsqueda.
        </p>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ category, items }) => (
            <div key={category}>
              <p className="mb-3 font-outfit text-[11px] font-light uppercase tracking-[0.18em] text-tl-beige/45">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((amenity) => {
                  const Icon = getAmenityIcon(amenity.icon);
                  const active = selectedSet.has(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggle(amenity.id)}
                      aria-pressed={active}
                      className={cn(
                        "group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-outfit text-xs font-light transition-all",
                        active
                          ? "border-tl-gold/70 bg-tl-gold/15 text-tl-gold shadow-[0_0_0_1px_rgba(214,181,133,0.25)]"
                          : "border-white/10 bg-white/[0.02] text-tl-beige/70 hover:border-tl-gold/40 hover:text-tl-beige",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
                          active
                            ? "bg-tl-gold/20 text-tl-gold"
                            : "text-tl-beige/45 group-hover:text-tl-gold/70",
                        )}
                      >
                        {active ? (
                          <Check className="h-3 w-3" strokeWidth={2} />
                        ) : (
                          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                        )}
                      </span>
                      {amenity.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
