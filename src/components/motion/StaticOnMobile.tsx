"use client";

import { cn } from "@/lib/utils";
import { useLiteMotion } from "@/hooks/use-lite-motion";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface StaticOnMobileProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

/**
 * En móvil renderiza un div estático (sin IntersectionObserver ni animación).
 * En desktop conserva motion.div con las props recibidas.
 */
export function StaticOnMobile({
  children,
  className,
  initial,
  whileInView,
  viewport,
  transition,
  ...rest
}: StaticOnMobileProps) {
  const liteMotion = useLiteMotion();

  if (liteMotion) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function useMotionViewport(
  desktop: { once?: boolean; amount?: number },
  mobileAmount = 0.2,
) {
  const liteMotion = useLiteMotion();
  return liteMotion
    ? { once: true as const, amount: mobileAmount }
    : { once: desktop.once ?? false, amount: desktop.amount ?? 0.25 };
}
