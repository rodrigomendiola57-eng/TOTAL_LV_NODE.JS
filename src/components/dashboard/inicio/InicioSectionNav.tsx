"use client";

import { cn } from "@/lib/utils";
import type { InicioSectionId } from "@/types/home-content";

export const INICIO_SECTIONS: {
  id: InicioSectionId;
  label: string;
  description: string;
}[] = [
  {
    id: "hero",
    label: "Hero",
    description: "Título principal, subtítulo y fondo del inicio.",
  },
  {
    id: "about",
    label: "Nosotros",
    description: "Teaser de la firma y carrusel de imágenes.",
  },
  {
    id: "featured",
    label: "Destacadas",
    description: "Textos del carrusel de propiedades destacadas.",
  },
  {
    id: "city",
    label: "Ciudad",
    description: "Bloque inmersivo de Querétaro.",
  },
  {
    id: "expertise",
    label: "Asesoría",
    description: "Servicios, pilares y encabezados.",
  },
];

interface InicioSectionNavProps {
  active: InicioSectionId;
  onChange: (section: InicioSectionId) => void;
}

export function InicioSectionNav({ active, onChange }: InicioSectionNavProps) {
  return (
    <nav className="flex flex-wrap gap-2">
      {INICIO_SECTIONS.map((section) => {
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
