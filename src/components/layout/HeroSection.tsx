"use client";

import { Reveal } from "@/components/ui/Reveal";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/90" />

      <Reveal
        className={`relative z-10 mx-auto w-full max-w-5xl px-5 text-center sm:px-6 ${HERO_CONTENT_OFFSET}`}
      >
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/90 sm:text-xs sm:tracking-[0.28em]">
          Real Estate Premium
        </p>
        <h1 className="text-fluid-h1 mx-auto mt-5 max-w-[12ch] text-balance font-outfit font-extralight tracking-[0.02em] text-tl-beige sm:mt-6 sm:max-w-none">
          Total Living
        </h1>
        <p className="mx-auto mt-4 max-w-[22rem] font-outfit text-[10px] font-light uppercase leading-relaxed tracking-[0.14em] text-tl-beige/75 sm:mt-6 sm:max-w-2xl sm:text-base sm:tracking-[0.22em]">
          Estrategia Real detrás de cada Propiedad
        </p>
      </Reveal>
    </section>
  );
}
