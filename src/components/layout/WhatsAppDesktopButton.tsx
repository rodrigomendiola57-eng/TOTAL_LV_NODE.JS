"use client";

import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { getSiteWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * CTA WhatsApp flotante.
 * - Desktop: pill grande (icono + texto).
 * - Móvil: solo logo en círculo.
 * Se oculta sobre heroes/carruseles; en móvil se eleva sobre chips de zonas.
 */
export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const hideOnRoute =
    pathname === "/contacto" ||
    pathname === "/zonas" ||
    pathname.startsWith("/zonas/") ||
    pathname === "/nosotros" ||
    pathname.startsWith("/nosotros/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/dashboard");

  useEffect(() => {
    if (hideOnRoute) return;

    const mediaSelector = "[data-tl-media-hero]";

    const measure = () => {
      const nodes = document.querySelectorAll(mediaSelector);
      if (nodes.length === 0) {
        setVisible(true);
        return;
      }

      const vh = window.innerHeight || 1;
      let mediaBlocking = false;

      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        if (visiblePx > vh * 0.4) mediaBlocking = true;
      });

      setVisible(!mediaBlocking);
    };

    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    update();

    const scrollRoots = new Set<EventTarget>();
    scrollRoots.add(window);
    document.querySelectorAll("main.snap-y").forEach((el) => scrollRoots.add(el));

    scrollRoots.forEach((root) => {
      root.addEventListener("scroll", update, { passive: true });
    });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      scrollRoots.forEach((root) => {
        root.removeEventListener("scroll", update);
      });
      window.removeEventListener("resize", update);
    };
  }, [hideOnRoute, pathname]);

  if (hideOnRoute) return null;

  const href = getSiteWhatsAppUrl(
    "Hola, me interesa conocer más sobre Total Living.",
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      onClick={(event) => {
        // Asegura apertura aunque algún overlay intercepte el navegación nativa.
        event.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
      className={cn(
        "fixed z-[90]",
        "bottom-5 right-7 max-lg:mb-[env(safe-area-inset-bottom,0px)]",
        "lg:bottom-8 lg:right-7 lg:mb-0",
        "inline-flex items-center justify-center",
        "border border-white/12 bg-black/60 text-tl-beige backdrop-blur-xl",
        "shadow-[0_16px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(37,211,102,0.12)]",
        "transition-[opacity,transform,border-color,background-color,box-shadow] duration-300 ease-out",
        "hover:border-[#25D366]/50 hover:bg-black/75 hover:shadow-[0_18px_48px_rgba(0,0,0,0.45),0_0_24px_rgba(37,211,102,0.18)]",
        "active:scale-[0.97]",
        "h-14 w-14 rounded-full",
        "lg:h-auto lg:w-auto lg:gap-3 lg:rounded-full lg:px-5 lg:py-3.5",
        "lg:font-outfit lg:text-xs lg:font-light lg:uppercase lg:tracking-[0.18em]",
        // Solo UNA clase pointer-events: cn() no hace merge de Tailwind.
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <span className="relative inline-flex h-7 w-7 items-center justify-center lg:h-6 lg:w-6">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#25D366]/20 blur-[6px] lg:blur-[5px]"
        />
        <WhatsAppIcon className="relative h-7 w-7 text-[#25D366] lg:h-5 lg:w-5" />
      </span>
      <span className="hidden lg:inline">WhatsApp</span>
    </a>
  );
}

/** @deprecated Usar WhatsAppFloatingButton */
export const WhatsAppDesktopButton = WhatsAppFloatingButton;
