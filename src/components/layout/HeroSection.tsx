"use client";

import { HeroPropertySearch } from "@/components/layout/HeroPropertySearch";
import { Reveal } from "@/components/ui/Reveal";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";

const DEFAULT_BACKGROUND =
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop";

interface HeroSectionProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  backgroundUrl?: string | null;
}

export function HeroSection({
  eyebrow = "Real Estate Premium",
  title = "Total Living",
  subtitle = "Estrategia Real detrás de cada Propiedad",
  backgroundUrl,
}: HeroSectionProps) {
  const background = backgroundUrl ?? DEFAULT_BACKGROUND;

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden lg:min-h-[100dvh]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${background}')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/92" />

      <Reveal
        className={`relative z-10 mx-auto w-full max-w-6xl px-5 pb-10 text-center sm:px-6 sm:pb-14 ${HERO_CONTENT_OFFSET}`}
      >
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/90 sm:text-xs sm:tracking-[0.28em]">
          {eyebrow}
        </p>
        <h1 className="text-fluid-h1 mx-auto mt-5 max-w-[12ch] text-balance font-outfit font-extralight tracking-[0.02em] text-tl-beige sm:mt-6 sm:max-w-none">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-[22rem] font-outfit text-[10px] font-light uppercase leading-relaxed tracking-[0.14em] text-tl-beige/75 sm:mt-6 sm:max-w-2xl sm:text-base sm:tracking-[0.22em]">
          {subtitle}
        </p>

        <HeroPropertySearch />
      </Reveal>
    </section>
  );
}
