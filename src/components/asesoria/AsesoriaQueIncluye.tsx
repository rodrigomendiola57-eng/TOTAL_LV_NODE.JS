"use client";

import type { AsesoriaFeature } from "@/lib/data/asesoria";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

/** Misma cadencia que Enfoque */
const HOLD_MS = 1500;
const TRAVEL_MS = 850;
const ease = [0.22, 1, 0.36, 1] as const;

interface AsesoriaQueIncluyeProps {
  features: AsesoriaFeature[];
}

/**
 * Lista "Qué incluye".
 * Desktop: timeline vertical con hold/travel (igual que Enfoque).
 * Móvil: accordion interactivo.
 */
export function AsesoriaQueIncluye({ features }: AsesoriaQueIncluyeProps) {
  const reducedMotion = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [active, setActive] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);
  const [openMobile, setOpenMobile] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const loop = desktop && !reducedMotion && inView && features.length > 0;
  const lastIndex = Math.max(features.length - 1, 1);

  useEffect(() => {
    if (!loop) {
      setLineProgress(desktop && !reducedMotion ? 1 : 0);
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
        const next = (step + 1) % features.length;
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
  }, [loop, features.length, lastIndex, desktop, reducedMotion]);

  return (
    <motion.div
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ amount: 0.35 }}
    >
      <div className="flex items-end justify-between gap-4">
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/85">
          Qué incluye
        </p>
        {loop ? (
          <p className="hidden font-outfit text-[10px] font-extralight tracking-[0.14em] text-tl-beige/35 lg:block">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(features.length).padStart(2, "0")}
          </p>
        ) : null}
      </div>

      {/* —— Móvil: accordion —— */}
      <ul className="mt-5 space-y-2 lg:hidden" role="list">
        {features.map((feature, index) => {
          const open = openMobile === index;
          return (
            <li key={feature.title}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenMobile(open ? -1 : index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                  open
                    ? "border-tl-gold/35 bg-white/[0.05]"
                    : "border-white/10 bg-white/[0.025]",
                )}
              >
                <span
                  className={cn(
                    "font-outfit text-[10px] font-light tracking-[0.16em]",
                    open ? "text-tl-gold/85" : "text-tl-beige/35",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "flex-1 font-outfit text-[0.95rem] font-extralight tracking-[0.01em]",
                    open ? "text-tl-beige" : "text-tl-beige/80",
                  )}
                >
                  {feature.title}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-tl-beige/45 transition-transform duration-300",
                    open && "rotate-180 text-tl-gold/80",
                  )}
                  strokeWidth={1.5}
                />
              </button>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    key={`body-${feature.title}`}
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
                    <div className="px-4 pb-3 pt-2">
                      {feature.detail ? (
                        <p className="font-outfit text-[10px] font-extralight tracking-[0.08em] text-tl-gold/70">
                          {feature.detail}
                        </p>
                      ) : null}
                      <p className="mt-1.5 font-outfit text-sm font-extralight leading-relaxed text-tl-beige/60">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {/* —— Desktop: timeline vertical (misma lógica que Enfoque) —— */}
      <div className="relative mt-6 hidden lg:block lg:pl-5">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-2 left-0 top-2 w-px bg-white/10"
        />

        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-2 w-[2px] origin-top rounded-full bg-gradient-to-b from-tl-gold via-tl-gold to-tl-gold/35"
          style={{ height: "calc(100% - 1rem)" }}
          animate={
            loop
              ? { scaleY: Math.max(0.02, lineProgress) }
              : desktop && !reducedMotion
                ? { scaleY: 1 }
                : undefined
          }
          initial={false}
          transition={
            skipTransition
              ? { duration: 0 }
              : { duration: 0.05, ease: "linear" }
          }
        />

        {loop ? (
          <>
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tl-gold/20 blur-md"
              animate={{
                top: `calc(0.5rem + ${lineProgress} * (100% - 1rem))`,
              }}
              transition={
                skipTransition
                  ? { duration: 0 }
                  : { duration: 0.05, ease: "linear" }
              }
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tl-gold shadow-[0_0_16px_rgba(214,181,133,1)]"
              animate={{
                top: `calc(0.5rem + ${lineProgress} * (100% - 1rem))`,
              }}
              transition={
                skipTransition
                  ? { duration: 0 }
                  : { duration: 0.05, ease: "linear" }
              }
            />
          </>
        ) : null}

        <ul className="relative space-y-1" role="list">
          {features.map((feature, index) => {
            const isActive = loop ? index === active : false;
            const isLit = loop ? index <= active : true;

            return (
              <motion.li
                key={feature.title}
                animate={
                  loop
                    ? {
                        opacity: isLit ? 1 : 0.4,
                        y: isLit ? 0 : 4,
                      }
                    : { opacity: 1, y: 0 }
                }
                transition={{ duration: 0.45, ease }}
                className={cn(
                  "relative rounded-r-xl px-4 py-5 transition-[background-color] duration-500",
                  isActive ? "bg-white/[0.045]" : "hover:bg-white/[0.025]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-5 top-7 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border bg-[#1a1a18] transition-all duration-400",
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

                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className={cn(
                      "font-outfit text-[10px] font-light uppercase tracking-[0.18em] transition-colors duration-500",
                      isLit ? "text-tl-gold/85" : "text-tl-beige/30",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  {feature.detail ? (
                    <p
                      className={cn(
                        "font-outfit text-[10px] font-extralight tracking-[0.06em] text-tl-beige/40 transition-opacity duration-500",
                        isLit ? "opacity-100" : "opacity-40",
                      )}
                    >
                      {feature.detail}
                    </p>
                  ) : null}
                </div>

                <h4
                  className={cn(
                    "mt-1.5 font-outfit text-lg font-extralight tracking-[0.01em] transition-colors duration-500",
                    isLit ? "text-tl-beige" : "text-tl-beige/45",
                  )}
                >
                  {feature.title}
                </h4>

                <p
                  className={cn(
                    "mt-1.5 font-outfit text-sm font-extralight leading-relaxed tracking-[0.01em] transition-colors duration-500",
                    isLit ? "text-tl-beige/55" : "text-tl-beige/35",
                  )}
                >
                  {feature.description}
                </p>

                <motion.span
                  aria-hidden
                  className="mt-4 block h-px origin-left bg-tl-gold/70"
                  initial={false}
                  animate={{
                    scaleX: isLit ? 1 : 0,
                    opacity: isLit ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease }}
                  style={{ width: "3rem" }}
                />
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}
