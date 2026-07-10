"use client";

import {
  InicioField,
  InicioTextarea,
  InicioTextInput,
} from "@/components/dashboard/inicio/InicioField";
import { InicioImageUpload } from "@/components/dashboard/inicio/InicioImageUpload";
import type { HomePageContent } from "@/types/home-content";

interface HeroSectionFormProps {
  content: HomePageContent;
  onChange: (patch: Partial<HomePageContent>) => void;
  onUploadHeroBackground: (file: File) => Promise<void>;
}

export function HeroSectionForm({
  content,
  onChange,
  onUploadHeroBackground,
}: HeroSectionFormProps) {
  return (
    <div className="space-y-6">
      <InicioField label="Eyebrow">
        <InicioTextInput
          value={content.hero_eyebrow}
          onChange={(event) => onChange({ hero_eyebrow: event.target.value })}
        />
      </InicioField>

      <InicioField label="Título">
        <InicioTextInput
          value={content.hero_title}
          onChange={(event) => onChange({ hero_title: event.target.value })}
        />
      </InicioField>

      <InicioField label="Subtítulo">
        <InicioTextInput
          value={content.hero_subtitle}
          onChange={(event) => onChange({ hero_subtitle: event.target.value })}
        />
      </InicioField>

      <InicioImageUpload
        label="Fondo del hero"
        currentUrl={content.hero_background_url}
        onUpload={onUploadHeroBackground}
        hint="JPG, PNG o WebP. Máximo 12 MB."
      />
    </div>
  );
}
