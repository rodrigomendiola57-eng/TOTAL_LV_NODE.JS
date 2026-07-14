"use client";

import { AsesoriaCompraPanel } from "@/components/asesoria/AsesoriaCompraPanel";
import { AsesoriaInversionPanel } from "@/components/asesoria/AsesoriaInversionPanel";
import { AsesoriaVentaPanel } from "@/components/asesoria/AsesoriaVentaPanel";
import GooeyNav from "@/components/ui/GooeyNav";
import { getSiteWhatsAppUrl } from "@/lib/whatsapp";
import type { AsesoriaTab } from "@/lib/data/asesoria";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileCheck,
  Handshake,
  LineChart,
  MapPin,
  MessageCircle,
  PiggyBank,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  FileCheck,
  Handshake,
  LineChart,
  Sparkles,
  Users,
  TrendingUp,
  Target,
  PiggyBank,
  MapPin,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles;
}

const panelEase = [0.22, 1, 0.36, 1] as const;

interface AsesoriaTabsProps {
  tabs: AsesoriaTab[];
}

export function AsesoriaTabs({ tabs }: AsesoriaTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = tabs[activeIndex] ?? tabs[0];

  const gooeyItems = useMemo(
    () => tabs.map((tab) => ({ label: tab.tabLabel })),
    [tabs],
  );

  if (!activeTab) return null;

  return (
    <div>
      <div className="flex justify-center overflow-visible py-2">
        <GooeyNav
          items={gooeyItems}
          initialActiveIndex={0}
          onChange={setActiveIndex}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: panelEase }}
          className="pt-10 sm:pt-12"
          role="tabpanel"
          aria-label={activeTab.tabLabel}
        >
          {activeTab.id === "compra" ? (
            <AsesoriaCompraPanel tab={activeTab} />
          ) : activeTab.id === "venta" ? (
            <AsesoriaVentaPanel tab={activeTab} />
          ) : activeTab.id === "inversion" ? (
            <AsesoriaInversionPanel tab={activeTab} />
          ) : (
            <DefaultServicePanel tab={activeTab} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DefaultServicePanel({ tab }: { tab: AsesoriaTab }) {
  return (
    <>
      <h3 className="font-outfit text-2xl font-extralight tracking-[0.02em] text-tl-beige sm:text-3xl">
        {tab.title}
      </h3>
      <p className="mt-3 max-w-2xl font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/70 sm:text-base">
        {tab.description}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {tab.features.map((feature) => {
          const Icon = resolveIcon(feature.icon);
          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-lg transition-colors duration-300 hover:border-tl-gold/35 sm:p-6"
            >
              <Icon className="h-5 w-5 text-tl-gold/80" strokeWidth={1.25} />
              <h4 className="mt-4 font-outfit text-[1.05rem] font-extralight tracking-[0.01em] text-tl-beige sm:text-lg">
                {feature.title}
              </h4>
              <p className="mt-2.5 font-outfit text-sm font-extralight leading-relaxed text-tl-beige/62">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      <a
        href={getSiteWhatsAppUrl(tab.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-9 inline-flex min-h-11 items-center gap-2 rounded-full border border-tl-gold/45 px-5 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-gold transition-colors hover:bg-tl-gold hover:text-tl-black"
      >
        <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
        Hablar de {tab.tabLabel.toLowerCase()}
      </a>
    </>
  );
}
