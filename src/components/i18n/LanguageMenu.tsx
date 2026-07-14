"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/locales";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

type LanguageMenuProps = {
  /** Clases del botón disparador. */
  triggerClassName?: string;
  /** Alineación del panel. */
  align?: "left" | "right";
};

export function LanguageMenu({
  triggerClassName,
  align = "right",
}: LanguageMenuProps) {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function selectLocale(next: Locale) {
    setLocale(next);
    setOpen(false);
    router.refresh();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
        className={
          triggerClassName ??
          "group relative inline-flex items-center gap-1.5 py-2 font-outfit text-base font-extralight tracking-[0.02em] text-tl-beige/90 transition-colors hover:text-tl-gold xl:text-lg"
        }
      >
        Idioma
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200 xl:h-[1.125rem] xl:w-[1.125rem]",
            open && "rotate-180 text-tl-gold",
          )}
          strokeWidth={1.5}
        />
        {triggerClassName ? null : (
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-tl-gold transition-all duration-300 group-hover:w-full" />
        )}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id={listId}
            role="listbox"
            aria-label="Idioma"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className={cn(
              "absolute top-[calc(100%+0.4rem)] z-50 min-w-[7.5rem] rounded-xl border border-tl-gold/25 bg-[#141412]/98 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-md",
              align === "right" ? "right-0" : "left-0",
            )}
          >
            {(["es", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                role="option"
                aria-selected={locale === code}
                onClick={() => selectLocale(code)}
                className={cn(
                  "block w-full rounded-lg px-3 py-2.5 text-left font-outfit text-sm font-extralight transition-colors hover:bg-tl-gold/10 hover:text-tl-gold",
                  locale === code ? "text-tl-gold" : "text-tl-beige/85",
                )}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
