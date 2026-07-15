"use client";

import type { AsesoriaProcessStep } from "@/lib/data/asesoria";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

interface AsesoriaCompraProcessMobileProps {
  steps: AsesoriaProcessStep[];
}

/**
 * Proceso de compra en móvil: carrusel horizontal con snap.
 * Un gesto de scroll = una tarjeta (scroll-snap-stop: always).
 */
export function AsesoriaCompraProcessMobile({
  steps,
}: AsesoriaCompraProcessMobileProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const syncIndex = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || steps.length === 0) return;
    const slide = el.clientWidth;
    if (slide <= 0) return;
    const next = Math.round(el.scrollLeft / slide);
    setIndex(Math.max(0, Math.min(steps.length - 1, next)));
  }, [steps.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    el.addEventListener("scroll", syncIndex, { passive: true });
    window.addEventListener("resize", syncIndex, { passive: true });
    syncIndex();

    return () => {
      el.removeEventListener("scroll", syncIndex);
      window.removeEventListener("resize", syncIndex);
    };
  }, [syncIndex]);

  function goTo(i: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(steps.length - 1, i));
    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: "smooth",
    });
  }

  if (steps.length === 0) return null;

  return (
    <div className="lg:hidden">
      {/* Indicadores */}
      <div
        className="flex items-center gap-1.5"
        role="tablist"
        aria-label="Pasos del proceso"
      >
        {steps.map((s, i) => {
          const active = i === index;
          const passed = i < index;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Paso ${i + 1}: ${s.title}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                active
                  ? "bg-tl-gold"
                  : passed
                    ? "bg-tl-gold/45"
                    : "bg-white/12",
              )}
            />
          );
        })}
      </div>

      <p className="mt-3 font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-beige/40">
        Paso {String(index + 1).padStart(2, "0")} /{" "}
        {String(steps.length).padStart(2, "0")} · desliza
      </p>

      {/* Carrusel snap: un slide por viewport del contenedor */}
      <div
        ref={scrollerRef}
        className={cn(
          "mt-4 -mx-1 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
          "scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        )}
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {steps.map((step, i) => (
          <article
            key={step.id}
            role="tabpanel"
            aria-label={`Paso ${i + 1}: ${step.title}`}
            className={cn(
              "w-full min-w-full shrink-0 snap-center snap-always px-1",
              "scroll-snap-stop-always",
            )}
            style={{ scrollSnapStop: "always" }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#161614] px-6 py-7 sm:px-8">
              <div className="relative z-[1]">
                <p className="font-outfit text-3xl font-extralight tracking-[0.04em] text-white">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h4 className="mt-5 text-center font-outfit text-2xl font-extralight tracking-[0.02em] text-white">
                  {step.title}
                </h4>
                <p className="mt-3 text-center font-outfit text-base font-extralight leading-relaxed text-white/85">
                  {step.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
