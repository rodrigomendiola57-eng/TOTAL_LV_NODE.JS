"use client";

import { useLiteMotion } from "@/hooks/use-lite-motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const revealEase = [0.22, 1, 0.36, 1] as const;

type PhilosophyRevealVariant = "intro" | "card";

interface PhilosophyRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  variant?: PhilosophyRevealVariant;
}

/**
 * Filosofía: anima una sola vez al entrar (móvil y desktop) para no
 * re-disparar transforms al scrollear de ida y vuelta.
 */
export function PhilosophyReveal({
  children,
  className,
  delay = 0,
  y = 24,
  variant = "intro",
}: PhilosophyRevealProps) {
  const liteMotion = useLiteMotion();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  if (liteMotion) {
    const cardMotion = variant === "card";

    return (
      <motion.div
        className={cn(className)}
        initial={{ opacity: 0, y: cardMotion ? 14 : 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18, margin: "0px 0px -6% 0px" }}
        transition={{
          duration: cardMotion ? 0.48 : 0.4,
          ease: revealEase,
          delay: Math.min(delay, cardMotion ? 0.35 : 0.15),
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.75, ease: revealEase, delay }}
    >
      {children}
    </motion.div>
  );
}
