"use client";

import { OPERATION_TYPES } from "@/lib/data/property-options";
import { cn } from "@/lib/utils";
import type { OperationType } from "@/types/property";
import { KeyRound, Tags } from "lucide-react";

interface OperationTypeSelectorProps {
  value: OperationType;
  onChange: (value: OperationType) => void;
}

const OPERATION_ICONS: Record<OperationType, typeof Tags> = {
  Venta: Tags,
  Renta: KeyRound,
  "Venta o Renta": Tags,
};

export function OperationTypeSelector({
  value,
  onChange,
}: OperationTypeSelectorProps) {
  return (
    <div className="sm:col-span-2 xl:col-span-3">
      <p className="mb-2 font-outfit font-light text-[11px] uppercase tracking-[0.14em] text-tl-beige/60">
        Tipo de operación *
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {OPERATION_TYPES.map((type) => {
          const Icon = OPERATION_ICONS[type];
          const isSelected = value === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-outfit font-light text-sm transition-all",
                isSelected
                  ? "border-tl-gold bg-tl-gold text-tl-black"
                  : "border-tl-gold/20 bg-[#0a0a0a] text-tl-beige/70 hover:border-tl-gold/40",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
