"use client";

import { formatPrice } from "@/lib/format-price";
import { resolveMediaUrl } from "@/lib/media-url";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";
import { formatPropertyBathrooms } from "@/types/property";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop";

const fadeEase = [0.22, 1, 0.36, 1] as const;

const navButtonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-tl-beige/80 transition-colors hover:border-tl-gold/50 hover:text-tl-gold sm:h-11 sm:w-11";

interface FeaturedCatalogCarouselProps {
  properties: Property[];
}

export function FeaturedCatalogCarousel({
  properties,
}: FeaturedCatalogCarouselProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const count = properties.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex((index + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (count <= 1 || reducedMotion || !inView) return;
    const timer = window.setInterval(goNext, 7000);
    return () => window.clearInterval(timer);
  }, [count, goNext, reducedMotion, inView]);

  // Pausa el autoplay cuando el carrusel no está en viewport (ahorra
  // main-thread y evita cambios de slide/descargas invisibles).
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (count === 0) return null;

  const property = properties[activeIndex];
  const imageUrl =
    resolveMediaUrl(property.cover_image_url) || FALLBACK_IMAGE;

  return (
    <section
      ref={sectionRef}
      data-tl-media-hero
      className={cn(
        "relative min-h-[min(70svh,36rem)] overflow-hidden sm:min-h-[min(76dvh,720px)]",
        HERO_CONTENT_OFFSET,
      )}
      aria-roledescription="carousel"
      aria-label="Propiedades destacadas"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={property.id}
          initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.65, ease: fadeEase }}
          className="absolute inset-0"
        >
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            priority={activeIndex === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/45" />
        </motion.div>
      </AnimatePresence>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Propiedad anterior"
            className={cn(
              navButtonClass,
              "absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 lg:inline-flex xl:left-8",
            )}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Siguiente propiedad"
            className={cn(
              navButtonClass,
              "absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 lg:inline-flex xl:right-8",
            )}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.25} />
          </button>
        </>
      ) : null}

      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] max-w-6xl flex-col justify-end px-4 pb-5 sm:px-6 sm:pb-12 lg:max-w-none lg:px-10 lg:pb-14 xl:px-14 xl:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${property.id}`}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
            transition={{ duration: 0.45, ease: fadeEase }}
            className="max-w-3xl self-start lg:max-w-2xl"
          >
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold">
              Destacada · {property.property_type}
            </p>
            <p className="mt-3 font-outfit text-3xl font-extralight tracking-[0.02em] text-tl-gold sm:text-5xl">
              {formatPrice(property.price, property.currency)}
            </p>
            <h2 className="mt-3 font-outfit text-xl font-extralight leading-snug tracking-[0.01em] text-tl-beige sm:text-3xl">
              {property.title}
            </h2>
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/70 sm:text-[11px]">
              <span>{property.bedrooms} rec</span>
              <span className="text-tl-gold/35">·</span>
              <span>{formatPropertyBathrooms(property)}</span>
              <span className="text-tl-gold/35">·</span>
              <span>{property.build_area_m2} m²</span>
            </div>
            <Link
              href={`/propiedades/${property.id}`}
              className="mt-6 inline-flex min-h-11 items-center rounded-full border border-tl-gold/50 px-5 py-2.5 font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-gold transition-colors hover:border-tl-gold hover:bg-tl-gold hover:text-tl-black"
            >
              Ver detalles
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 hidden justify-center lg:flex xl:bottom-8">
          <div className="pointer-events-auto flex items-center gap-2">
            {properties.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Ver propiedad ${index + 1}`}
                onClick={() => goTo(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === activeIndex
                    ? "w-7 bg-tl-gold"
                    : "w-1.5 bg-white/35 hover:bg-white/55",
                )}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
