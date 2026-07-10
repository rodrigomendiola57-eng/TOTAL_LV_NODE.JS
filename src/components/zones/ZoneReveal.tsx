"use client";

import { useZoneScrollRoot } from "@/components/zones/zone-scroll-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
  y = 36,
}: ZoneRevealProps) {
  const scrollRoot = useZoneScrollRoot();

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: false,
        amount: 0.45,
        root: scrollRoot ?? undefined,
      }}
      transition={{ duration: 0.8, ease: revealEase, delay }}
    >
      {children}
    </motion.div>
  );
}
