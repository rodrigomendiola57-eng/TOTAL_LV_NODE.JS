"use client";

import { formatPrice } from "@/lib/format-price";
import { resolveMediaUrl } from "@/lib/media-url";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import type { Development } from "@/types/development";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

const AUTOPLAY_MS = 6500;
const ease = [0.22, 1, 0.36, 1] as const;

const navButtonClass =
  "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-tl-beige/70 transition-colors hover:text-tl-gold sm:h-12 sm:w-12";

interface FeaturedDevelopmentsCarouselProps {
  developments: Development[];
}

export function FeaturedDevelopmentsCarousel({
  developments,
}: FeaturedDevelopmentsCarouselProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = developments.length;

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
    if (count <= 1 || reducedMotion || paused) return;
    const timer = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [count, goNext, paused, reducedMotion]);

  if (count === 0) return null;

  const development = developments[activeIndex];
  const imageUrl =
    resolveMediaUrl(development.coverImage) ||
    development.coverImage ||
    FALLBACK_IMAGE;

  return (
    <section
      className={cn(
        "relative min-h-[min(72svh,38rem)] overflow-hidden sm:min-h-[min(88dvh,820px)]",
        HERO_CONTENT_OFFSET,
      )}
      aria-roledescription="carousel"
      aria-label="Desarrollos destacados"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={development.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.75, ease }}
          className="absolute inset-0"
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${imageUrl}')` }}
            initial={{ scale: reducedMotion ? 1 : 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: reducedMotion ? 0.2 : 8, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-tl-black/50 via-tl-black/35 to-tl-black/75" />
        </motion.div>
      </AnimatePresence>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Desarrollo anterior"
            className={cn(navButtonClass, "left-3 sm:left-5 lg:left-8")}
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Siguiente desarrollo"
            className={cn(navButtonClass, "right-3 sm:right-5 lg:right-8")}
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1} />
          </button>
        </>
      ) : null}

      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] max-w-3xl items-center justify-center px-14 sm:px-16 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${development.id}`}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
            transition={{ duration: 0.45, ease }}
            className="flex w-full flex-col items-center text-center"
          >
            <h1 className="font-cormorant text-4xl font-light leading-[0.95] tracking-[-0.01em] text-tl-beige sm:text-5xl md:text-6xl lg:text-7xl">
              {development.name}
            </h1>

            {development.tagline ? (
              <p className="mt-4 max-w-lg font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/70 sm:mt-5 sm:text-base">
                {development.tagline}
              </p>
            ) : null}

            <p className="mt-8 font-outfit text-3xl font-extralight tracking-[0.02em] text-tl-gold sm:mt-10 sm:text-4xl md:text-5xl">
              {formatPrice(
                String(development.priceFrom),
                development.currency,
              )}
            </p>

            <Link
              href={`/propiedades/desarrollos/${development.slug}`}
              className="mt-8 inline-flex min-h-11 items-center border-b border-tl-gold/45 pb-1 font-outfit text-[11px] font-light uppercase tracking-[0.2em] text-tl-gold transition-colors hover:border-tl-gold sm:mt-10"
            >
              Conocer proyecto
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
