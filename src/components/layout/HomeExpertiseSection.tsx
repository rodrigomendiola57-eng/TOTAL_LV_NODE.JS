"use client";

import { useLiteMotion } from "@/hooks/use-lite-motion";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Building2,
  ChevronDown,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { HomeExpertiseSilkBackdrop } from "@/components/layout/HomeExpertiseSilkBackdrop";
import { cn } from "@/lib/utils";

type Service = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  Icon: LucideIcon;
};

type Pillar = {
  id: string;
  title: string;
  description: string;
  bentoClass: string;
};

const appleEase = [0.25, 0.1, 0.25, 1] as const;
const fadeEase = [0.22, 1, 0.36, 1] as const;

const defaultServices: Service[] = [
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

const defaultPillars: Pillar[] = [
  {
    id: "legal",
    title: "Seguridad Legal",
    description:
      "Blindamos cada operación con validación documental y acompañamiento jurídico experto.",
    bentoClass: "sm:col-span-2",
  },
  {
    id: "marketing",
    title: "Marketing Premium",
    description:
      "Narrativa visual de alto impacto y posicionamiento estratégico para acelerar cierres.",
    bentoClass: "sm:col-span-1",
  },
  {
    id: "trust",
    title: "Confianza Total",
    description:
      "Proceso transparente de punta a punta, con asesoría humana y seguimiento continuo.",
    bentoClass: "sm:col-span-1",
  },
];

function FadeInUp({
  children,
  className,
  delay = 0,
  reducedMotion,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  reducedMotion: boolean;
}) {
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: reducedMotion ? 0.35 : 0.75,
        ease: fadeEase,
        delay: reducedMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}

const ICON_MAP: Record<string, LucideIcon> = {
  UsersRound,
  BarChart3,
  Building2,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Building2;
}

function ServicesAccordion({
  reducedMotion,
  services,
}: {
  reducedMotion: boolean;
  services: Service[];
}) {
  const [activeId, setActiveId] = useState(services[0]?.id ?? "");

  return (
    <div className="border-t border-white/10">
      {services.map((service) => {
        const isOpen = activeId === service.id;

        return (
          <div key={service.id} className="border-b border-white/10">
            <button
              type="button"
              onClick={() => setActiveId(service.id)}
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-4 py-4 text-left transition-colors sm:py-5"
            >
              <span className="flex min-w-0 items-center gap-4">
                <service.Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors duration-300",
                    isOpen ? "text-tl-gold" : "text-tl-beige/35 group-hover:text-tl-beige/55",
                  )}
                  strokeWidth={1.25}
                />
                <span
                  className={cn(
                    "font-outfit text-lg font-extralight leading-snug tracking-[0.02em] transition-colors duration-300 sm:text-xl",
                    isOpen ? "text-tl-beige" : "text-tl-beige/55 group-hover:text-tl-beige/80",
                  )}
                >
                  {service.title}
                </span>
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.4, ease: appleEase }}
                className="shrink-0 text-tl-beige/40"
              >
                <ChevronDown className="h-4 w-4" strokeWidth={1.25} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.45, ease: appleEase },
                    opacity: { duration: 0.3, ease: appleEase },
                  }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 pt-0 sm:pb-6">
                    <p className="max-w-md font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/72">
                      {service.description}
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {service.bullets.map((bullet, index) => (
                        <motion.li
                          key={bullet}
                          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: reducedMotion ? 0 : 0.08 + index * 0.06,
                            duration: 0.4,
                            ease: fadeEase,
                          }}
                          className="flex items-start gap-3 font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/78"
                        >
                          <span className="mt-2.5 h-px w-3 shrink-0 bg-tl-gold/50" />
                          {bullet}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function PillarBentoCard({
  pillar,
  index,
  reducedMotion,
}: {
  pillar: Pillar;
  index: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        ease: fadeEase,
        delay: reducedMotion ? 0 : 0.12 + index * 0.1,
      }}
      whileHover={reducedMotion ? undefined : { y: -6 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-[border-color,box-shadow] duration-500 hover:border-tl-gold/35 hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)] sm:p-5",
        pillar.bentoClass,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-500 group-hover:via-tl-gold/40"
      />

      <h3 className="font-outfit text-xl font-extralight leading-snug tracking-[0.02em] text-tl-beige sm:text-2xl">
        {pillar.title}
      </h3>
      <p className="mt-3 font-outfit text-base font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/78 sm:mt-4 sm:text-lg">
        {pillar.description}
      </p>
    </motion.article>
  );
}

function ValuesBento({
  reducedMotion,
  pillars,
}: {
  reducedMotion: boolean;
  pillars: Pillar[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {pillars.map((pillar, index) => (
        <PillarBentoCard
          key={pillar.id}
          pillar={pillar}
          index={index}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}

export function HomeExpertiseSection({
  title = "Inteligencia Inmobiliaria para Decisiones Reales",
  subtitle = "Un solo equipo para asesorarte, analizar el mercado y ejecutar con el estándar premium que tu patrimonio merece.",
  services: servicesInput,
  pillars: pillarsInput,
}: {
  title?: string;
  subtitle?: string;
  services?: Array<{
    id: string;
    title: string;
    description: string;
    bullets: string[];
    icon: string;
  }>;
  pillars?: Array<{
    id: string;
    title: string;
    description: string;
    bentoClass: string;
  }>;
}) {
  const reducedMotion = useReducedMotion();
  const liteMotion = useLiteMotion();
  // Animaciones de UI ligeras en móvil; el fondo WebGL solo se apaga con reduced-motion.
  const disableMotion = Boolean(reducedMotion) || liteMotion;
  const silkReducedMotion = Boolean(reducedMotion);

  const services: Service[] =
    servicesInput?.map((service) => ({
      ...service,
      Icon: resolveIcon(service.icon),
    })) ?? defaultServices;

  const pillars: Pillar[] =
    pillarsInput?.map((pillar) => ({
      id: pillar.id,
      title: pillar.title,
      description: pillar.description,
      bentoClass: pillar.bentoClass,
    })) ?? defaultPillars;

  return (
    <section className="home-scroll-section relative w-full overflow-hidden">
      <HomeExpertiseSilkBackdrop reducedMotion={silkReducedMotion} />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-16 md:pt-20 lg:pb-24 lg:pt-24">
      <FadeInUp reducedMotion={disableMotion} className="w-full">
        <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-7 md:flex-row md:items-end md:justify-between md:gap-8 md:pb-8 lg:gap-10 xl:gap-14">
          <h2 className="text-fluid-h2 shrink-0 font-cormorant font-light leading-tight text-tl-beige md:max-w-[55%] lg:max-w-[52%] xl:max-w-[48%]">
            {title}
          </h2>
          <p className="max-w-xl font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/68 sm:text-base md:max-w-[42%] md:pb-0.5 md:text-right lg:max-w-md">
            {subtitle}
          </p>
        </div>
      </FadeInUp>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-10 lg:grid-cols-2 lg:gap-12 xl:gap-14">
        <FadeInUp reducedMotion={disableMotion} delay={0.06}>
          <ServicesAccordion reducedMotion={disableMotion} services={services} />
        </FadeInUp>

        <FadeInUp reducedMotion={disableMotion} delay={0.1}>
          <ValuesBento reducedMotion={disableMotion} pillars={pillars} />
        </FadeInUp>
      </div>
      </div>
    </section>
  );
}
