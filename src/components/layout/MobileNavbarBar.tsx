"use client";

import { BrandLogoAnimated } from "@/components/layout/BrandLogoAnimated";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface MobileNavbarBarProps {
  open: boolean;
  onToggle: () => void;
  logoAnimationKey: string | number;
}

const SCROLL_TOP_THRESHOLD = 8;
const SCROLL_DIRECTION_DELTA = 2;

function HamburgerIcon() {
  return (
    <span className="flex h-3.5 w-5 flex-col items-end justify-between" aria-hidden>
      <span className="h-px w-full bg-tl-beige/95" />
      <span className="h-px w-full bg-tl-beige/95" />
      <span className="h-px w-full bg-tl-beige/95" />
    </span>
  );
}

export function MobileNavbarBar({
  open,
  onToggle,
  logoAnimationKey,
}: MobileNavbarBarProps) {
  const [solid, setSolid] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= SCROLL_TOP_THRESHOLD) {
        setSolid(false);
      } else if (currentY < lastScrollY.current - SCROLL_DIRECTION_DELTA) {
        setSolid(false);
      } else if (currentY > lastScrollY.current + SCROLL_DIRECTION_DELTA) {
        setSolid(true);
      }

      lastScrollY.current = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (open) return null;

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] md:hidden"
      aria-label="Navegación móvil"
    >
      <motion.div
        animate={{
          backgroundColor: solid ? "rgba(74, 78, 56, 0.94)" : "rgba(74, 78, 56, 0)",
          borderColor: solid
            ? "rgba(214, 181, 133, 0.18)"
            : "rgba(255, 255, 255, 0.07)",
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="pointer-events-auto mx-2 grid grid-cols-[2.25rem_1fr_2.25rem] items-center rounded-2xl border px-2 py-3"
        style={{
          marginTop: "calc(0.65rem + env(safe-area-inset-top, 0px))",
          marginLeft: "calc(0.65rem + env(safe-area-inset-left, 0px))",
          marginRight: "calc(0.65rem + env(safe-area-inset-right, 0px))",
        }}
      >
        <div aria-hidden />

        <BrandLogoAnimated
          animationKey={logoAnimationKey}
          href="/#inicio"
          wrapperClassName="flex min-w-0 max-w-full justify-center overflow-visible"
          innerClassName="relative flex min-w-0 max-w-full flex-nowrap items-center justify-center gap-1 overflow-visible rounded-xl px-0.5 py-1"
          symbolClassName="relative h-8 w-auto shrink-0 sm:h-[42px]"
          titleClassName="min-w-0 whitespace-nowrap font-cormorant text-[clamp(1.15rem,5.2vw,1.85rem)] font-light leading-none text-tl-beige"
          animateLetterSpacingFrom="0.08em"
          animateLetterSpacingTo="0.02em"
          priority
        />

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center justify-self-end rounded-full transition-colors hover:bg-white/[0.04]"
          aria-label="Abrir menú"
          aria-expanded={false}
          aria-controls="staggered-menu-panel"
          onClick={onToggle}
        >
          <HamburgerIcon />
        </button>
      </motion.div>
    </nav>
  );
}
