"use client";

import {
  InicioField,
  InicioTextarea,
  InicioTextInput,
} from "@/components/dashboard/inicio/InicioField";
import { InicioImageUpload } from "@/components/dashboard/inicio/InicioImageUpload";
import type { HomeAboutSlide, HomePageContent } from "@/types/home-content";

interface AboutSectionFormProps {
  content: HomePageContent;
  onChange: (patch: Partial<HomePageContent>) => void;
  onSlideChange: (id: number, patch: Partial<HomeAboutSlide>) => void;
  onUploadSlideImage: (
    id: number,
    file: File,
    variant?: "desktop" | "mobile",
  ) => Promise<void>;
}

export function AboutSectionForm({
  content,
  onChange,
  onSlideChange,
  onUploadSlideImage,
}: AboutSectionFormProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <InicioField label="Eyebrow">
          <InicioTextInput
            value={content.about_eyebrow}
            onChange={(event) => onChange({ about_eyebrow: event.target.value })}
          />
        </InicioField>
        <InicioField label="Etiqueta redes">
          <InicioTextInput
            value={content.about_social_label}
            onChange={(event) =>
              onChange({ about_social_label: event.target.value })
            }
          />
        </InicioField>
      </div>

      <InicioField label="Título">
        <InicioTextInput
          value={content.about_title}
          onChange={(event) => onChange({ about_title: event.target.value })}
        />
      </InicioField>

      <InicioField label="Cuerpo">
        <InicioTextarea
          value={content.about_body}
          onChange={(event) => onChange({ about_body: event.target.value })}
        />
      </InicioField>

      <div className="grid gap-6 lg:grid-cols-2">
        <InicioField label="CTA — etiqueta">
          <InicioTextInput
            value={content.about_cta_label}
            onChange={(event) =>
              onChange({ about_cta_label: event.target.value })
            }
          />
        </InicioField>
        <InicioField label="CTA — URL">
          <InicioTextInput
            value={content.about_cta_url}
            onChange={(event) => onChange({ about_cta_url: event.target.value })}
          />
        </InicioField>
      </div>

      <div className="space-y-4">
        <h3 className="font-outfit font-extralight text-xl text-tl-beige">
          Carrusel de imágenes
        </h3>
        {content.about_slides.map((slide) => (
          <div
            key={slide.id}
            className="space-y-4 rounded-2xl border border-tl-gold/15 p-4"
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <InicioField label={`Alt — slide ${slide.order + 1}`}>
                <InicioTextInput
                  value={slide.alt_text}
                  onChange={(event) =>
                    onSlideChange(slide.id, { alt_text: event.target.value })
                  }
                />
              </InicioField>
              <InicioField
                label="URL externa (fallback)"
                hint="Se usa si no hay imagen subida."
              >
                <InicioTextInput
                  value={slide.external_url}
                  onChange={(event) =>
                    onSlideChange(slide.id, { external_url: event.target.value })
                  }
                />
              </InicioField>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <InicioImageUpload
                label="Imagen desktop"
                currentUrl={slide.image_url}
                onUpload={(file) => onUploadSlideImage(slide.id, file, "desktop")}
              />
              <InicioImageUpload
                label="Imagen móvil (opcional)"
                currentUrl={slide.image_mobile_url}
                onUpload={(file) => onUploadSlideImage(slide.id, file, "mobile")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
