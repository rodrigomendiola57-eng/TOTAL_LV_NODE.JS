"use client";

import type { AsesoriaProcessStep } from "@/lib/data/asesoria";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

interface AsesoriaVentaJourneyMobileProps {
  steps: AsesoriaProcessStep[];
}

/**
 * Ruta de venta en móvil: timeline compacto + accordion (un paso abierto).
 */
export function AsesoriaVentaJourneyMobile({
  steps,
}: AsesoriaVentaJourneyMobileProps) {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(0);

  if (steps.length === 0) return null;

  return (
    <div>
      <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/85">
        Ruta de venta
      </p>
      <p className="mt-2 font-outfit text-[11px] font-extralight text-tl-beige/45">
        Toca cada fase para ver el detalle
      </p>

      <ol className="relative mt-6 space-y-0">
        <div
          aria-hidden
          className="absolute bottom-4 left-[0.95rem] top-4 w-px bg-white/10"
        />

        {steps.map((step, index) => {
          const isOpen = open === index;
          const isLit = index <= open;

          return (
            <li
              key={step.id}
              className="relative grid grid-cols-[2rem_1fr] gap-3 py-1.5"
            >
              <div className="relative flex justify-center pt-3">
                <span
                  aria-hidden
                  className={cn(
                    "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border bg-[#161614] font-outfit text-[10px] font-light transition-colors duration-300",
                    isLit
                      ? "border-tl-gold/70 text-tl-gold"
                      : "border-white/20 text-tl-beige/35",
                    isOpen && "border-tl-gold bg-tl-gold/10",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left transition-colors",
                    isOpen
                      ? "border-tl-gold/35 bg-white/[0.05]"
                      : "border-white/10 bg-white/[0.025]",
                  )}
                >
                  <span
                    className={cn(
                      "font-outfit text-[0.95rem] font-extralight tracking-[0.01em]",
                      isOpen || isLit ? "text-tl-beige" : "text-tl-beige/70",
                    )}
                  >
                    {step.title}
                  </span>
                  <span
                    className={cn(
                      "font-outfit text-[10px] font-light tracking-[0.12em] transition-colors",
                      isOpen ? "text-tl-gold/80" : "text-tl-beige/35",
                    )}
                  >
                    {isOpen ? "—" : "+"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key={`body-${step.id}`}
                      initial={
                        reducedMotion ? false : { height: 0, opacity: 0 }
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={
                        reducedMotion
                          ? undefined
                          : { height: 0, opacity: 0 }
                      }
                      transition={{ duration: 0.28, ease }}
                      className="overflow-hidden"
                    >
                      <p className="px-3.5 pb-3 pt-2 font-outfit text-sm font-extralight leading-relaxed text-tl-beige/60">
                        {step.description}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
