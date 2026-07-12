"use client";

import { useZoneScrollRoot } from "@/components/zones/zone-scroll-context";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const revealEase = [0.22, 1, 0.36, 1] as const;

interface ZoneRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
}

export function ZoneReveal({
  children,
  className,
  delay = 0,
  y = 18,
}: ZoneRevealProps) {
  const scrollRoot = useZoneScrollRoot();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      // Sin opacity:0 — evita el “botón fantasma” al scrollear.
      initial={{ opacity: 1, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.15,
        root: scrollRoot ?? undefined,
      }}
      transition={{ duration: 0.4, ease: revealEase, delay }}
    >
      {children}
    </motion.div>
  );
}
