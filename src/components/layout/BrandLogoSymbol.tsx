"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Path exacto del isotipo (mismo que public/logo-symbol.svg). */
const LOGO_PATH =
  "M42.06 9.84999V39.3281L0.796482 50.4865L3.30934 54.317L20.8993 49.5705V112.607H23.2799V48.9043L40.2084 44.4077V112.607H48.0114V42.2426L64.2788 38.0791V112.607H139.796V107.278H72.2141V36.0805L86.8944 32.1668L87.688 98.0344H134.11V96.1192H90.3331L88.6138 0.60688L42.06 9.84999Z";

/**
 * Regiones de clip que cubren el isotipo sin huecos.
 * Cada una revela una “pieza” del mismo path (silueta idéntica al original).
 */
const LOGO_PIECES = [
  {
    id: "left-spur",
    clip: { x: 0, y: 8, width: 43, height: 48 },
    kind: "roof" as const,
    origin: "0% 50%",
  },
  {
    id: "roof",
    clip: { x: 40, y: 0, width: 50, height: 40 },
    kind: "roof" as const,
    origin: "50% 0%",
  },
  {
    id: "col-1",
    clip: { x: 19.5, y: 47, width: 5, height: 67 },
    kind: "column" as const,
    origin: "50% 100%",
  },
  {
    id: "col-2",
    clip: { x: 39, y: 41, width: 10.5, height: 73 },
    kind: "column" as const,
    origin: "50% 100%",
  },
  {
    id: "col-3",
    clip: { x: 63, y: 34, width: 11, height: 80 },
    kind: "column" as const,
    origin: "50% 100%",
  },
  {
    id: "base-arm",
    clip: { x: 71, y: 105.5, width: 70, height: 8 },
    kind: "horizontal" as const,
    origin: "0% 50%",
  },
  {
    id: "right-stem",
    clip: { x: 85.5, y: 0, width: 6.5, height: 99 },
    kind: "column" as const,
    origin: "50% 0%",
  },
  {
    id: "right-tip",
    clip: { x: 87, y: 95, width: 48, height: 4.5 },
    kind: "horizontal" as const,
    origin: "0% 50%",
  },
] as const;

const easeInOut = [0.42, 0, 0.58, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.05,
    },
  },
};

const roofVariants = {
  hidden: { opacity: 0, y: -14, scale: 0.82 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: easeInOut },
  },
};

const columnVariants = {
  hidden: { opacity: 0, scaleY: 0.12, y: 12 },
  visible: {
    opacity: 1,
    scaleY: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeInOut },
  },
};

const horizontalVariants = {
  hidden: { opacity: 0, scaleX: 0.15, x: -10 },
  visible: {
    opacity: 1,
    scaleX: 1,
    x: 0,
    transition: { duration: 0.5, ease: easeInOut },
  },
};

const fadeOnly = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: easeInOut },
  },
};

function variantsFor(
  kind: (typeof LOGO_PIECES)[number]["kind"],
  reduceMotion: boolean | null,
) {
  if (reduceMotion) return fadeOnly;
  if (kind === "roof") return roofVariants;
  if (kind === "horizontal") return horizontalVariants;
  return columnVariants;
}

interface BrandLogoSymbolProps {
  animationKey: string | number;
  className?: string;
}

export function BrandLogoSymbol({
  animationKey,
  className,
}: BrandLogoSymbolProps) {
  const reduceMotion = useReducedMotion();
  const clipNs = `tl-logo-${String(animationKey).replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  return (
    <motion.svg
      key={animationKey}
      viewBox="0 0 141 114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("h-[34px] w-auto shrink-0 sm:h-[39px]", className)}
      style={{ overflow: "visible" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <defs>
        {LOGO_PIECES.map((piece) => (
          <clipPath key={piece.id} id={`${clipNs}-${piece.id}`}>
            <rect
              x={piece.clip.x}
              y={piece.clip.y}
              width={piece.clip.width}
              height={piece.clip.height}
            />
          </clipPath>
        ))}
      </defs>

      {LOGO_PIECES.map((piece) => (
        <motion.g
          key={piece.id}
          variants={variantsFor(piece.kind, reduceMotion)}
          style={{
            transformBox: "fill-box",
            transformOrigin: piece.origin,
          }}
        >
          <rect
            x={piece.clip.x}
            y={piece.clip.y}
            width={piece.clip.width}
            height={piece.clip.height}
            fill="transparent"
          />
          <g clipPath={`url(#${clipNs}-${piece.id})`}>
            <path d={LOGO_PATH} fill="#F2ECE0" />
          </g>
        </motion.g>
      ))}
    </motion.svg>
  );
}
