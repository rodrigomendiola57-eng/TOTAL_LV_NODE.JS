"use client";

import {
  copyPropertyShareForInstagram,
  getPropertyEmailShareUrl,
  getPropertyFacebookShareUrl,
  getPropertyShareUrl,
  getPropertyWhatsAppShareUrl,
  shareProperty,
} from "@/lib/property-share";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";
import { Check, Copy, Mail, Share2, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

interface PropertyShareSheetProps {
  property: Property;
  open: boolean;
  onClose: () => void;
}

type ChannelId = "whatsapp" | "facebook" | "email" | "instagram" | "copy" | "more";

type ChannelIcon =
  | { kind: "lucide"; Icon: typeof Share2 }
  | { kind: "bi"; className: string };

export function PropertyShareSheet({
  property,
  open,
  onClose,
}: PropertyShareSheetProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 2200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  if (!mounted || !open) return null;

  async function handleChannel(id: ChannelId) {
    if (id === "whatsapp") {
      window.open(getPropertyWhatsAppShareUrl(property), "_blank", "noopener,noreferrer");
      onClose();
      return;
    }
    if (id === "facebook") {
      window.open(getPropertyFacebookShareUrl(property), "_blank", "noopener,noreferrer");
      onClose();
      return;
    }
    if (id === "email") {
      window.location.href = getPropertyEmailShareUrl(property);
      onClose();
      return;
    }
    if (id === "instagram") {
      const ok = await copyPropertyShareForInstagram(property);
      setFeedback(ok ? "Listo para pegar en Instagram" : "No se pudo copiar");
      return;
    }
    if (id === "copy") {
      try {
        await navigator.clipboard.writeText(getPropertyShareUrl(property));
        setFeedback("Enlace copiado");
      } catch {
        setFeedback("No se pudo copiar");
      }
      return;
    }
    if (id === "more") {
      const message = await shareProperty(property);
      if (message) setFeedback(message);
      else onClose();
    }
  }

  const channels: Array<{
    id: ChannelId;
    label: string;
    hint: string;
    icon: ChannelIcon;
  }> = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      hint: "Mensaje con foto al abrir el enlace",
      icon: { kind: "bi", className: "bi bi-whatsapp" },
    },
    {
      id: "facebook",
      label: "Facebook",
      hint: "Publicación con vista previa",
      icon: { kind: "bi", className: "bi bi-facebook" },
    },
    {
      id: "email",
      label: "Correo",
      hint: "Asunto y texto de Total Living",
      icon: { kind: "lucide", Icon: Mail },
    },
    {
      id: "instagram",
      label: "Instagram",
      hint: "Copia el mensaje para Stories o DM",
      icon: { kind: "bi", className: "bi bi-instagram" },
    },
    {
      id: "copy",
      label: "Copiar enlace",
      hint: "Para pegar donde quieras",
      icon: { kind: "lucide", Icon: Copy },
    },
    {
      id: "more",
      label: "Más opciones",
      hint: "Compartir del sistema (con foto si se puede)",
      icon: { kind: "lucide", Icon: Share2 },
    },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/65"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-t-[1.5rem] border border-tl-gold/20 bg-[#1a1a18] shadow-[0_-20px_80px_rgba(0,0,0,0.45)] sm:rounded-[1.5rem]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4">
          <div className="min-w-0">
            <p
              id={titleId}
              className="font-outfit text-[11px] font-light uppercase tracking-[0.18em] text-tl-gold"
            >
              Compartir propiedad
            </p>
            <p className="mt-1.5 line-clamp-2 font-outfit text-base font-extralight text-tl-beige">
              Mira esta propiedad en Total Living
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-tl-beige/70 transition-colors hover:border-tl-gold/30 hover:text-tl-gold"
            aria-label="Cerrar panel"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <ul className="max-h-[min(70vh,28rem)] space-y-1 overflow-y-auto px-3 py-3">
          {channels.map((channel) => (
            <li key={channel.id}>
              <button
                type="button"
                onClick={() => void handleChannel(channel.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                  "hover:bg-white/[0.04] active:bg-white/[0.06]",
                )}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-tl-gold/25 bg-tl-gold/8 text-tl-gold">
                  {channel.icon.kind === "lucide" ? (
                    <channel.icon.Icon className="h-4 w-4" strokeWidth={1.4} />
                  ) : (
                    <i className={cn(channel.icon.className, "text-[1.05rem] leading-none")} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-outfit text-sm font-light text-tl-beige">
                    {channel.label}
                  </span>
                  <span className="mt-0.5 block font-outfit text-[11px] font-light text-tl-beige/45">
                    {channel.hint}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {feedback ? (
          <p
            role="status"
            className="flex items-center justify-center gap-1.5 border-t border-white/8 px-4 py-3 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-gold"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
            {feedback}
          </p>
        ) : (
          <p className="border-t border-white/8 px-5 py-3 text-center font-outfit text-[10px] font-light leading-relaxed text-tl-beige/40">
            Al abrir el enlace, WhatsApp, Facebook y correo muestran la foto con
            diseño Total Living.
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}
