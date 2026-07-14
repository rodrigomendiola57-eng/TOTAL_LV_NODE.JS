"use client";

import { AsesoriaVentaCapabilities } from "@/components/asesoria/AsesoriaVentaCapabilities";
import { AsesoriaVentaCapabilitiesMobile } from "@/components/asesoria/AsesoriaVentaCapabilitiesMobile";
import { AsesoriaVentaForm } from "@/components/asesoria/AsesoriaVentaForm";
import { AsesoriaVentaJourney } from "@/components/asesoria/AsesoriaVentaJourney";
import { AsesoriaVentaJourneyMobile } from "@/components/asesoria/AsesoriaVentaJourneyMobile";
import type { AsesoriaTab } from "@/lib/data/asesoria";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface AsesoriaVentaPanelProps {
  tab: AsesoriaTab;
}

/**
 * Submódulo Venta.
 * Móvil: título → cómo vendemos → form → ruta.
 * Desktop: título centrado → cómo vendemos → brief | ruta.
 */
export function AsesoriaVentaPanel({ tab }: AsesoriaVentaPanelProps) {
  const steps = tab.process ?? [];
  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  function scrollToBrief() {
    document.getElementById("venta-brief")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div className="space-y-10 sm:space-y-12 lg:space-y-16">
      <header className="text-center">
        <h3 className="font-outfit text-2xl font-extralight tracking-[0.02em] text-tl-beige sm:text-3xl">
          {tab.title}
        </h3>
        <p className="mx-auto mt-3 max-w-2xl font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/70 sm:text-base">
          {tab.description}
        </p>

        {!isDesktop ? (
          <button
            type="button"
            onClick={scrollToBrief}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-tl-gold/45 px-5 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-gold transition-colors hover:bg-tl-gold/10"
          >
            Iniciar brief
          </button>
        ) : null}
      </header>

      {!isDesktop ? (
        <div className="flex flex-col gap-10">
          <AsesoriaVentaCapabilitiesMobile features={tab.features} />
          <div id="venta-brief">
            <AsesoriaVentaForm />
          </div>
          {steps.length > 0 ? (
            <AsesoriaVentaJourneyMobile steps={steps} />
          ) : null}
        </div>
      ) : (
        <>
          <AsesoriaVentaCapabilities features={tab.features} />
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)] lg:gap-12 xl:gap-14">
            <div id="venta-brief">
              <AsesoriaVentaForm />
            </div>
            {steps.length > 0 ? <AsesoriaVentaJourney steps={steps} /> : null}
          </div>
        </>
      )}
    </div>
  );
}
