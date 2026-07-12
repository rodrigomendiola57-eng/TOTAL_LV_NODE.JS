"use client";

import { DevelopmentLightbox } from "@/components/developments/detail/DevelopmentLightbox";
import { cn } from "@/lib/utils";
import type { DevelopmentFloorPlan } from "@/types/development";
import { Maximize2 } from "lucide-react";
import { useCallback, useState } from "react";

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
  const close = useCallback(() => setActive(null), []);

  if (plans.length === 0) return null;

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-5 sm:gap-6",
          COLS[Math.min(plans.length, 4)] ?? "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {plans.map((plan, index) => (
          <figure key={plan.id ?? `${plan.label}-${index}`} className="group">
            <figcaption className="mb-3 text-center font-outfit text-[11px] font-light uppercase tracking-[0.22em] text-tl-gold">
              {plan.label}
            </figcaption>
            <button
              type="button"
              onClick={() => setActive(plan)}
              className="relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-tl-beige/[0.04]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={plan.image}
                alt={plan.label}
                className="aspect-[3/4] w-full object-contain bg-white/5 p-3 sm:p-4"
              />
              <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-tl-black/45 text-tl-beige/80 opacity-100 backdrop-blur-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                <Maximize2 className="h-4 w-4" />
              </span>
            </button>
          </figure>
        ))}
      </div>

      {active ? (
        <DevelopmentLightbox
          src={active.image}
          alt={active.label}
          caption={active.label}
          onClose={close}
        />
      ) : null}
    </>
  );
}
