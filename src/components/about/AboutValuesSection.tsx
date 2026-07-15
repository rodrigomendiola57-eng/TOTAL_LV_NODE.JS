"use client";

import type { CompanyValue } from "@/types/company";
import {
  ABOUT_CONTAINER,
  ABOUT_SECTION_BORDER,
  ABOUT_SECTION_SCROLL_MT,
} from "@/lib/about-layout";
import { useLiteMotion } from "@/hooks/use-lite-motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const revealEase = [0.22, 1, 0.36, 1] as const;
const layoutSpring = {
  type: "spring",
  stiffness: 78,
  damping: 22,
  mass: 1.15,
} as const;
const contentSpring = {
  type: "spring",
  stiffness: 92,
  damping: 24,
  mass: 0.95,
} as const;

function ValueCardBackdrop({ isActive }: { isActive: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[#161614]" />
      <div
        className={cn(
          "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,181,133,0.08),transparent_60%)] transition-opacity duration-700 ease-out",
          isActive ? "opacity-100" : "opacity-40",
        )}
      />
    </div>
  );
}

function isLongValueTitle(id: string) {
  return id === "responsabilidad-social";
}

function valueTitleClassName(valueId: string, isActive: boolean) {
  return cn(
    "font-outfit font-extralight tracking-[0.01em] transition-colors duration-300",
    isLongValueTitle(valueId)
      ? "text-[clamp(0.95rem,2.8cqi+0.4rem,1.35rem)] leading-snug whitespace-normal"
      : "text-[clamp(0.82rem,5.5cqi+0.45rem,1.65rem)] leading-none whitespace-nowrap",
    isActive ? "text-tl-beige" : "text-tl-beige/85",
  );
}

interface AboutValuesSectionProps {
  values: CompanyValue[];
}

function ValueMobileCarouselCard({
  value,
  index,
  isActive,
}: {
  value: CompanyValue;
  index: number;
  isActive: boolean;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      aria-roledescription="slide"
      aria-label={`${number}. ${value.title}`}
      className={cn(
        "@container relative flex h-full min-h-[19.5rem] w-[min(84vw,20.5rem)] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-[1.35rem] border bg-[#161614] p-6 transition-all duration-300 ease-out",
        isActive
          ? "scale-100 border-tl-gold/45 shadow-[0_20px_50px_-20px_rgba(214,181,133,0.35)] opacity-100"
          : "scale-[0.97] border-white/10 opacity-70",
      )}
    >
      <ValueCardBackdrop isActive={isActive} />

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-5 top-4 z-[1] font-outfit text-[3.5rem] font-extralight leading-none tracking-[-0.04em] text-white transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-80",
        )}
      >
        {number}
      </span>

      <div className="relative z-[1]">
        <h3 className={valueTitleClassName(value.id, isActive)}>
          {value.title}
        </h3>
        <p className="mt-3 font-outfit text-sm font-light leading-relaxed tracking-[0.02em] text-tl-beige/68">
          {value.description}
        </p>
      </div>
    </article>
  );
}

