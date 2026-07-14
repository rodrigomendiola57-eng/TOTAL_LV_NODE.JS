"use client";

import { cn } from "@/lib/utils";
import type { ContactDashboardSectionId } from "@/types/contact-page";

export const CONTACT_SECTIONS: {
  id: ContactDashboardSectionId;
  label: string;
  description: string;
}[] = [
  {
    id: "hero",
    label: "Hero",
    description: "Eyebrow, título y descripción.",
  },
  {
    id: "channels",
    label: "Canales",
    description: "WhatsApp, correo y ubicación.",
  },
  {
    id: "form",
    label: "Formulario",
    description: "Labels, placeholders y éxito.",
  },
  {
    id: "reassurance",
    label: "Confianza",
    description: "Lista y pie de tranquilidad.",
  },
  {
    id: "seo",
    label: "SEO",
    description: "Title y description.",
  },
];

interface ContactSectionNavProps {
  active: ContactDashboardSectionId;
  onChange: (section: ContactDashboardSectionId) => void;
}

export function ContactSectionNav({
  active,
  onChange,
}: ContactSectionNavProps) {
  return (
    <nav className="flex flex-wrap gap-2">
      {CONTACT_SECTIONS.map((section) => {
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
