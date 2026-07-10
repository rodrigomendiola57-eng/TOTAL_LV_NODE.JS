"use client";

import {
  InicioField,
  InicioTextarea,
  InicioTextInput,
} from "@/components/dashboard/inicio/InicioField";
import type {
  HomeExpertisePillar,
  HomeExpertiseService,
  HomePageContent,
} from "@/types/home-content";

interface ExpertiseSectionFormProps {
  content: HomePageContent;
  onChange: (patch: Partial<HomePageContent>) => void;
  onServiceChange: (
    id: number,
    patch: Partial<HomeExpertiseService>,
  ) => void;
  onPillarChange: (id: number, patch: Partial<HomeExpertisePillar>) => void;
}

export function ExpertiseSectionForm({
  content,
  onChange,
  onServiceChange,
  onPillarChange,
}: ExpertiseSectionFormProps) {
  return (
    <div className="space-y-8">
      <InicioField label="Título de sección">
        <InicioTextInput
          value={content.expertise_title}
          onChange={(event) =>
            onChange({ expertise_title: event.target.value })
          }
        />
      </InicioField>

      <InicioField label="Subtítulo">
        <InicioTextarea
          value={content.expertise_subtitle}
          onChange={(event) =>
            onChange({ expertise_subtitle: event.target.value })
          }
        />
      </InicioField>

      <div className="space-y-4">
        <h3 className="font-cormorant text-xl text-tl-beige">Servicios</h3>
        {content.expertise_services.map((service) => (
          <div
            key={service.id}
            className="space-y-4 rounded-2xl border border-tl-gold/15 p-4"
          >
            <InicioField label="Título">
              <InicioTextInput
                value={service.title}
                onChange={(event) =>
                  onServiceChange(service.id, { title: event.target.value })
                }
              />
            </InicioField>
            <InicioField label="Descripción">
              <InicioTextarea
                value={service.description}
                onChange={(event) =>
                  onServiceChange(service.id, {
                    description: event.target.value,
                  })
                }
              />
            </InicioField>
            <InicioField
              label="Bullets (uno por línea)"
              hint="Se guardan como lista al persistir."
            >
              <InicioTextarea
                value={service.bullets.join("\n")}
                onChange={(event) =>
                  onServiceChange(service.id, {
                    bullets: event.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  })
                }
              />
            </InicioField>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-cormorant text-xl text-tl-beige">Pilares</h3>
        {content.expertise_pillars.map((pillar) => (
          <div
            key={pillar.id}
            className="space-y-4 rounded-2xl border border-tl-gold/15 p-4"
          >
            <InicioField label="Título">
              <InicioTextInput
                value={pillar.title}
                onChange={(event) =>
                  onPillarChange(pillar.id, { title: event.target.value })
                }
              />
            </InicioField>
            <InicioField label="Descripción">
              <InicioTextarea
                value={pillar.description}
                onChange={(event) =>
                  onPillarChange(pillar.id, {
                    description: event.target.value,
                  })
                }
              />
            </InicioField>
          </div>
        ))}
      </div>
    </div>
  );
}
