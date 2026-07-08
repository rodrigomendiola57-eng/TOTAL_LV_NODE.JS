"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Building2, UsersRound } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

type Service = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  Icon: typeof UsersRound;
};

const services: Service[] = [
  {
    id: "asesoria",
    title: "Asesoría personalizada",
    description:
      "Alineamos objetivos patrimoniales, presupuesto y timing para construir una estrategia inmobiliaria a tu medida.",
    bullets: [
      "Perfil de inversión y estilo de vida",
      "Acompañamiento 1:1 durante todo el proceso",
      "Negociación táctica con enfoque en valor",
    ],
    Icon: UsersRound,
  },
  {
    id: "analisis",
    title: "Análisis de mercado",
    description:
      "Combinamos data local y lectura comercial para detectar oportunidades con mayor plusvalía y menor riesgo.",
    bullets: [
      "Comparables por zona y segmento",
      "Estimación de retorno y horizonte de salida",
      "Monitoreo de tendencia por micromercado",
    ],
    Icon: BarChart3,
  },
  {
    id: "cvr",
    title: "Compra, venta y renta",
    description:
      "Gestionamos el ciclo completo de la operación con ejecución premium en legal, marketing y cierre.",
    bullets: [
      "Estrategia de colocación de activos",
      "Filtrado y calificación de prospectos",
      "Cierre notarial con control documental",
    ],
    Icon: Building2,
  },
];

export function ServicesSection() {
  const [activeId, setActiveId] = useState<string>(services[0].id);
  const activeService = services.find((service) => service.id === activeId);

  if (!activeService) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
      <Reveal className="mb-8 sm:mb-10">
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-gold sm:text-xs sm:tracking-[0.25em]">
          Nuestros servicios
        </p>
        <h2 className="text-fluid-h2 mt-3 font-cormorant font-light text-tl-beige">
          Inteligencia Inmobiliaria para Decisiones Reales
        </h2>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-2.5 sm:space-y-3">
          {services.map((service) => {
            const isActive = service.id === activeId;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveId(service.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                  isActive
                    ? "border-tl-gold/70 bg-tl-gold/10"
                    : "border-white/10 bg-black/20 hover:border-tl-gold/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <service.Icon className="h-5 w-5 text-tl-gold" />
                  <span className="font-outfit font-light text-xs uppercase tracking-[0.12em] text-tl-beige sm:text-sm sm:tracking-[0.14em]">
                    {service.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={activeService.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-2xl border border-tl-gold/30 bg-black/30 p-5 sm:p-7"
          >
            <h3 className="font-cormorant text-3xl font-light text-tl-beige sm:text-4xl">
              {activeService.title}
            </h3>
            <p className="text-fluid-body mt-4 font-outfit font-light text-tl-beige/80">
              {activeService.description}
            </p>
            <ul className="mt-6 space-y-3 font-outfit font-light text-sm text-tl-beige/85">
              {activeService.bullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-tl-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
