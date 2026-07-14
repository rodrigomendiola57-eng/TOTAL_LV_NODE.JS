"use client";

import { PropertyCard } from "@/components/ui/PropertyCard";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";
import { useCallback, useEffect, useRef, useState } from "react";

interface HomeFeaturedPropertiesMobileProps {
  properties: Property[];
}

/**
 * Carrusel horizontal snap de propiedades destacadas — solo móvil.
 * Un gesto ≈ una tarjeta (scroll-snap-stop: always).
 * Progreso: una barra lineal que crece desde el centro hacia ambos lados.
 */
export function HomeFeaturedPropertiesMobile({
  properties,
}: HomeFeaturedPropertiesMobileProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = properties.length;

  const syncIndex = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || count === 0) return;
    const slide = el.clientWidth;
    if (slide <= 0) return;
    const next = Math.round(el.scrollLeft / slide);
    setIndex(Math.max(0, Math.min(count - 1, next)));
  }, [count]);

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

  if (count === 0) return null;

  // Primera propiedad: núcleo al centro; última: barra completa (izq + der).
  const fillPercent = count <= 1 ? 100 : ((index + 1) / count) * 100;

  return (
    <div className="md:hidden">
      {count > 1 ? (
        <div
          className="relative h-1 w-full overflow-hidden rounded-full bg-white/12"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={count}
          aria-valuenow={index + 1}
          aria-label="Progreso de propiedades destacadas"
        >
          <div
            className="absolute top-0 left-1/2 h-full -translate-x-1/2 rounded-full bg-tl-gold transition-[width] duration-300 ease-out"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      ) : null}

      <div
        ref={scrollerRef}
        className={cn(
          "mt-4 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
          "scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        )}
        aria-roledescription="carousel"
        aria-label="Propiedades destacadas"
      >
        {properties.map((property) => (
          <div
            key={property.id}
            className="w-full shrink-0 snap-center snap-always px-0.5"
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </div>
  );
}
