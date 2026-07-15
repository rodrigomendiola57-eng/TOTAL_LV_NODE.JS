"use client";

import type { AsesoriaFeature } from "@/lib/data/asesoria";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

interface AsesoriaVentaCapabilitiesMobileProps {
  features: AsesoriaFeature[];
}

/**
 * Carrusel snap de “Cómo vendemos” — solo móvil.
 */
export function AsesoriaVentaCapabilitiesMobile({
  features,
}: AsesoriaVentaCapabilitiesMobileProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const syncIndex = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || features.length === 0) return;
    const slide = el.clientWidth;
    if (slide <= 0) return;
    const next = Math.round(el.scrollLeft / slide);
    setIndex(Math.max(0, Math.min(features.length - 1, next)));
  }, [features.length]);

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
    const clamped = Math.max(0, Math.min(features.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }

  if (features.length === 0) return null;

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/85">
          Cómo vendemos
        </p>
        <p className="font-outfit text-[10px] font-extralight tracking-[0.14em] text-tl-beige/40">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(features.length).padStart(2, "0")}
        </p>
      </div>

      <div
        className="mt-4 flex items-center gap-1.5"
        role="tablist"
        aria-label="Cómo vendemos"
      >
        {features.map((f, i) => (
          <button
            key={f.title}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`${i + 1}: ${f.title}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i === index
                ? "bg-tl-gold"
                : i < index
                  ? "bg-tl-gold/45"
                  : "bg-white/12",
            )}
          />
        ))}
      </div>

      <p className="mt-3 font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-beige/40">
        Desliza
      </p>

      <div
        ref={scrollerRef}
        className={cn(
          "mt-4 -mx-1 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
          "scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        )}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {features.map((feature, i) => (
          <article
            key={feature.title}
            role="tabpanel"
            aria-label={feature.title}
            className="w-full min-w-full shrink-0 snap-center snap-always px-1"
            style={{ scrollSnapStop: "always" }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#161614] px-6 py-7">
              <div className="relative z-[1]">
                <p className="font-outfit text-3xl font-extralight tracking-[0.04em] text-white">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h4 className="mt-5 text-center font-outfit text-2xl font-extralight tracking-[0.02em] text-white">
                  {feature.title}
                </h4>
                <p className="mt-3 text-center font-outfit text-base font-extralight leading-relaxed text-white/85">
                  {feature.description}
                </p>
                {feature.detail ? (
                  <p className="mt-4 text-center font-outfit text-[10px] font-extralight tracking-[0.08em] text-white/60">
                    {feature.detail}
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
