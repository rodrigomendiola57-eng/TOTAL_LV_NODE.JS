"use client";

import {
  InicioField,
  InicioTextarea,
  InicioTextInput,
} from "@/components/dashboard/inicio/InicioField";
import type { HomePageContent } from "@/types/home-content";

interface CtaSectionFormProps {
  content: HomePageContent;
  prefix: "zones" | "contact";
  onChange: (patch: Partial<HomePageContent>) => void;
}

export function CtaSectionForm({ content, prefix, onChange }: CtaSectionFormProps) {
  const eyebrowKey = `${prefix}_eyebrow` as const;
  const titleKey = `${prefix}_title` as const;
  const descriptionKey = `${prefix}_description` as const;
  const ctaLabelKey = `${prefix}_cta_label` as const;
  const ctaUrlKey = `${prefix}_cta_url` as const;

  return (
    <div className="space-y-6">
      <InicioField label="Eyebrow">
        <InicioTextInput
          value={content[eyebrowKey]}
          onChange={(event) => onChange({ [eyebrowKey]: event.target.value })}
        />
      </InicioField>

      <InicioField label="Título">
        <InicioTextInput
          value={content[titleKey]}
          onChange={(event) => onChange({ [titleKey]: event.target.value })}
        />
      </InicioField>

      <InicioField label="Descripción">
        <InicioTextarea
          value={content[descriptionKey]}
          onChange={(event) =>
            onChange({ [descriptionKey]: event.target.value })
          }
        />
      </InicioField>

      <div className="grid gap-6 lg:grid-cols-2">
        <InicioField label="CTA — etiqueta">
          <InicioTextInput
            value={content[ctaLabelKey]}
            onChange={(event) =>
              onChange({ [ctaLabelKey]: event.target.value })
            }
          />
        </InicioField>
        <InicioField label="CTA — URL">
          <InicioTextInput
            value={content[ctaUrlKey]}
            onChange={(event) => onChange({ [ctaUrlKey]: event.target.value })}
          />
        </InicioField>
      </div>
    </div>
  );
}
