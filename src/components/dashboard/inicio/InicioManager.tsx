"use client";

import { AboutSectionForm } from "@/components/dashboard/inicio/sections/AboutSectionForm";
import { CitySectionForm } from "@/components/dashboard/inicio/sections/CitySectionForm";
import { ExpertiseSectionForm } from "@/components/dashboard/inicio/sections/ExpertiseSectionForm";
import { FeaturedSectionForm } from "@/components/dashboard/inicio/sections/FeaturedSectionForm";
import { HeroSectionForm } from "@/components/dashboard/inicio/sections/HeroSectionForm";
import {
  INICIO_SECTIONS,
  InicioSectionNav,
} from "@/components/dashboard/inicio/InicioSectionNav";
import {
  getHomeContent,
  updateAboutSlide,
  updateCityHighlight,
  updateExpertisePillar,
  updateExpertiseService,
  updateHomeContent,
  uploadAboutSlideImage,
  uploadCityImage,
  uploadHeroBackground,
} from "@/lib/api/home-content";
import { buildHomeUpdatePayload } from "@/lib/home-content-payload";
import { HOME_CONTENT_FALLBACK } from "@/lib/home-content-defaults";
import { hasPendingTextChanges } from "@/lib/inicio-dirty-state";
import { cn } from "@/lib/utils";
import type {
  HomeAboutSlide,
  HomeCityHighlight,
  HomeExpertisePillar,
  HomeExpertiseService,
  HomeFeaturedLink,
  HomePageContent,
  InicioSectionId,
} from "@/types/home-content";
import { Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

function withCacheBust(url: string | null | undefined, version: number): string | null {
  if (!url) return null;
  if (version === 0) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${version}`;
}

export function InicioManager() {
  const [activeSection, setActiveSection] = useState<InicioSectionId>("hero");
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [baseline, setBaseline] = useState<HomePageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [previewVersion, setPreviewVersion] = useState(0);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHomeContent();
      setContent(data);
      setBaseline(structuredClone(data));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudo cargar el contenido de inicio.",
      );
      setContent(HOME_CONTENT_FALLBACK);
      setBaseline(structuredClone(HOME_CONTENT_FALLBACK));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const activeMeta = useMemo(
    () => INICIO_SECTIONS.find((section) => section.id === activeSection),
    [activeSection],
  );

  const isDirty = useMemo(() => {
    if (!content || !baseline) return false;
    return hasPendingTextChanges(content, baseline);
  }, [content, baseline]);

  const previewContent = useMemo(() => {
    if (!content) return null;
    return {
      ...content,
      hero_background_url: withCacheBust(
        content.hero_background_url,
        previewVersion,
      ),
      about_slides: content.about_slides.map((slide) => ({
        ...slide,
        image_url: withCacheBust(slide.image_url, previewVersion),
        image_mobile_url: withCacheBust(slide.image_mobile_url, previewVersion),
      })),
      city_highlight: {
        ...content.city_highlight,
        image_desktop_url: withCacheBust(
          content.city_highlight.image_desktop_url,
          previewVersion,
        ),
        image_mobile_url: withCacheBust(
          content.city_highlight.image_mobile_url,
          previewVersion,
        ),
      },
    };
  }, [content, previewVersion]);

  function notifyImageSaved(label: string) {
    setPreviewVersion((current) => current + 1);
    setUploadMessage(`${label} guardada en el servidor.`);
    setSaveMessage(null);
  }

  function patchContent(patch: Partial<HomePageContent>) {
    setContent((current) => (current ? { ...current, ...patch } : current));
    setSaveMessage(null);
  }

  function patchCity(patch: Partial<HomeCityHighlight>) {
    setContent((current) =>
      current
        ? {
            ...current,
            city_highlight: { ...current.city_highlight, ...patch },
          }
        : current,
    );
    setSaveMessage(null);
  }

  function patchSlide(id: number, patch: Partial<HomeAboutSlide>) {
    setContent((current) =>
      current
        ? {
            ...current,
            about_slides: current.about_slides.map((slide) =>
              slide.id === id ? { ...slide, ...patch } : slide,
            ),
          }
        : current,
    );
    setSaveMessage(null);
  }

  function patchFeaturedLink(index: number, patch: Partial<HomeFeaturedLink>) {
    setContent((current) =>
      current
        ? {
            ...current,
            featured_links: current.featured_links.map((link, linkIndex) =>
              linkIndex === index ? { ...link, ...patch } : link,
            ),
          }
        : current,
    );
    setSaveMessage(null);
  }

  function patchService(id: number, patch: Partial<HomeExpertiseService>) {
    setContent((current) =>
      current
        ? {
            ...current,
            expertise_services: current.expertise_services.map((service) =>
              service.id === id ? { ...service, ...patch } : service,
            ),
          }
        : current,
    );
    setSaveMessage(null);
  }

  function patchPillar(id: number, patch: Partial<HomeExpertisePillar>) {
    setContent((current) =>
      current
        ? {
            ...current,
            expertise_pillars: current.expertise_pillars.map((pillar) =>
              pillar.id === id ? { ...pillar, ...patch } : pillar,
            ),
          }
        : current,
    );
    setSaveMessage(null);
  }

  async function handleSave() {
    if (!content || !baseline) return;

    setIsSaving(true);
    setError(null);
    setSaveMessage(null);

    try {
      const updatedHome = await updateHomeContent(buildHomeUpdatePayload(content));

      let nextContent: HomePageContent = {
        ...updatedHome,
        city_highlight: content.city_highlight,
        about_slides: content.about_slides,
        expertise_services: content.expertise_services,
        expertise_pillars: content.expertise_pillars,
      };

      if (
        JSON.stringify(content.city_highlight) !==
        JSON.stringify(baseline.city_highlight)
      ) {
        const city = await updateCityHighlight({
          aria_label: content.city_highlight.aria_label,
          city_name: content.city_highlight.city_name,
          title: content.city_highlight.title,
          description: content.city_highlight.description,
          external_desktop_url: content.city_highlight.external_desktop_url,
          external_mobile_url: content.city_highlight.external_mobile_url,
        });
        nextContent = { ...nextContent, city_highlight: city };
      }

      const slideUpdates = await Promise.all(
        content.about_slides
          .filter((slide) => {
            const original = baseline.about_slides.find(
              (item) => item.id === slide.id,
            );
            return (
              original &&
              JSON.stringify(original) !== JSON.stringify(slide) &&
              (original.alt_text !== slide.alt_text ||
                original.external_url !== slide.external_url ||
                original.order !== slide.order)
            );
          })
          .map((slide) =>
            updateAboutSlide(slide.id, {
              alt_text: slide.alt_text,
              external_url: slide.external_url,
              order: slide.order,
            }),
          ),
      );

      if (slideUpdates.length > 0) {
        nextContent = {
          ...nextContent,
          about_slides: nextContent.about_slides.map(
            (slide) => slideUpdates.find((item) => item.id === slide.id) ?? slide,
          ),
        };
      }

      const serviceUpdates = await Promise.all(
        content.expertise_services
          .filter((service) => {
            const original = baseline.expertise_services.find(
              (item) => item.id === service.id,
            );
            return original && JSON.stringify(original) !== JSON.stringify(service);
          })
          .map((service) =>
            updateExpertiseService(service.id, {
              title: service.title,
              description: service.description,
              bullets: service.bullets,
              icon: service.icon,
              order: service.order,
              is_active: service.is_active,
            }),
          ),
      );

      if (serviceUpdates.length > 0) {
        nextContent = {
          ...nextContent,
          expertise_services: nextContent.expertise_services.map(
            (service) =>
              serviceUpdates.find((item) => item.id === service.id) ?? service,
          ),
        };
      }

      const pillarUpdates = await Promise.all(
        content.expertise_pillars
          .filter((pillar) => {
            const original = baseline.expertise_pillars.find(
              (item) => item.id === pillar.id,
            );
            return original && JSON.stringify(original) !== JSON.stringify(pillar);
          })
          .map((pillar) =>
            updateExpertisePillar(pillar.id, {
              title: pillar.title,
              description: pillar.description,
              bento_class: pillar.bento_class,
              order: pillar.order,
              is_active: pillar.is_active,
            }),
          ),
      );

      if (pillarUpdates.length > 0) {
        nextContent = {
          ...nextContent,
          expertise_pillars: nextContent.expertise_pillars.map(
            (pillar) =>
              pillarUpdates.find((item) => item.id === pillar.id) ?? pillar,
          ),
        };
      }

      setContent(nextContent);
      setBaseline(structuredClone(nextContent));
      setSaveMessage("Cambios guardados correctamente.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudieron guardar los cambios.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !content || !previewContent) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-tl-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-tl-gold/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-outfit text-[10px] uppercase tracking-[0.28em] text-tl-gold">
            CMS
          </p>
          <h1 className="mt-2 font-outfit text-3xl font-extralight text-tl-beige">
            Módulo Inicio
          </h1>
          <p className="mt-2 max-w-2xl font-outfit text-sm text-tl-beige/65">
            Los textos se guardan con el botón inferior. Las imágenes se suben y
            guardan al instante al elegir el archivo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 rounded-full border border-tl-gold/20 px-4 py-2 font-outfit text-xs text-tl-beige/80">
            <input
              type="checkbox"
              checked={content.is_published}
              onChange={(event) =>
                patchContent({ is_published: event.target.checked })
              }
              className="accent-tl-gold"
            />
            Publicado
          </label>

          <button
            type="button"
            disabled={!isDirty || isSaving}
            onClick={() => void handleSave()}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-outfit text-sm transition-colors",
              isDirty
                ? "bg-tl-gold text-tl-black hover:bg-tl-gold/90"
                : "cursor-not-allowed bg-tl-gold/20 text-tl-beige/40",
            )}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar textos
          </button>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-outfit text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {uploadMessage ? (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 font-outfit text-sm text-emerald-300">
          {uploadMessage}
        </div>
      ) : null}

      {saveMessage ? (
        <div className="rounded-xl border border-tl-gold/25 bg-tl-gold/10 px-4 py-3 font-outfit text-sm text-tl-gold">
          {saveMessage}
        </div>
      ) : null}

      <InicioSectionNav active={activeSection} onChange={setActiveSection} />

      <section className="rounded-3xl border border-tl-gold/15 bg-tl-black/30 p-6 lg:p-8">
        <div className="mb-8 border-b border-tl-gold/10 pb-6">
          <h2 className="font-outfit font-extralight text-2xl text-tl-beige">
            {activeMeta?.label}
          </h2>
          <p className="mt-2 font-outfit text-sm text-tl-beige/60">
            {activeMeta?.description}
          </p>
        </div>

        {activeSection === "hero" ? (
          <HeroSectionForm
            content={previewContent}
            onChange={patchContent}
            onUploadHeroBackground={async (file) => {
              const updated = await uploadHeroBackground(file);
              setContent(updated);
              setBaseline(structuredClone(updated));
              notifyImageSaved("Imagen del hero");
            }}
          />
        ) : null}

        {activeSection === "about" ? (
          <AboutSectionForm
            content={previewContent}
            onChange={patchContent}
            onSlideChange={patchSlide}
            onUploadSlideImage={async (id, file, variant = "desktop") => {
              const slide = await uploadAboutSlideImage(id, file, variant);
              setContent((current) =>
                current
                  ? {
                      ...current,
                      about_slides: current.about_slides.map((item) =>
                        item.id === id ? slide : item,
                      ),
                    }
                  : current,
              );
              setBaseline((current) =>
                current
                  ? {
                      ...current,
                      about_slides: current.about_slides.map((item) =>
                        item.id === id ? slide : item,
                      ),
                    }
                  : current,
              );
              notifyImageSaved(
                variant === "mobile" ? "Imagen móvil del carrusel" : "Imagen del carrusel",
              );
            }}
          />
        ) : null}

        {activeSection === "featured" ? (
          <FeaturedSectionForm
            content={previewContent}
            onChange={patchContent}
            onLinkChange={patchFeaturedLink}
          />
        ) : null}

        {activeSection === "city" ? (
          <CitySectionForm
            content={previewContent}
            onCityChange={patchCity}
            onUploadCityImage={async (file, variant) => {
              const city = await uploadCityImage(file, variant);
              setContent((current) =>
                current ? { ...current, city_highlight: city } : current,
              );
              setBaseline((current) =>
                current ? { ...current, city_highlight: city } : current,
              );
              notifyImageSaved(
                variant === "mobile" ? "Imagen móvil de ciudad" : "Imagen desktop de ciudad",
              );
            }}
          />
        ) : null}

        {activeSection === "expertise" ? (
          <ExpertiseSectionForm
            content={previewContent}
            onChange={patchContent}
            onServiceChange={patchService}
            onPillarChange={patchPillar}
          />
        ) : null}
      </section>
    </div>
  );
}
