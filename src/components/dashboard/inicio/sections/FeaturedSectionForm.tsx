"use client";

import {
  InicioField,
  InicioTextarea,
  InicioTextInput,
} from "@/components/dashboard/inicio/InicioField";
import type { HomeFeaturedLink, HomePageContent } from "@/types/home-content";

interface FeaturedSectionFormProps {
  content: HomePageContent;
  onChange: (patch: Partial<HomePageContent>) => void;
  onLinkChange: (index: number, patch: Partial<HomeFeaturedLink>) => void;
}

export function FeaturedSectionForm({
  content,
  onChange,
  onLinkChange,
}: FeaturedSectionFormProps) {
  return (
    <div className="space-y-6">
      <InicioField label="Eyebrow">
        <InicioTextInput
          value={content.featured_eyebrow}
          onChange={(event) =>
            onChange({ featured_eyebrow: event.target.value })
          }
        />
      </InicioField>

      <InicioField label="Título">
        <InicioTextInput
          value={content.featured_title}
          onChange={(event) => onChange({ featured_title: event.target.value })}
        />
      </InicioField>

      <InicioField label="Mensaje sin propiedades">
        <InicioTextarea
          value={content.featured_empty_message}
          onChange={(event) =>
            onChange({ featured_empty_message: event.target.value })
          }
        />
      </InicioField>

      <div className="space-y-4">
        <h3 className="font-outfit font-extralight text-xl text-tl-beige">Enlaces rápidos</h3>
        {content.featured_links.map((link, index) => (
          <div
            key={`${link.href}-${index}`}
            className="grid gap-4 rounded-2xl border border-tl-gold/15 p-4 lg:grid-cols-2"
          >
            <InicioField label={`Enlace ${index + 1} — etiqueta`}>
              <InicioTextInput
                value={link.label}
                onChange={(event) =>
                  onLinkChange(index, { label: event.target.value })
                }
              />
            </InicioField>
            <InicioField label={`Enlace ${index + 1} — URL`}>
              <InicioTextInput
                value={link.href}
                onChange={(event) =>
                  onLinkChange(index, { href: event.target.value })
                }
              />
            </InicioField>
          </div>
        ))}
      </div>
    </div>
  );
}
