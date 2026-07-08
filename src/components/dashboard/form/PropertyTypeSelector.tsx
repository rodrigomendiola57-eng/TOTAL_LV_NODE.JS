"use client";

import { PROPERTY_TYPE_OPTIONS } from "@/lib/data/property-form-ux";
import { cn } from "@/lib/utils";
import type { PropertyType } from "@/types/property";

interface PropertyTypeSelectorProps {
  value: PropertyType;
  onChange: (value: PropertyType) => void;
}

const GROUP_LABELS = {
  residencial: "Residencial",
  terreno: "Terreno",
  comercial: "Comercial",
  otro: "Otro",
} as const;

export function PropertyTypeSelector({ value, onChange }: PropertyTypeSelectorProps) {
  const groups = ["residencial", "terreno", "comercial", "otro"] as const;

  return (
    <div className="space-y-4 sm:col-span-2 xl:col-span-3">
      <div>
        <p className="font-outfit font-light text-[11px] uppercase tracking-[0.14em] text-tl-beige/60">
          Tipo de propiedad *
        </p>
        <p className="mt-1 font-outfit font-light text-xs text-tl-beige/45">
          Selecciona una categoría — el formulario adaptará los campos siguientes.
        </p>
      </div>

      {groups.map((group) => {
        const options = PROPERTY_TYPE_OPTIONS.filter((option) => option.group === group);
        if (options.length === 0) return null;

        return (
          <div key={group}>
            <p className="mb-2 font-outfit font-light text-[10px] uppercase tracking-[0.16em] text-tl-gold/70">
              {GROUP_LABELS[group]}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {options.map(({ value: optionValue, label, icon: Icon }) => {
                const isSelected = value === optionValue;
                return (
                  <button
                    key={optionValue}
                    type="button"
                    onClick={() => onChange(optionValue)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 transition-all",
                      isSelected
                        ? "border-tl-gold bg-tl-gold/10 shadow-[inset_0_0_0_1px_rgba(214,181,133,0.25)]"
                        : "border-tl-gold/15 bg-[#0a0a0a] hover:border-tl-gold/35 hover:bg-tl-olive/20",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isSelected ? "text-tl-gold" : "text-tl-beige/50",
                      )}
                      strokeWidth={1.5}
                    />
                    <span
                      className={cn(
                        "text-center font-outfit font-light text-[11px] leading-tight",
                        isSelected ? "text-tl-beige" : "text-tl-beige/65",
                      )}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