function ValuesMobileCarousel({ values }: { values: CompanyValue[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const slides = Array.from(
      container.querySelectorAll<HTMLElement>("[data-value-slide]"),
    );
    if (slides.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const target = visible[0]?.target as HTMLElement | undefined;
        if (!target) return;

        const index = slides.indexOf(target);
        if (index >= 0) setActiveIndex(index);
      },
      {
        root: container,
        threshold: [0.45, 0.6, 0.75],
      },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [values]);

  const scrollTo = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const slide = container.querySelectorAll<HTMLElement>("[data-value-slide]")[
      index
    ];
    slide?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    setActiveIndex(index);
  }, []);

  const goPrev = () => {
    scrollTo(Math.max(0, activeIndex - 1));
  };

  const goNext = () => {
    scrollTo(Math.min(values.length - 1, activeIndex + 1));
  };

  return (
    <div className="lg:hidden">
      <div className="mb-4 flex items-center justify-between px-4">
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-beige/45">
          Desliza para explorar
        </p>
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-gold/80">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(values.length).padStart(2, "0")}
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto overscroll-x-contain px-[8vw] pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
      >
        {values.map((value, index) => (
          <div key={value.id} data-value-slide className="snap-center">
            <ValueMobileCarouselCard
              value={value}
              index={index}
              isActive={activeIndex === index}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 px-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          aria-label="Valor anterior"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-tl-beige/70 transition-colors enabled:active:border-tl-gold/40 enabled:active:text-tl-gold disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="flex flex-col items-center gap-2.5">
          <AnimatePresence mode="wait">
            <motion.p
              key={values[activeIndex]?.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: revealEase }}
              className="max-w-[14rem] truncate text-center font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-gold"
            >
              {values[activeIndex]?.title}
            </motion.p>
          </AnimatePresence>

          <div className="flex items-center gap-2">
            {values.map((value, index) => (
              <button
                key={value.id}
                type="button"
                aria-label={`Ir a ${value.title}`}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  activeIndex === index
                    ? "w-8 bg-tl-gold"
                    : "w-1.5 bg-white/25",
                )}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex === values.length - 1}
          aria-label="Siguiente valor"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-tl-beige/70 transition-colors enabled:active:border-tl-gold/40 enabled:active:text-tl-gold disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

function ValueDesktopPanel({
  value,
  index,
  isActive,
  onActivate,
}: {
  value: CompanyValue;
  index: number;
  isActive: boolean;
  onActivate: (index: number) => void;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      layout
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      onMouseEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate(index);
        }
      }}
      transition={{ layout: layoutSpring }}
      className={cn(
        "@container group relative flex min-h-[min(38dvh,16.5rem)] min-w-0 flex-[1] flex-col justify-end overflow-hidden rounded-3xl border bg-[#161614] p-6 outline-none transition-[box-shadow,border-color] duration-700 ease-out",
        isActive
          ? "z-[2] flex-[2.55] border-tl-gold/55 shadow-[0_32px_72px_-22px_rgba(214,181,133,0.5)]"
          : "border-white/8 hover:border-tl-gold/25",
      )}
    >
      <ValueCardBackdrop isActive={isActive} />

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-5 top-4 z-[1] font-outfit text-6xl font-extralight leading-none tracking-[-0.04em] text-white transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-80",
        )}
      >
        {number}
      </span>

      <div className="relative z-[1]">
        <h3 className={valueTitleClassName(value.id, isActive)}>
          {value.title}
        </h3>

        <AnimatePresence initial={false}>
          {isActive ? (
            <motion.div
              key="description-wrap"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={contentSpring}
              className="overflow-hidden"
            >
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ ...contentSpring, delay: 0.04 }}
                className="mt-4 max-w-md font-outfit text-base font-light leading-relaxed tracking-[0.02em] text-tl-beige/70"
              >
                {value.description}
              </motion.p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

export function AboutValuesSection({ values }: AboutValuesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const liteMotion = useLiteMotion();

  const activate = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section
      id="valores"
      className={cn(
        ABOUT_SECTION_SCROLL_MT,
        ABOUT_SECTION_BORDER,
        "relative overflow-hidden pb-10 pt-12 sm:pb-14 sm:pt-16 lg:pb-16",
      )}
    >
      {liteMotion ? (
        <div className={cn(ABOUT_CONTAINER, "relative mb-6 text-center sm:mb-10")}>
          <p className="font-outfit text-[11px] font-light uppercase tracking-[0.24em] text-tl-gold sm:text-sm sm:tracking-[0.32em]">
            Valores Total Living
          </p>
          <h2 className="mt-3 font-outfit text-[clamp(1.65rem,6vw,3.25rem)] font-extralight leading-[1.08] tracking-[0.01em] text-tl-beige sm:mt-4">
            Lo que nos define en cada interacción
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-outfit text-sm font-light leading-relaxed tracking-[0.02em] text-tl-beige/55 sm:mt-5 sm:text-lg">
            Cinco principios que sostienen nuestra forma de trabajar — desde la
            primera llamada hasta el cierre y más allá.
          </p>
        </div>
      ) : (
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: revealEase }}
        className={cn(ABOUT_CONTAINER, "relative mb-6 text-center sm:mb-10")}
      >
        <p className="font-outfit text-[11px] font-light uppercase tracking-[0.24em] text-tl-gold sm:text-sm sm:tracking-[0.32em]">
          Valores Total Living
        </p>
        <h2 className="mt-3 font-outfit text-[clamp(1.65rem,6vw,3.25rem)] font-extralight leading-[1.08] tracking-[0.01em] text-tl-beige sm:mt-4">
          Lo que nos define en cada interacción
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-outfit text-sm font-light leading-relaxed tracking-[0.02em] text-tl-beige/55 sm:mt-5 sm:text-lg">
          Cinco principios que sostienen nuestra forma de trabajar — desde la
          primera llamada hasta el cierre y más allá.
        </p>
      </motion.div>
      )}

      {liteMotion ? <ValuesMobileCarousel values={values} /> : null}

      {!liteMotion ? (
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: revealEase, delay: 0.08 }}
        className="relative flex gap-3 px-8 xl:px-10"
      >
        {values.map((value, index) => (
          <ValueDesktopPanel
            key={value.id}
            value={value}
            index={index}
            isActive={activeIndex === index}
            onActivate={activate}
          />
        ))}
      </motion.div>
      ) : null}
    </section>
  );
}
