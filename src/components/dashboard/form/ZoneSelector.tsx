"use client";

import { QUERETARO_ZONES } from "@/lib/data/property-options";
import { cn } from "@/lib/utils";
import type { QueretaroZone } from "@/types/property";
import { MapPin } from "lucide-react";

interface ZoneSelectorProps {
  value: QueretaroZone;
  onChange: (value: QueretaroZone) => void;
}

export function ZoneSelector({ value, onChange }: ZoneSelectorProps) {
  return (
    <div className="sm:col-span-2 xl:col-span-3">
      <p className="mb-2 font-outfit font-light text-[11px] uppercase tracking-[0.14em] text-tl-beige/60">
        Zona de Querétaro *
      </p>
      <p className="mb-3 font-outfit font-light text-xs text-tl-beige/45">
        Elige la zona operativa — ayuda a clasificar y filtrar en el catálogo.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {QUERETARO_ZONES.map((zone) => {
          const isSelected = value === zone;
          const shortName = zone.replace("Zona ", "");
          return (
            <button
              key={zone}
              type="button"
              onClick={() => onChange(zone)}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                isSelected
                  ? "border-tl-gold bg-tl-gold/10"
                  : "border-tl-gold/15 bg-[#0a0a0a] hover:border-tl-gold/30",
              )}
            >
              <MapPin
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  isSelected ? "text-tl-gold" : "text-tl-beige/40",
                )}
                strokeWidth={1.5}
              />
              <span
                className={cn(
                  "font-outfit font-light text-xs leading-relaxed",
                  isSelected ? "text-tl-beige" : "text-tl-beige/65",
                )}
              >
                {shortName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
