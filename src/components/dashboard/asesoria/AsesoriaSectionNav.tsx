"use client";

import { cn } from "@/lib/utils";
import type { AsesoriaDashboardSectionId } from "@/types/asesoria-page";

export const ASESORIA_SECTIONS: {
  id: AsesoriaDashboardSectionId;
  label: string;
  description: string;
}[] = [
  {
    id: "hero",
    label: "Hero",
    description: "Portada y título de servicios.",
  },
  {
    id: "compra",
    label: "Compra",
    description: "Textos, proceso y cards del submódulo.",
  },
  {
    id: "venta",
    label: "Venta",
    description: "Textos, proceso y cards del submódulo.",
  },
  {
    id: "inversion",
    label: "Inversión",
    description: "Textos y cards del submódulo.",
  },
  {
    id: "enfoque",
    label: "Enfoque",
    description: "Pilares del timeline.",
  },
  {
    id: "cta",
    label: "CTA",
    description: "Llamado a la acción y WhatsApp.",
  },
];

interface AsesoriaSectionNavProps {
  active: AsesoriaDashboardSectionId;
  onChange: (section: AsesoriaDashboardSectionId) => void;
}

export function AsesoriaSectionNav({
  active,
  onChange,
}: AsesoriaSectionNavProps) {
  return (
    <nav className="flex flex-wrap gap-2">
      {ASESORIA_SECTIONS.map((section) => {
        const isActive = section.id === active;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onChange(section.id)}
            className={cn(
              "rounded-full border px-4 py-2 font-outfit text-xs uppercase tracking-[0.16em] transition-colors",
              isActive
                ? "border-tl-gold/40 bg-tl-gold/15 text-tl-gold"
                : "border-tl-gold/15 text-tl-beige/60 hover:border-tl-gold/30 hover:text-tl-beige",
            )}
          >
            {section.label}
          </button>
        );
      })}
    </nav>
  );
}
