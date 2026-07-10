import { PhilosophyReveal } from "@/components/about/PhilosophyReveal";
import {
  ABOUT_CONTAINER,
  ABOUT_SECTION_SHELL,
} from "@/lib/about-layout";
import type { CompanyProfile, PhilosophyPillar } from "@/types/company";

interface AboutPhilosophySectionProps {
  philosophy: CompanyProfile["philosophy"];
}

function PhilosophyPillarCard({
  pillar,
  index,
}: {
  pillar: PhilosophyPillar;
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <PhilosophyReveal delay={index * 0.06} variant="card">
      <article
        className={`group relative flex gap-3 sm:gap-4 ${
          isEven ? "lg:flex-row" : "lg:flex-row-reverse lg:text-right"
        }`}
      >
        <div
          className={`flex shrink-0 flex-col items-center ${
            isEven ? "lg:items-start" : "lg:items-end"
          }`}
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-tl-gold/35 bg-gradient-to-br from-tl-gold/20 to-tl-gold/[0.04] font-outfit text-lg font-extralight tracking-[0.02em] text-tl-gold shadow-[0_0_32px_-12px_rgba(214,181,133,0.4)] sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">
            {pillar.letter}
            <div
              aria-hidden
              className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 sm:rounded-2xl"
            />
          </div>
          {index < 4 ? (
            <div
              aria-hidden
              className="mt-2 hidden h-full min-h-[1.75rem] w-px bg-gradient-to-b from-tl-gold/40 to-transparent lg:block"
            />
          ) : null}
        </div>

        <div
          className={`min-w-0 flex-1 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5 transition-[border-color,background-color,transform] duration-300 active:border-tl-gold/25 sm:rounded-2xl sm:px-4 sm:py-4 sm:backdrop-blur-[2px] lg:group-hover:border-tl-gold/25 lg:group-hover:bg-white/[0.04] ${
            isEven ? "lg:mt-1" : "lg:mt-1 lg:ml-auto lg:max-w-sm"
          }`}
        >
          <p className="font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-gold/85">
            {String(index + 1).padStart(2, "0")} · {pillar.letter}
          </p>
          <h3 className="mt-1 font-outfit text-base font-extralight leading-snug tracking-[0.01em] text-tl-beige sm:text-xl">
            {pillar.title}
          </h3>
          <p className="mt-2 font-outfit text-sm font-light leading-relaxed tracking-[0.02em] text-tl-beige/60 sm:text-xs">
            {pillar.description}
          </p>
        </div>
      </article>
    </PhilosophyReveal>
  );
}

export function AboutPhilosophySection({ philosophy }: AboutPhilosophySectionProps) {
  const acronym = philosophy.pillars.map((p) => p.letter).join("");

  return (
    <section id="filosofia" className={ABOUT_SECTION_SHELL}>
      <div className={`relative ${ABOUT_CONTAINER}`}>
        <div
          aria-hidden
          className="pointer-events-none absolute -left-2 top-6 hidden select-none font-outfit text-[clamp(5rem,16vw,11rem)] font-extralight leading-none tracking-[-0.04em] text-white/[0.025] sm:block sm:-left-2 sm:top-8"
        >
          {acronym}
        </div>

        <div className="relative flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-14">
          <div className="lg:sticky lg:top-[calc(7.5rem+env(safe-area-inset-top,0px))] lg:w-[min(100%,26rem)] lg:shrink-0 xl:w-[min(100%,28rem)]">
            <PhilosophyReveal delay={0.05}>
              <p className="font-outfit text-[10px] font-light uppercase tracking-[0.24em] text-tl-gold sm:text-xs sm:tracking-[0.32em]">
                {philosophy.title}
              </p>
              <h2 className="mt-2.5 font-outfit text-[clamp(1.55rem,6.5vw,2.75rem)] font-extralight leading-[1.1] tracking-[0.01em] text-tl-beige sm:mt-3">
                {philosophy.subtitle}
              </h2>
            </PhilosophyReveal>

            <PhilosophyReveal delay={0.1}>
              <div className="mt-6 space-y-3 border-l border-tl-gold/30 pl-5 sm:mt-8 sm:space-y-4 sm:pl-6">
                {philosophy.introLines.map((line) => (
                  <p
                    key={line}
                    className="font-outfit text-lg font-extralight leading-snug tracking-[0.02em] text-tl-beige/90 sm:text-2xl"
                  >
                    {line}
                  </p>
                ))}
                <p className="font-outfit text-xl font-extralight leading-snug tracking-[0.02em] text-tl-gold sm:text-3xl">
                  {philosophy.methodClosing}
                </p>
              </div>
            </PhilosophyReveal>

            <PhilosophyReveal delay={0.14}>
              <p className="mt-6 max-w-md font-outfit text-sm font-light leading-relaxed tracking-[0.02em] text-tl-beige/55 sm:mt-8">
                Cada letra de TOTAL es un compromiso operativo — no un adorno de
                marketing. Así evaluamos propiedades, procesos y relaciones.
              </p>
            </PhilosophyReveal>
          </div>

          <div className="relative min-w-0 flex-1 space-y-3 sm:space-y-5">
            <div
              aria-hidden
              className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-tl-gold/25 via-tl-gold/10 to-transparent lg:left-6 lg:block"
            />
            {philosophy.pillars.map((pillar, index) => (
              <PhilosophyPillarCard
                key={pillar.id}
                pillar={pillar}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
