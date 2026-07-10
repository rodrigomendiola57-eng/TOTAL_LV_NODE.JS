"use client";

import {
  InicioField,
  InicioTextarea,
  InicioTextInput,
} from "@/components/dashboard/inicio/InicioField";
import { InicioImageUpload } from "@/components/dashboard/inicio/InicioImageUpload";
import type { HomeCityHighlight, HomePageContent } from "@/types/home-content";

interface CitySectionFormProps {
  content: HomePageContent;
  onCityChange: (patch: Partial<HomeCityHighlight>) => void;
  onUploadCityImage: (
    file: File,
    variant: "desktop" | "mobile",
  ) => Promise<void>;
}

export function CitySectionForm({
  content,
  onCityChange,
  onUploadCityImage,
}: CitySectionFormProps) {
  const city = content.city_highlight;

  return (
    <div className="space-y-6">
      <InicioField label="Aria label (accesibilidad)">
        <InicioTextInput
          value={city.aria_label}
          onChange={(event) => onCityChange({ aria_label: event.target.value })}
        />
      </InicioField>

      <div className="grid gap-6 lg:grid-cols-2">
        <InicioField label="Nombre de ciudad">
          <InicioTextInput
            value={city.city_name}
            onChange={(event) => onCityChange({ city_name: event.target.value })}
          />
        </InicioField>
        <InicioField label="Título">
          <InicioTextInput
            value={city.title}
            onChange={(event) => onCityChange({ title: event.target.value })}
          />
        </InicioField>
      </div>

      <InicioField label="Descripción">
        <InicioTextarea
          value={city.description}
          onChange={(event) => onCityChange({ description: event.target.value })}
        />
      </InicioField>

      <div className="grid gap-4 lg:grid-cols-2">
        <InicioImageUpload
          label="Imagen desktop"
          currentUrl={city.image_desktop_url}
          onUpload={(file) => onUploadCityImage(file, "desktop")}
        />
        <InicioImageUpload
          label="Imagen móvil"
          currentUrl={city.image_mobile_url}
          onUpload={(file) => onUploadCityImage(file, "mobile")}
        />
      </div>
    </div>
  );
}
