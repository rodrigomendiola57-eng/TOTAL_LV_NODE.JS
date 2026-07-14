"use client";

import type { AsesoriaProcessStep } from "@/lib/data/asesoria";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const STEP_MS = 2400;
const ease = [0.16, 1, 0.3, 1] as const;

interface AsesoriaVentaJourneyProps {
  steps: AsesoriaProcessStep[];
}

/**
 * Proceso de venta en vertical — desktop (loop activo).
 * Móvil: ver AsesoriaVentaJourneyMobile.
 */
export function AsesoriaVentaJourney({ steps }: AsesoriaVentaJourneyProps) {
  const reducedMotion = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const loop = desktop && !reducedMotion && inView && steps.length > 0;

  useEffect(() => {
    if (!loop) return;
    const id = window.setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % steps.length;
        if (next === 0 && prev === steps.length - 1) {
          setSkipTransition(true);
        }
        return next;
      });
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [loop, steps.length]);

  useEffect(() => {
    if (!skipTransition) return;
    const id = window.requestAnimationFrame(() => setSkipTransition(false));
    return () => window.cancelAnimationFrame(id);
  }, [skipTransition]);

  const fill =
    steps.length <= 1 ? 1 : (active + 1) / steps.length;

  return (
    <motion.div
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ amount: 0.3 }}
      className="relative"
    >
      <div className="flex items-end justify-between gap-3">
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/85">
          Ruta de venta
        </p>
        {loop ? (
          <p className="hidden font-outfit text-[10px] font-extralight tracking-[0.14em] text-tl-beige/35 lg:block">
            Fase {String(active + 1).padStart(2, "0")}
          </p>
        ) : null}
      </div>

      <div className="relative mt-8">
        {/* Rail base */}
        <div
          aria-hidden
          className="absolute bottom-3 left-[0.85rem] top-3 w-px bg-white/10 lg:left-[1.05rem]"
        />
        {/* Fill animado — solo desktop */}
        {loop ? (
          <motion.div
            aria-hidden
            className="absolute left-[0.85rem] top-3 hidden w-px origin-top bg-gradient-to-b from-tl-gold via-tl-gold/75 to-tl-gold/25 lg:left-[1.05rem] lg:block"
            style={{ height: "calc(100% - 1.5rem)" }}
            animate={{ scaleY: fill }}
            transition={{
              duration: skipTransition ? 0 : 0.7,
              ease,
            }}
          />
        ) : null}

        <ol className="relative space-y-0">
          {steps.map((step, index) => {
            const isActive = loop ? index === active : false;
            const isPassed = loop ? index <= active : true;

            return (
              <li
                key={step.id}
                className={cn(
                  "relative grid grid-cols-[2.1rem_1fr] gap-4 py-4 transition-[opacity,transform] duration-500 sm:grid-cols-[2.5rem_1fr] sm:gap-5",
                  loop && !isActive && "lg:opacity-40",
                  loop && isActive && "lg:opacity-100",
                )}
              >
                <div className="relative flex justify-center pt-0.5">
                  <span
                    aria-hidden
                    className={cn(
                      "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border bg-[#161614] font-outfit text-[10px] font-light transition-all duration-500",
                      isPassed
                        ? "border-tl-gold/70 text-tl-gold"
                        : "border-white/20 text-tl-beige/40",
                      isActive &&
                        "lg:scale-110 lg:border-tl-gold lg:bg-tl-gold/15 lg:shadow-[0_0_22px_rgba(214,181,133,0.35)]",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div
                  className={cn(
                    "rounded-xl border border-transparent px-0 py-0 transition-all duration-500 lg:px-4 lg:py-3",
                    isActive && "lg:border-white/10 lg:bg-white/[0.035]",
                  )}
                >
                  <h4
                    className={cn(
                      "font-outfit text-[1.05rem] font-extralight tracking-[0.01em] transition-colors duration-500 sm:text-lg",
                      isActive ? "text-tl-beige" : "text-tl-beige/80",
                    )}
                  >
                    {step.title}
                  </h4>
                  <p className="mt-1.5 font-outfit text-sm font-extralight leading-relaxed tracking-[0.01em] text-tl-beige/55">
                    {step.description}
                  </p>
                  <span
                    aria-hidden
                    className={cn(
                      "mt-3 hidden h-px w-10 origin-left bg-tl-gold/65 transition-transform duration-500 lg:block",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </motion.div>
  );
}
