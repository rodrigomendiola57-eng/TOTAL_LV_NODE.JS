"use client";

import type { AsesoriaPillar } from "@/lib/data/asesoria";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface AsesoriaEnfoqueTimelineProps {
  pillars: AsesoriaPillar[];
}

/** Tiempo en cada nodo + tiempo de viaje al siguiente */
const HOLD_MS = 1500;
const TRAVEL_MS = 850;
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Timeline de enfoque (compacto).
 * Desktop: línea horizontal. Móvil: línea vertical.
 * Ambos: progreso fluido nodo → nodo con pulso.
 */
export function AsesoriaEnfoqueTimeline({
  pillars,
}: AsesoriaEnfoqueTimelineProps) {
  const reducedMotion = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [active, setActive] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const loop = !reducedMotion && inView && pillars.length > 0;
  const lastIndex = Math.max(pillars.length - 1, 1);

  useEffect(() => {
    if (!loop) {
      setLineProgress(!reducedMotion ? 1 : 0);
      return;
    }

    setActive(0);
    setLineProgress(0);

    let cancelled = false;
    let timeoutId = 0;
    let rafId = 0;
    let step = 0;

    const runStep = () => {
      if (cancelled) return;
      setActive(step);
      setLineProgress(step / lastIndex);

      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        const next = (step + 1) % pillars.length;
        const from = step / lastIndex;
        const to = next === 0 ? 0 : next / lastIndex;
        const start = performance.now();

        if (next === 0) {
          setSkipTransition(true);
          setActive(0);
          setLineProgress(0);
          rafId = window.requestAnimationFrame(() => {
            setSkipTransition(false);
            step = 0;
            runStep();
          });
          return;
        }

        const tick = (now: number) => {
          if (cancelled) return;
          const t = Math.min(1, (now - start) / TRAVEL_MS);
          const eased = 1 - Math.pow(1 - t, 3);
          setLineProgress(from + (to - from) * eased);
          if (t < 1) {
            rafId = window.requestAnimationFrame(tick);
          } else {
            step = next;
            runStep();
          }
        };
        rafId = window.requestAnimationFrame(tick);
      }, HOLD_MS);
    };

    runStep();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(rafId);
    };
  }, [loop, pillars.length, lastIndex, reducedMotion]);

  const pulseTransition = skipTransition
    ? { duration: 0 }
    : { duration: 0.05, ease: "linear" as const };

  return (
    <section
      id="enfoque"
      aria-labelledby="asesoria-enfoque-title"
      className="border-t border-white/[0.06] bg-[#141412]"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <h2
          id="asesoria-enfoque-title"
          className="font-outfit text-[10px] font-light uppercase tracking-[0.24em] text-tl-gold/85"
        >
          Enfoque
        </h2>
        <p className="mt-2 max-w-xl font-outfit text-sm font-extralight tracking-[0.02em] text-tl-beige/55">
          Tres pilares. Un criterio. Cada decisión con dirección.
        </p>

        <motion.div
          className="relative mt-8 sm:mt-10"
          onViewportEnter={() => setInView(true)}
          onViewportLeave={() => setInView(false)}
          viewport={{ amount: 0.35 }}
        >
          {/* Base line — vertical móvil / horizontal desktop */}
          <div
            aria-hidden
            className="absolute left-[0.7rem] top-2 bottom-2 w-px bg-white/10 lg:left-[8%] lg:right-[8%] lg:top-[0.95rem] lg:bottom-auto lg:h-px lg:w-auto"
          />

          {/* Progress fill — móvil (vertical) */}
          <motion.div
            aria-hidden
            className="absolute left-[0.7rem] top-2 w-[2px] origin-top rounded-full bg-gradient-to-b from-tl-gold via-tl-gold to-tl-gold/35 lg:hidden"
            style={{ height: "calc(100% - 1rem)" }}
            animate={
              loop
                ? { scaleY: Math.max(0.02, lineProgress) }
                : !reducedMotion
                  ? { scaleY: 1 }
                  : undefined
            }
            initial={false}
            transition={pulseTransition}
          />

          {/* Progress fill — desktop (horizontal) */}
          <motion.div
            aria-hidden
            className="absolute left-[8%] top-[0.95rem] hidden h-[2px] origin-left rounded-full bg-gradient-to-r from-tl-gold via-tl-gold to-tl-gold/35 lg:block"
            style={{ width: "84%" }}
            animate={
              loop
                ? { scaleX: Math.max(0.02, lineProgress) }
                : desktop && !reducedMotion
                  ? { scaleX: 1 }
                  : undefined
            }
            initial={false}
            transition={pulseTransition}
          />

          {/* Pulso viajero — móvil */}
          {loop ? (
            <>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-[0.7rem] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tl-gold/20 blur-md lg:hidden"
                animate={{
                  top: `calc(0.5rem + ${lineProgress} * (100% - 1rem))`,
                }}
                transition={pulseTransition}
              />
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-[0.7rem] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tl-gold shadow-[0_0_16px_rgba(214,181,133,1)] lg:hidden"
                animate={{
                  top: `calc(0.5rem + ${lineProgress} * (100% - 1rem))`,
                }}
                transition={pulseTransition}
              />
            </>
          ) : null}

          {/* Pulso viajero — desktop */}
          {loop ? (
            <>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute top-[0.95rem] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tl-gold/20 blur-md lg:block"
                animate={{ left: `calc(8% + ${lineProgress * 84}%)` }}
                transition={pulseTransition}
              />
              <motion.span
                aria-hidden
                className="pointer-events-none absolute top-[0.95rem] hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tl-gold shadow-[0_0_16px_rgba(214,181,133,1)] lg:block"
                animate={{ left: `calc(8% + ${lineProgress * 84}%)` }}
                transition={pulseTransition}
              />
            </>
          ) : null}

          <ol className="relative grid gap-6 sm:grid-cols-3 sm:gap-6 lg:gap-8">
            {pillars.map((pillar, index) => {
              const isActive = loop ? index === active : index === 0;
              const isLit = loop ? index <= active : true;

              return (
                <motion.li
                  key={pillar.id}
                  animate={
                    loop
                      ? {
                          opacity: isLit ? 1 : 0.35,
                          y: isLit ? 0 : 6,
                        }
                      : { opacity: 1, y: 0 }
                  }
                  transition={{ duration: 0.45, ease }}
                  className="relative pl-10 lg:pl-0 lg:pt-10"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full border bg-[#141412] transition-all duration-400",
                      "lg:left-0 lg:top-0",
                      isLit ? "border-tl-gold/70" : "border-white/20",
                      isActive &&
                        "border-tl-gold shadow-[0_0_18px_rgba(214,181,133,0.4)]",
                    )}
                  >
                    {isActive && loop ? (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full border border-tl-gold/50"
                        initial={{ scale: 1, opacity: 0.7 }}
                        animate={{ scale: 1.85, opacity: 0 }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-all duration-400",
                        isLit ? "bg-tl-gold" : "bg-white/25",
                        isActive && "h-2 w-2",
                      )}
                    />
                  </span>

                  <p
                    className={cn(
                      "font-outfit text-[10px] font-light uppercase tracking-[0.2em] transition-colors duration-400",
                      isLit ? "text-tl-gold/90" : "text-tl-gold/35",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className={cn(
                      "mt-1.5 font-outfit text-lg font-extralight tracking-[0.02em] transition-colors duration-400 sm:text-xl",
                      isLit ? "text-tl-beige" : "text-tl-beige/45",
                    )}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-1.5 max-w-sm font-outfit text-[13px] font-extralight leading-relaxed tracking-[0.01em] transition-colors duration-400 sm:text-sm",
                      isLit ? "text-tl-beige/65" : "text-tl-beige/35",
                    )}
                  >
                    {pillar.description}
                  </p>

                  <motion.span
                    aria-hidden
                    className="mt-3 block h-px origin-left bg-tl-gold/70"
                    initial={false}
                    animate={{
                      scaleX: isLit ? 1 : 0,
                      opacity: isLit ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease }}
                    style={{ width: "2.5rem" }}
                  />
                </motion.li>
              );
            })}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
