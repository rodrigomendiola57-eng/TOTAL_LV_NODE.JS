"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ASESORIA_HERO_IMAGE } from "@/lib/hero-media";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import type { AsesoriaHeroContent } from "@/lib/data/asesoria";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface AsesoriaHeroProps {
  hero: AsesoriaHeroContent;
  /** Foto de portada (antes era el fondo del hero de Inicio). */
  backgroundUrl?: string | null;
}

export function AsesoriaHero({ hero, backgroundUrl }: AsesoriaHeroProps) {
  const reducedMotion = useReducedMotion();
  const background = backgroundUrl ?? ASESORIA_HERO_IMAGE;

  const scrollToServicios = () => {
    const target = document.getElementById("servicios");
    if (!target) return;
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      data-tl-media-hero
      className="relative flex h-[100svh] min-h-[100svh] w-full items-center justify-center overflow-hidden lg:h-[100dvh] lg:min-h-[100dvh]"
    >
      <Image
        src={background}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[2] bg-gradient-to-b from-black/45 via-black/40 to-tl-black/95"
      />

      <Reveal
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 text-center sm:px-8",
          HERO_CONTENT_OFFSET,
          "pb-24 sm:pb-32",
        )}
      >
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.28em] text-tl-gold/90 sm:text-[11px] sm:tracking-[0.32em]">
          {hero.eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl font-outfit text-[clamp(2.4rem,6.5vw,4.75rem)] font-extralight leading-[0.96] tracking-[0.01em] text-tl-beige">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-xl font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/75 sm:mt-7 sm:text-base">
          {hero.subtitle}
        </p>
      </Reveal>

      {/* Scroll a Servicios — solo desktop */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block">
        <motion.button
          type="button"
          onClick={scrollToServicios}
          aria-label="Ir a servicios de asesoría"
          animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={
            reducedMotion
              ? undefined
              : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          }
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/35 text-tl-beige/80",
            "backdrop-blur-sm transition-colors duration-300",
            "hover:border-tl-gold/55 hover:bg-tl-gold/15 hover:text-tl-gold",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tl-gold/50",
          )}
        >
          <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
        </motion.button>
      </div>
    </section>
  );
}
