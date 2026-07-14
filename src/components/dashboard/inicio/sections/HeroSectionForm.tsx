"use client";

import {
  InicioField,
  InicioTextInput,
} from "@/components/dashboard/inicio/InicioField";
import { InicioImageUpload } from "@/components/dashboard/inicio/InicioImageUpload";
import { InicioVideoUpload } from "@/components/dashboard/inicio/InicioVideoUpload";
import type { HomePageContent } from "@/types/home-content";

interface HeroSectionFormProps {
  content: HomePageContent;
  onChange: (patch: Partial<HomePageContent>) => void;
  onUploadHeroBackground: (file: File) => Promise<void>;
  onUploadHeroVideo: (file: File) => Promise<void>;
}

export function HeroSectionForm({
  content,
  onChange,
  onUploadHeroBackground,
  onUploadHeroVideo,
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

      <InicioVideoUpload
        label="Video de portada (hero)"
        currentUrl={content.hero_video_url}
        onUpload={onUploadHeroVideo}
        hint="MP4 recomendado. Se guarda en S3 (home/hero/video/). Si no hay video, se usa el fallback local."
      />

      <InicioImageUpload
        label="Poster / respaldo del hero"
        currentUrl={content.hero_background_url}
        onUpload={onUploadHeroBackground}
        hint="JPG, PNG o WebP. Se muestra mientras carga el video o si falla."
      />
    </div>
  );
}
