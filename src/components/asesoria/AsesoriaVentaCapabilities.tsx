"use client";

import { LogoFabricBackdrop } from "@/components/ui/LogoFabricBackdrop";
import type { AsesoriaFeature } from "@/lib/data/asesoria";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const HIGHLIGHT_MS = 2800;
const ease = [0.16, 1, 0.3, 1] as const;

interface AsesoriaVentaCapabilitiesProps {
  features: AsesoriaFeature[];
}

/**
 * Franja de capacidades — desktop (ciclo de resaltado).
 * Móvil: ver AsesoriaVentaCapabilitiesMobile.
 */
export function AsesoriaVentaCapabilities({
  features,
}: AsesoriaVentaCapabilitiesProps) {
  const reducedMotion = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const loop = desktop && !reducedMotion && inView && features.length > 0;

  useEffect(() => {
    if (!loop) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % features.length);
    }, HIGHLIGHT_MS);
    return () => window.clearInterval(id);
  }, [loop, features.length]);

  const progress =
    features.length <= 1 ? 1 : (active + 1) / features.length;

  return (
    <motion.div
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ amount: 0.35 }}
    >
      <div className="flex items-end justify-between gap-4">
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/85">
          Cómo vendemos
        </p>
        {loop ? (
          <p className="hidden font-outfit text-[10px] font-extralight tracking-[0.14em] text-tl-beige/35 lg:block">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(features.length).padStart(2, "0")}
          </p>
        ) : null}
      </div>

      {loop ? (
        <div
          aria-hidden
          className="relative mt-4 hidden h-px overflow-hidden bg-white/10 lg:block"
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-tl-gold/70"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.65, ease }}
          />
        </div>
      ) : (
        <div aria-hidden className="mt-4 hidden h-px bg-white/10 lg:block" />
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {features.map((feature, index) => {
          const isActive = loop ? index === active : false;

          return (
            <li
              key={feature.title}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10 bg-[#161614] px-6 py-6 transition-all duration-500",
                "lg:min-h-[14rem]",
                isActive
                  ? "lg:border-tl-gold/40 lg:shadow-[0_0_32px_rgba(214,181,133,0.08)]"
                  : "lg:opacity-70 lg:hover:opacity-100",
              )}
            >
              <LogoFabricBackdrop isActive={isActive || !loop} />
              <div className="relative z-[1]">
                <span className="font-outfit text-3xl font-extralight tracking-[0.04em] text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h4 className="mt-5 text-center font-outfit text-lg font-extralight tracking-[0.01em] text-white">
                  {feature.title}
                </h4>
                <p className="mt-3 text-center font-outfit text-[15px] font-extralight leading-relaxed text-white/85">
                  {feature.description}
                </p>
                {feature.detail ? (
                  <p
                    className={cn(
                      "mt-4 hidden text-center font-outfit text-[10px] font-extralight tracking-[0.08em] text-white/55 transition-opacity duration-500 lg:block",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {feature.detail}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
