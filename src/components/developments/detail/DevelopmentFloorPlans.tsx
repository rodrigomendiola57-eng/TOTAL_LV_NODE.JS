"use client";

import { cn } from "@/lib/utils";
import type { DevelopmentFloorPlan } from "@/types/development";
import { Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface DevelopmentFloorPlansProps {
  plans: DevelopmentFloorPlan[];
}

const COLS: Record<number, string> = {
  1: "sm:grid-cols-1 sm:max-w-xl sm:mx-auto",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function DevelopmentFloorPlans({ plans }: DevelopmentFloorPlansProps) {
  const [active, setActive] = useState<DevelopmentFloorPlan | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  if (plans.length === 0) return null;

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-5 sm:gap-6",
          COLS[Math.min(plans.length, 4)] ?? "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {plans.map((plan) => (
          <figure key={plan.label} className="group">
            <figcaption className="mb-3 text-center font-outfit text-[11px] font-light uppercase tracking-[0.22em] text-tl-gold">
              {plan.label}
            </figcaption>
            <button
              type="button"
              onClick={() => setActive(plan)}
              className="relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-tl-beige/[0.04]"
            >
              <div
                className="aspect-[3/4] w-full bg-contain bg-center bg-no-repeat p-4"
                style={{ backgroundImage: `url('${plan.image}')` }}
              />
              <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-tl-black/45 text-tl-beige/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <Maximize2 className="h-4 w-4" />
              </span>
            </button>
          </figure>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-tl-black/95 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-tl-beige/80 transition-colors hover:border-tl-gold/60 hover:text-tl-gold"
          >
            <X className="h-5 w-5" />
          </button>
          <figure
            className="max-h-[88vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mx-auto aspect-[3/4] max-h-[78vh] w-full rounded-2xl bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${active.image}')` }}
            />
            <figcaption className="mt-4 text-center font-outfit text-xs font-light uppercase tracking-[0.2em] text-tl-gold">
              {active.label}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
