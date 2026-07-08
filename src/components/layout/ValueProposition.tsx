"use client";

import { BriefcaseBusiness, Scale, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  {
    title: "Seguridad Legal",
    description:
      "Blindamos cada operación con validación documental y acompañamiento jurídico experto.",
    Icon: Scale,
  },
  {
    title: "Marketing Premium",
    description:
      "Narrativa visual de alto impacto y posicionamiento estratégico para acelerar cierres.",
    Icon: BriefcaseBusiness,
  },
  {
    title: "Confianza Total",
    description:
      "Proceso transparente de punta a punta, con asesoría humana y seguimiento continuo.",
    Icon: ShieldCheck,
  },
];

export function ValueProposition() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
      <Reveal className="mb-8 sm:mb-10">
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-gold sm:text-xs sm:tracking-[0.25em]">
          Por qué elegir Total Living
        </p>
        <h2 className="text-fluid-h2 mt-3 font-cormorant font-light text-tl-beige">
          Experiencia Inmobiliaria de Alto Nivel
        </h2>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-12">
        {pillars.map((pillar, index) => (
          <Reveal
            key={pillar.title}
            delay={index * 0.12}
            className={`rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6 ${
              index === 0 ? "md:col-span-7" : "md:col-span-5"
            } ${index === 2 ? "md:col-span-12" : ""}`}
          >
            <pillar.Icon className="h-5 w-5 text-tl-gold" />
            <h3 className="mt-4 font-cormorant text-[1.9rem] font-light text-tl-beige sm:text-3xl">
              {pillar.title}
            </h3>
            <p className="mt-3 max-w-2xl font-outfit font-light text-sm text-tl-beige/80">
              {pillar.description}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
