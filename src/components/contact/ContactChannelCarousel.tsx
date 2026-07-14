"use client";

import {
  contactHint,
  contactLabel,
  contactValue,
} from "@/components/contact/contact-typography";
import type { ContactChannelItem } from "@/components/contact/ContactChannelList";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface ContactChannelCarouselProps {
  channels: readonly ContactChannelItem[];
  className?: string;
}

function defaultChannelIndex(channels: readonly ContactChannelItem[]) {
  const whatsappIndex = channels.findIndex((channel) => channel.id === "whatsapp");
  return whatsappIndex >= 0 ? whatsappIndex : 0;
}

/**
 * Carrusel horizontal de canales — solo pensado para móvil.
 * Cards compactas, snap, peek del siguiente.
 * Al cargar, el canal activo es WhatsApp.
 */
export function ContactChannelCarousel({
  channels,
  className,
}: ContactChannelCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(() => defaultChannelIndex(channels));

  const syncActive = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>("[data-channel-card]");
    if (!card) return;
    const gap = 12;
    const step = card.offsetWidth + gap;
    const index = Math.round(node.scrollLeft / step);
    setActive(Math.max(0, Math.min(channels.length - 1, index)));
  }, [channels.length]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const node = scrollerRef.current;
      const card = node?.querySelectorAll<HTMLElement>("[data-channel-card]")[index];
      card?.scrollIntoView({ behavior, inline: "center", block: "nearest" });
    },
    [],
  );

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const initial = defaultChannelIndex(channels);
    scrollToIndex(initial, "auto");
    setActive(initial);
    syncActive();
    node.addEventListener("scroll", syncActive, { passive: true });
    return () => node.removeEventListener("scroll", syncActive);
  }, [channels, scrollToIndex, syncActive]);

  return (
    <div className={cn("space-y-3", className)}>
      <div
        ref={scrollerRef}
        className={cn(
          "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1",
          "scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {channels.map((channel) => {
          const isExternal =
            channel.href.startsWith("http") || channel.href.startsWith("mailto:");

          const cardClass = cn(
            "flex w-[min(78vw,17.5rem)] shrink-0 snap-center flex-col gap-2.5 rounded-2xl border border-white/10 bg-black/25 px-4 py-4",
            "transition-colors active:border-tl-gold/35 active:bg-black/35",
          );

          const body = (
            <>
              <p
                className={cn(
                  contactLabel,
                  "text-sm tracking-[0.12em] sm:text-[0.9375rem]",
                )}
              >
                {channel.label}
              </p>
              <p
                className={cn(
                  contactValue,
                  "text-[1.125rem] leading-snug break-words [overflow-wrap:anywhere] sm:text-[1.2rem]",
                )}
              >
                {channel.value}
              </p>
              <p className={cn(contactHint, "text-sm line-clamp-1 sm:text-[0.9375rem]")}>
                {channel.hint}
              </p>
            </>
          );

          if (isExternal) {
            return (
              <a
                key={channel.id}
                data-channel-card
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {body}
              </a>
            );
          }

          return (
            <Link
              key={channel.id}
              data-channel-card
              href={channel.href}
              className={cardClass}
            >
              {body}
            </Link>
          );
        })}
        {/* Espacio final para que la última card pueda centrarse un poco */}
        <div className="w-2 shrink-0 snap-end" aria-hidden />
      </div>

      <div
        className="flex items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Canales de contacto"
      >
        {channels.map((channel, index) => (
          <button
            key={channel.id}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-label={channel.label}
            onClick={() => scrollToIndex(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              active === index ? "w-5 bg-tl-gold" : "w-1.5 bg-tl-beige/25",
            )}
          />
        ))}
      </div>
    </div>
  );
}
