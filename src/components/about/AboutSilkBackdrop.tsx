"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Silk = dynamic(
  () => import("@/components/ui/Silk").then((mod) => mod.Silk),
  { ssr: false },
);

/**
 * Fondo Silk de Nosotros / Inicio / desarrollos.
 * Mismo Silk en móvil y desktop (antes el fallback estático en móvil
 * era casi invisible sobre #1a1a18 y parecía que “no había background”).
 * Solo se sustituye por gradiente si el usuario pide reduced-motion.
 */
export function AboutSilkBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobilePerf, setMobilePerf] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia(
      "(max-width: 1023px), (pointer: coarse)",
    );

    const sync = () => {
      const reduced = motionQuery.matches;
      setReducedMotion(reduced);
      setMobilePerf(mobileQuery.matches);
      setPaused(reduced || document.hidden);
    };

    sync();
    motionQuery.addEventListener("change", sync);
    mobileQuery.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);

    return () => {
      motionQuery.removeEventListener("change", sync);
      mobileQuery.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  if (reducedMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#1a1a18]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(90,94,72,0.42),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1c1e18_0%,#1a1a18_38%,#141412_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121210]/35 via-transparent to-[#121210]/50" />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <Silk
        key={pathname}
        speed={5}
        scale={1.15}
        color="#5A5E48"
        noiseIntensity={1.5}
        rotation={0}
        paused={paused}
        dpr={mobilePerf ? 1 : [1, 1.25]}
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-[#121210]/28" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#121210]/40 via-transparent to-[#121210]/45" />
    </div>
  );
}
