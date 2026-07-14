"use client";

import DotField from "@/components/ui/DotField";
import { useEffect, useState, type ReactNode } from "react";

interface AsesoriaDotBackdropProps {
  children: ReactNode;
}

const DOT_CSS = {
  backgroundImage:
    "radial-gradient(circle, #4e6719 1.35px, transparent 1.5px)",
  backgroundSize: "16px 16px",
} as const;

/**
 * Fondo de puntos en Servicios (Compra / Venta / Inversión).
 * - Desktop: DotField sticky (interactivo).
 * - Móvil: DotField sticky más ligero (misma paleta, menos densidad).
 * - reduced-motion: patrón CSS estático.
 */
export function AsesoriaDotBackdrop({ children }: AsesoriaDotBackdropProps) {
  const [mode, setMode] = useState<"pending" | "static" | "desktop" | "mobile">(
    "pending",
  );

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      if (mqMotion.matches) {
        setMode("static");
        return;
      }
      setMode(mqDesktop.matches ? "desktop" : "mobile");
    };

    sync();
    mqDesktop.addEventListener("change", sync);
    mqMotion.addEventListener("change", sync);
    return () => {
      mqDesktop.removeEventListener("change", sync);
      mqMotion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className="relative isolate bg-[#1a1a18]">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {mode === "desktop" ? (
          <div className="sticky top-0 h-[100svh] w-full lg:h-[100dvh]">
            <DotField
              dotRadius={2.4}
              dotSpacing={14}
              cursorRadius={150}
              cursorForce={0}
              bulgeOnly
              bulgeStrength={50}
              glowRadius={120}
              sparkle={false}
              waveAmplitude={0}
              gradientFrom="#4e6719"
              gradientTo="#3f511b"
              glowColor="#000000"
            />
          </div>
        ) : null}

        {mode === "mobile" ? (
          <div className="sticky top-0 h-[100svh] w-full">
            <DotField
              dotRadius={2.2}
              dotSpacing={18}
              cursorRadius={100}
              cursorForce={0}
              bulgeOnly
              bulgeStrength={28}
              glowRadius={80}
              sparkle={false}
              waveAmplitude={0}
              gradientFrom="#4e6719"
              gradientTo="#3f511b"
              glowColor="#000000"
            />
          </div>
        ) : null}

        {mode === "static" || mode === "pending" ? (
          <div
            className="absolute inset-0 opacity-70"
            style={DOT_CSS}
          />
        ) : null}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
