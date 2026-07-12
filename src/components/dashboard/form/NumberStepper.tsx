"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface NumberStepperProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function NumberStepper({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  className,
}: NumberStepperProps) {
  const numericValue = Number(value) || 0;

  function adjust(delta: number) {
    const next = Math.min(max, Math.max(min, numericValue + delta));
    onChange(String(next));
  }

  return (
    <div className={cn("rounded-xl border border-tl-gold/15 bg-[#0a0a0a]/80 p-4", className)}>
      <div className="mb-3">
        <p className="font-outfit font-light text-[11px] uppercase tracking-[0.14em] text-tl-beige/60">
          {label}
        </p>
        {hint ? (
          <p className="mt-0.5 font-outfit font-light text-[10px] text-tl-beige/40">{hint}</p>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => adjust(-step)}
          disabled={numericValue <= min}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-tl-gold/25 text-tl-beige/70 transition-colors hover:border-tl-gold hover:text-tl-gold disabled:opacity-30"
          aria-label={`Reducir ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-center font-outfit font-extralight text-3xl text-tl-beige outline-none"
        />
        <button
          type="button"
          onClick={() => adjust(step)}
          disabled={numericValue >= max}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-tl-gold/25 text-tl-beige/70 transition-colors hover:border-tl-gold hover:text-tl-gold disabled:opacity-30"
          aria-label={`Aumentar ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
