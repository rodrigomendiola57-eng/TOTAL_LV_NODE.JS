"use client";

import { LanguageMenu } from "@/components/i18n/LanguageMenu";
import { BrandLogoAnimated } from "@/components/layout/BrandLogoAnimated";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface CompactNavbarBarProps {
  open: boolean;
  onOpenMenu: () => void;
  logoAnimationKey: string | number;
}

const SCROLL_TOP_THRESHOLD = 8;
const SCROLL_DIRECTION_DELTA = 2;

function HamburgerIcon() {
  return (
    <span className="flex h-3.5 w-[1.15rem] flex-col items-end justify-between" aria-hidden>
      <span className="h-px w-full bg-tl-beige/95" />
      <span className="h-px w-full bg-tl-beige/95" />
      <span className="h-px w-[70%] bg-tl-beige/95" />
    </span>
  );
}

/**
 * Barra compacta para teléfono + tablet/iPad (< xl).
 * - Teléfono: logo centrado + hamburguesa
 * - Tablet/iPad: Contacto + Idioma | logo | hamburguesa
 */
export function CompactNavbarBar({
  open,
  onOpenMenu,
  logoAnimationKey,
}: CompactNavbarBarProps) {
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

  // Con menú abierto la barra se oculta; el cierre vive en el overlay.
  if (open) return null;

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] lg:hidden"
      aria-label="Navegación"
    >
      <motion.div
        animate={{
          backgroundColor: solid
            ? "rgba(74, 78, 56, 0.94)"
            : "rgba(74, 78, 56, 0)",
          borderColor: solid
            ? "rgba(214, 181, 133, 0.18)"
            : "rgba(255, 255, 255, 0.07)",
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="pointer-events-auto mx-2 flex h-14 items-center justify-between gap-2 rounded-2xl border px-2.5 sm:px-3 md:h-[3.75rem] md:px-5"
        style={{
          marginTop: "calc(0.65rem + env(safe-area-inset-top, 0px))",
          marginLeft: "calc(0.65rem + env(safe-area-inset-left, 0px))",
          marginRight: "calc(0.65rem + env(safe-area-inset-right, 0px))",
        }}
      >
        {/* Izquierda: vacío en teléfono; Contacto + Idioma en tablet */}
        <div className="flex h-full min-w-0 flex-1 items-center justify-start gap-1.5 md:gap-2">
          <Link
            href="/contacto"
            className="hidden h-10 shrink-0 items-center rounded-full border border-tl-gold/60 px-3.5 font-outfit text-[10px] font-extralight uppercase tracking-[0.14em] text-tl-beige transition-colors hover:bg-tl-gold/10 md:inline-flex md:px-4 md:text-[11px]"
          >
            Contacto
          </Link>
          <div className="hidden md:block">
            <LanguageMenu
              align="left"
              triggerClassName="inline-flex h-10 items-center gap-1 rounded-full px-2.5 font-outfit text-[11px] font-extralight uppercase tracking-[0.14em] text-tl-beige/85 transition-colors hover:text-tl-gold"
            />
          </div>
        </div>

        <BrandLogoAnimated
          animationKey={logoAnimationKey}
          href="/#inicio"
          wrapperClassName="flex h-full min-w-0 shrink-0 items-center justify-center overflow-visible"
          innerClassName="relative flex min-w-0 max-w-full flex-nowrap items-center justify-center gap-1.5 overflow-visible rounded-xl px-0.5 md:gap-2"
          symbolClassName="relative w-auto shrink-0 opacity-95"
          titleClassName="min-w-0 whitespace-nowrap font-cormorant text-[clamp(1.1rem,3.8vw,1.55rem)] font-light leading-none text-tl-beige md:text-[clamp(1.25rem,2.2vw,1.6rem)]"
          animateLetterSpacingFrom="0.06em"
          animateLetterSpacingTo="0.02em"
          priority
        />

        <div className="flex h-full flex-1 items-center justify-end">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/[0.05]"
            aria-label="Abrir menú"
            aria-expanded={false}
            aria-controls="staggered-menu-panel"
            onClick={onOpenMenu}
          >
            <HamburgerIcon />
          </button>
        </div>
      </motion.div>
    </nav>
  );
}

/** @deprecated Prefer CompactNavbarBar */
export function MobileNavbarBar({
  open,
  onToggle,
  logoAnimationKey,
}: {
  open: boolean;
  onToggle: () => void;
  logoAnimationKey: string | number;
}) {
  return (
    <CompactNavbarBar
      open={open}
      onOpenMenu={onToggle}
      logoAnimationKey={logoAnimationKey}
    />
  );
}
