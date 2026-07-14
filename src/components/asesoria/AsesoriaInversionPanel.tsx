"use client";

import { AsesoriaInversionForm } from "@/components/asesoria/AsesoriaInversionForm";
import { getSiteWhatsAppUrl } from "@/lib/whatsapp";
import type {
  AsesoriaFeature,
  AsesoriaInvestmentMetric,
  AsesoriaOpportunityZone,
  AsesoriaTab,
} from "@/lib/data/asesoria";
import {
  DEFAULT_INVERSION_ZONE_ID,
  INVERSION_METRICS_DISCLAIMER,
  INVERSION_METRICS_DISCLAIMER_EN,
  INVERSION_ZONE_PROFILES,
  buildInvestmentMetrics,
  getInversionZoneProfile,
  toOpportunityZone,
  type InversionZoneProfile,
} from "@/lib/data/inversion-zone-metrics";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  MessageCircle,
  PiggyBank,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Target,
  PiggyBank,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? TrendingUp;
}

function Sparkline({ animateDraw }: { animateDraw: boolean }) {
  const path = "M1 21 L11 14.5 L21 17 L31 6.5 L41 10 L51 1.5";

  return (
    <svg
      viewBox="0 0 52 22"
      className="h-5 w-14 shrink-0 overflow-visible text-tl-gold/70"
      fill="none"
      aria-hidden
    >
      {animateDraw ? (
        <motion.path
          d={path}
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.4 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease, delay: 0.15 }}
        />
      ) : (
        <path
          d={path}
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function formatMetricValue(value: number, decimals = 0): string {
  return value.toFixed(decimals);
}

function MetricCounter({
  metric,
  animateCount,
}: {
  metric: AsesoriaInvestmentMetric;
  animateCount: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const displayRef = useRef(animateCount ? 0 : metric.value);
  const [display, setDisplay] = useState(animateCount ? 0 : metric.value);
  const hasAnimatedIn = useRef(false);

  useEffect(() => {
    if (!animateCount) {
      displayRef.current = metric.value;
      setDisplay(metric.value);
      return;
    }
    if (!inView) return;

    const isUpdate = hasAnimatedIn.current;
    const from = isUpdate ? displayRef.current : 0;
    hasAnimatedIn.current = true;

    const controls = animate(from, metric.value, {
      duration: isUpdate ? 0.7 : 1.5,
      ease,
      onUpdate: (v) => {
        displayRef.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [animateCount, inView, metric.value]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-outfit text-[2.5rem] font-extralight leading-none tracking-[0.01em] text-tl-gold sm:text-[2.75rem]">
        {metric.prefix}
        {formatMetricValue(display, metric.decimals)}
        {metric.suffix}
      </p>
      <p className="mx-auto mt-3 max-w-[16rem] font-outfit text-[11px] font-extralight leading-snug tracking-[0.04em] text-white/80">
        {metric.label}
      </p>
    </div>
  );
}

function OpportunityZoneCard({
  zone,
  index,
  animateBar,
  selected,
}: {
  zone: AsesoriaOpportunityZone;
  index: number;
  animateBar: boolean;
  selected?: boolean;
}) {
  const { locale } = useLocale();
  return (
    <motion.div
      initial={animateBar ? { opacity: 0, y: 22 } : false}
      whileInView={animateBar ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease, delay: 0.06 * index }}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-white/[0.03] p-6 sm:p-8 text-center",
        "transition-[border-color,background-color,box-shadow] duration-500",
        selected
          ? "border-tl-gold/50 bg-white/[0.06] shadow-[0_0_28px_rgba(214,181,133,0.1)]"
          : "border-white/10",
      )}
    >
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
        <h4 className="font-outfit text-2xl font-light tracking-[0.02em] text-white">
          {zone.name}
        </h4>
        <span className="shrink-0 font-outfit text-lg font-light uppercase tracking-[0.14em] text-white">
          {zone.roiLabel}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-center gap-3 font-outfit text-[11px] font-light uppercase tracking-[0.18em] text-white/90">
          <span>{locale === "en" ? "Demand pressure" : "Presión de demanda"}</span>
          <span className="font-normal text-white">{zone.demandScore}</span>
        </div>
        <div className="relative mx-auto mt-2 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/[0.08]">
          {animateBar ? (
            <motion.div
              className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-tl-gold/60 via-tl-gold to-tl-gold/90"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: zone.demandScore / 100 }}
              transition={{ duration: 0.9, ease, delay: 0.15 + 0.06 * index }}
              style={{ width: "100%" }}
            />
          ) : (
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-tl-gold/60 via-tl-gold to-tl-gold/90"
              style={{ width: `${zone.demandScore}%` }}
            />
          )}
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-xl font-outfit text-base font-light leading-relaxed tracking-[0.01em] text-white/95">
        {zone.note}
      </p>
    </motion.div>
  );
}

function ZoneRadarChips({
  zones,
  selectedId,
  onSelect,
}: {
  zones: InversionZoneProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Zonas de Querétaro"
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
    >
      {zones.map((zone) => {
        const selected = zone.id === selectedId;
        return (
          <button
            key={zone.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(zone.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 font-outfit text-[11px] font-light uppercase tracking-[0.14em] transition-colors duration-300 sm:px-4 sm:py-2 sm:text-xs",
              selected
                ? "border-tl-gold/55 bg-tl-gold/10 text-tl-gold"
                : "border-white/12 text-white/80 hover:border-white/25 hover:text-white/80",
            )}
          >
            {zone.shortName}
          </button>
        );
      })}
    </div>
  );
}

function InversionFeaturesStack({
  features,
  animateUi,
  stacked = false,
}: {
  features: AsesoriaFeature[];
  animateUi: boolean;
  /** Columna vertical (desktop junto al form). */
  stacked?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        stacked ? "grid-cols-1" : "sm:grid-cols-3 sm:gap-5",
      )}
    >
      {features.map((feature, index) => {
        const Icon = resolveIcon(feature.icon);

        return (
          <motion.div
            key={feature.title}
            initial={animateUi ? { opacity: 0, y: 26 } : false}
            whileInView={animateUi ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease, delay: 0.08 * index }}
            whileHover={animateUi ? { y: -5 } : undefined}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center backdrop-blur-lg sm:p-6",
              "transition-[border-color,background-color,box-shadow] duration-500",
              "hover:border-tl-gold/35 hover:bg-white/[0.05] hover:shadow-[0_0_28px_rgba(214,181,133,0.08)]",
              stacked && "lg:text-left",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 text-tl-gold/80",
                stacked ? "mx-auto lg:mx-0" : "mx-auto",
              )}
              strokeWidth={1.25}
            />
            <h4 className="mt-4 font-outfit text-[1.05rem] font-extralight tracking-[0.01em] text-white sm:text-lg">
              {feature.title}
            </h4>
            <p className="mt-2.5 font-outfit text-sm font-extralight leading-relaxed text-white/90">
              {feature.description}
            </p>
            <div
              className={cn(
                "mt-5 flex items-center gap-3 border-t border-white/[0.06] pt-4",
                stacked
                  ? "justify-center lg:justify-between"
                  : "justify-center",
              )}
            >
              <span className="font-outfit text-[9px] font-light uppercase tracking-[0.18em] text-white/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Sparkline animateDraw={animateUi} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function useSelectedInversionZone() {
  const { locale } = useLocale();
  const [selectedId, setSelectedId] = useState(DEFAULT_INVERSION_ZONE_ID);
  const profile =
    getInversionZoneProfile(selectedId) ?? INVERSION_ZONE_PROFILES[0]!;
  const metrics = buildInvestmentMetrics(profile, locale);
  const zoneCard = toOpportunityZone(profile, locale);

  return {
    selectedId,
    setSelectedId,
    profile,
    metrics,
    zoneCard,
    zones: INVERSION_ZONE_PROFILES,
  };
}

function InversionMobile({ tab }: { tab: AsesoriaTab }) {
  const { locale } = useLocale();
  const reducedMotion = useReducedMotion();
  const wa = getSiteWhatsAppUrl(tab.whatsappMessage);
  const { selectedId, setSelectedId, metrics, zoneCard, zones } =
    useSelectedInversionZone();

  function scrollToBrief() {
    document
      .getElementById("inversion-brief")
      ?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
  }

  return (
    <div className="flex w-full flex-col items-center gap-9 text-center">
      {/* 1. Intro */}
      <header className="w-full">
        <h3 className="font-outfit text-2xl font-extralight tracking-[0.02em] text-white">
          {tab.title}
        </h3>
        <p className="mx-auto mt-3 max-w-md font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-white/80">
          {tab.description}
        </p>
        <button
          type="button"
          onClick={scrollToBrief}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-tl-gold/45 px-5 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-gold transition-colors hover:bg-tl-gold/10"
        >
          Iniciar brief
        </button>
      </header>

      {/* 2. Radar + zonas */}
      <section className="w-full" aria-label="Radar de oportunidad">
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/85">
          {locale === "en" ? "Opportunity Radar · Querétaro" : "Radar de oportunidad · Querétaro"}
        </p>
        <div className="mt-4">
          <ZoneRadarChips
            zones={zones}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <p className="mx-auto mt-3 max-w-sm font-outfit text-[10px] font-extralight leading-relaxed text-white/60">
          {locale === "en" ? INVERSION_METRICS_DISCLAIMER_EN : INVERSION_METRICS_DISCLAIMER}
        </p>
      </section>

      {/* 3. KPIs — todos visibles, sin carrusel */}
      {metrics.length > 0 ? (
        <section
          className="grid w-full grid-cols-1 gap-0 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] px-5"
          aria-label="Indicadores de la zona"
        >
          {metrics.map((metric) => (
            <div key={`${selectedId}-${metric.id}`} className="py-6">
              <MetricCounter
                metric={metric}
                animateCount={!reducedMotion}
              />
            </div>
          ))}
        </section>
      ) : null}

      {/* 4. Detalle de zona */}
      <div className="w-full">
        <OpportunityZoneCard zone={zoneCard} index={0} animateBar={false} />
      </div>

      {/* 5. Formulario */}
      <div id="inversion-brief" className="w-full scroll-mt-24 text-left">
        <AsesoriaInversionForm />
      </div>

      {/* 6. Features — stack limpio, sin título */}
      {tab.features.length > 0 ? (
        <div className="w-full">
          <InversionFeaturesStack
            features={tab.features}
            animateUi={!reducedMotion}
            stacked
          />
        </div>
      ) : null}

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-tl-gold px-5 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-black transition-opacity hover:opacity-90"
      >
        <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
        {locale === "en" ? "Schedule a call" : "Agendar conversación"}
      </a>
    </div>
  );
}

function InversionDesktop({
  tab,
  animateUi,
}: {
  tab: AsesoriaTab;
  animateUi: boolean;
}) {
  const { locale } = useLocale();
  const { selectedId, setSelectedId, metrics, zoneCard, zones } =
    useSelectedInversionZone();

  return (
    <div className="flex flex-col items-center space-y-12 text-center sm:space-y-14">
      <header className="w-full">
        <h3 className="font-outfit text-2xl font-extralight tracking-[0.02em] text-white sm:text-3xl">
          {tab.title}
        </h3>
        <p className="mx-auto mt-3 max-w-2xl font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-white/80 sm:text-base">
          {tab.description}
        </p>
      </header>

      <div className="w-full">
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/85">
          {locale === "en" ? "Opportunity Radar · Querétaro" : "Radar de oportunidad · Querétaro"}
        </p>
        <div className="mt-5">
          <ZoneRadarChips
            zones={zones}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <p className="mx-auto mt-3 max-w-2xl font-outfit text-[10px] font-extralight leading-relaxed text-white/60">
          {locale === "en" ? INVERSION_METRICS_DISCLAIMER_EN : INVERSION_METRICS_DISCLAIMER}
        </p>
      </div>

      {metrics.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-8 divide-y divide-white/10 sm:grid-cols-3 sm:gap-6 sm:divide-y-0 sm:divide-x">
          {metrics.map((metric, index) => (
            <div
              key={metric.id}
              className={cn(
                "flex justify-center pt-6 first:pt-0 sm:pt-0",
                index > 0 && "sm:pl-6",
              )}
            >
              <MetricCounter metric={metric} animateCount={animateUi} />
            </div>
          ))}
        </div>
      ) : null}

      <div className="w-full max-w-xl">
        <OpportunityZoneCard
          zone={zoneCard}
          index={0}
          animateBar={animateUi}
          selected
        />
      </div>

      <div className="grid w-full grid-cols-1 items-start gap-8 text-left lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] lg:gap-10 xl:gap-12">
        <div className="min-w-0 self-start">
          <InversionFeaturesStack
            features={tab.features}
            animateUi={animateUi}
            stacked
          />
        </div>
        <div id="inversion-brief" className="min-w-0 self-start">
          <AsesoriaInversionForm />
        </div>
      </div>

      <a
        href={getSiteWhatsAppUrl(tab.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-tl-gold/45 px-5 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-gold transition-colors hover:bg-tl-gold hover:text-tl-black"
      >
        <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
        {locale === "en" ? "Talk about investment" : "Hablar de inversión"}
      </a>
    </div>
  );
}

interface AsesoriaInversionPanelProps {
  tab: AsesoriaTab;
}

export function AsesoriaInversionPanel({ tab }: AsesoriaInversionPanelProps) {
  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const animateUi = isDesktop && !reducedMotion;

  if (!isDesktop) {
    return <InversionMobile tab={tab} />;
  }

  return <InversionDesktop tab={tab} animateUi={animateUi} />;
}
