"use client";

import { developmentWhatsAppUrl } from "@/components/developments/development-status";
import { formatPrice } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import { formatBathrooms, type DevelopmentModel } from "@/types/development";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bath,
  BedDouble,
  Car,
  Maximize2,
  MessageCircle,
  Ruler,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface DevelopmentModelsProps {
  models: DevelopmentModel[];
  developmentName: string;
  developmentSlug: string;
  zone: string;
  currency: string;
}

type ModelSpec = {
  icon: typeof BedDouble;
  value: string;
};

function buildSpecs(model: DevelopmentModel): ModelSpec[] {
  return [
    { icon: BedDouble, value: `${model.bedrooms} rec` },
    {
      icon: Bath,
      value: formatBathrooms(model.bathrooms, model.halfBathrooms),
    },
    { icon: Maximize2, value: `${model.areaM2} m²` },
    ...(model.lotM2
      ? [{ icon: Ruler, value: `${model.lotM2} m² terreno` }]
      : []),
    { icon: Car, value: `${model.parking} est.` },
  ];
}

/** Card de modelo — mismo diseño en móvil y desktop. */
function DevelopmentModelCard({
  model,
  href,
  waUrl,
  currency,
  className,
}: {
  model: DevelopmentModel;
  href: string;
  waUrl: string;
  currency: string;
  className?: string;
}) {
  const specs = buildSpecs(model);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-tl-gold/40",
        className,
      )}
    >
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden">
        <div
          className="h-full w-full scale-100 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-105"
          style={{ backgroundImage: `url('${model.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <p className="font-outfit text-xl font-light tracking-[0.06em] text-tl-beige">
            {model.name}
          </p>
          {model.available != null ? (
            <span className="rounded-full border border-tl-gold/40 bg-tl-black/45 px-2.5 py-1 font-outfit text-[9px] font-light uppercase tracking-[0.14em] text-tl-gold backdrop-blur-sm">
              {model.available} disponibles
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="font-outfit text-sm font-extralight leading-relaxed tracking-[0.01em] text-tl-beige/65">
          {model.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.06] pt-4 font-outfit text-[11px] font-light tracking-[0.02em] text-tl-beige/70">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <span key={spec.value} className="inline-flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-tl-gold/70" strokeWidth={1.5} />
                {spec.value}
              </span>
            );
          })}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45">
              Desde
            </p>
            <p className="font-outfit text-xl font-extralight tracking-[0.01em] text-tl-gold">
              {formatPrice(String(model.priceFrom), currency)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={href}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-tl-gold/45 px-4 py-2 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-gold transition-colors active:bg-tl-gold active:text-tl-black sm:hover:bg-tl-gold sm:hover:text-tl-black"
            >
              Ver modelo
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Cotizar por WhatsApp"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tl-gold/35 text-tl-gold transition-colors active:border-tl-gold active:bg-tl-gold/10 sm:hover:border-tl-gold sm:hover:bg-tl-gold/10"
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Carrusel horizontal — solo móvil. Cards sin cambio de diseño. */
function DevelopmentModelsCarousel({
  models,
  developmentName,
  developmentSlug,
  zone,
  currency,
}: DevelopmentModelsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();

  const syncActive = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>("[data-model-card]");
    if (!card) return;
    const gap = 14;
    const step = card.offsetWidth + gap;
    if (step <= 0) return;
    const index = Math.round(node.scrollLeft / step);
    setActive(Math.max(0, Math.min(models.length - 1, index)));
  }, [models.length]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    syncActive();
    node.addEventListener("scroll", syncActive, { passive: true });
    return () => node.removeEventListener("scroll", syncActive);
  }, [syncActive]);

  const scrollToIndex = (index: number) => {
    const node = scrollerRef.current;
    const card = node?.querySelectorAll<HTMLElement>("[data-model-card]")[index];
    card?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div className="sm:hidden">
      <div
        ref={scrollerRef}
        className={cn(
          "-mx-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-1",
          "scroll-smooth overscroll-x-contain",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        aria-roledescription="carousel"
        aria-label="Modelos disponibles"
      >
        {models.map((model, index) => {
          const href = `/propiedades/desarrollos/${developmentSlug}/modelos/${model.slug}`;
          const waUrl = developmentWhatsAppUrl(
            `${developmentName} — modelo ${model.name}`,
            zone,
          );
          const isActive = active === index;

          return (
            <motion.div
              key={model.id}
              data-model-card
              className="w-[min(86vw,22.5rem)] shrink-0 snap-center"
              animate={
                reducedMotion
                  ? undefined
                  : {
                      scale: isActive ? 1 : 0.94,
                      opacity: isActive ? 1 : 0.55,
                      y: isActive ? 0 : 6,
                    }
              }
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <DevelopmentModelCard
                model={model}
                href={href}
                waUrl={waUrl}
                currency={currency}
              />
            </motion.div>
          );
        })}
        <div className="w-2 shrink-0 snap-end" aria-hidden />
      </div>

      {models.length > 1 ? (
        <div
          className="mt-4 flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Modelos"
        >
          {models.map((model, index) => (
            <button
              key={model.id}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-label={`Modelo ${model.name}`}
              onClick={() => scrollToIndex(index)}
              className="relative h-1.5 overflow-hidden rounded-full"
            >
              <motion.span
                className="block h-full rounded-full bg-tl-gold"
                animate={{
                  width: active === index ? 20 : 6,
                  opacity: active === index ? 1 : 0.28,
                  backgroundColor:
                    active === index
                      ? "rgb(214, 181, 133)"
                      : "rgba(242, 236, 224, 0.35)",
                }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function DevelopmentModels({
  models,
  developmentName,
  developmentSlug,
  zone,
  currency,
}: DevelopmentModelsProps) {
  if (models.length === 0) return null;

  return (
    <>
      <DevelopmentModelsCarousel
        models={models}
        developmentName={developmentName}
        developmentSlug={developmentSlug}
        zone={zone}
        currency={currency}
      />

      <div className="hidden grid-cols-1 gap-5 sm:grid sm:grid-cols-2 sm:gap-6">
        {models.map((model) => {
          const href = `/propiedades/desarrollos/${developmentSlug}/modelos/${model.slug}`;
          const waUrl = developmentWhatsAppUrl(
            `${developmentName} — modelo ${model.name}`,
            zone,
          );

          return (
            <DevelopmentModelCard
              key={model.id}
              model={model}
              href={href}
              waUrl={waUrl}
              currency={currency}
            />
          );
        })}
      </div>
    </>
  );
}
