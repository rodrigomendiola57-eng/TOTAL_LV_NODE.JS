"use client";

import { BrandLogoAnimated } from "@/components/layout/BrandLogoAnimated";

interface MobileNavbarBarProps {
  open: boolean;
  onToggle: () => void;
  logoAnimationKey: string | number;
}

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
  if (open) return null;

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] md:hidden"
      aria-label="Navegación móvil"
    >
      <div
        className="pointer-events-auto mx-2 grid grid-cols-[2.25rem_1fr_2.25rem] items-center rounded-2xl border border-white/[0.07] bg-[rgba(22,22,20,0.18)] px-2 py-3 backdrop-blur-[6px]"
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
          wrapperClassName="flex min-w-0 justify-center"
          innerClassName="relative flex min-w-0 flex-nowrap items-center justify-center gap-1 overflow-hidden rounded-xl px-0.5 py-0.5"
          symbolClassName="relative h-[42px] w-auto shrink-0 object-contain"
          titleClassName="whitespace-nowrap font-cormorant text-[clamp(1.35rem,6.4vw,2rem)] font-light leading-none text-tl-beige"
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
      </div>
    </nav>
  );
}
