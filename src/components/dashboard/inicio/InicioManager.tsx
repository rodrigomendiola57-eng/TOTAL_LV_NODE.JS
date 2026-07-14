"use client";

import { AboutSectionForm } from "@/components/dashboard/inicio/sections/AboutSectionForm";
import { CitySectionForm } from "@/components/dashboard/inicio/sections/CitySectionForm";
import { FeaturedSectionForm } from "@/components/dashboard/inicio/sections/FeaturedSectionForm";
import { HeroSectionForm } from "@/components/dashboard/inicio/sections/HeroSectionForm";
import { JournalSectionForm } from "@/components/dashboard/inicio/sections/JournalSectionForm";
import {
  INICIO_SECTIONS,
  InicioSectionNav,
} from "@/components/dashboard/inicio/InicioSectionNav";
import {
  createJournalPost,
  deleteJournalPost,
  getHomeContent,
  updateAboutSlide,
  updateCityHighlight,
  updateExpertisePillar,
  updateExpertiseService,
  updateHomeContent,
  updateJournalPost,
  uploadAboutSlideImage,
  uploadCityImage,
  uploadHeroBackground,
  uploadHeroVideo,
  uploadJournalPostImage,
  uploadJournalPostVideo,
} from "@/lib/api/home-content";
import { buildHomeUpdatePayload } from "@/lib/home-content-payload";
import { HOME_CONTENT_FALLBACK } from "@/lib/home-content-defaults";
import { hasPendingTextChanges } from "@/lib/inicio-dirty-state";
import { cn } from "@/lib/utils";
import type {
  HomeAboutSlide,
  HomeCityHighlight,
  HomeFeaturedLink,
  HomeJournalPost,
  HomePageContent,
  InicioSectionId,
} from "@/types/home-content";
import { HOME_JOURNAL_MAX } from "@/types/home-content";
import { Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

function withCacheBust(url: string | null | undefined, version: number): string | null {
  if (!url) return null;
  if (version === 0) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${version}`;
}

const HOME_TEXT_KEYS = [
  "hero_eyebrow",
  "hero_title",
  "hero_subtitle",
  "about_eyebrow",
  "about_title",
  "about_body",
  "about_cta_label",
  "about_cta_url",
  "about_social_label",
  "featured_eyebrow",
  "featured_title",
  "featured_empty_message",
  "zones_eyebrow",
  "zones_title",
  "zones_description",
  "zones_cta_label",
  "zones_cta_url",
  "contact_eyebrow",
  "contact_title",
  "contact_description",
  "contact_cta_label",
  "contact_cta_url",
  "expertise_title",
  "expertise_subtitle",
] as const;

export function InicioManager() {
  const [activeSection, setActiveSection] = useState<InicioSectionId>("hero");
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [baseline, setBaseline] = useState<HomePageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [editLocale, setEditLocale] = useState<"es" | "en">("es");
  const [previewVersion, setPreviewVersion] = useState(0);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHomeContent({ lang: "edit" });
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

    // Inyectar traducciones en inglés en la vista previa del formulario si editLocale === "en"
    const textOverrides: Partial<HomePageContent> = {};
    if (editLocale === "en") {
      const pack = (content.content_en as Record<string, unknown>) ?? {};
      HOME_TEXT_KEYS.forEach((key) => {
        const val = pack[key];
        textOverrides[key] = typeof val === "string" ? val : "";
      });
    }

    return {
      ...content,
      ...textOverrides,
      hero_background_url: withCacheBust(
        content.hero_background_url,
        previewVersion,
      ),
      hero_video_url: withCacheBust(content.hero_video_url, previewVersion),
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
        ...(editLocale === "en" ? {
          city_name: (((content.content_en as Record<string, unknown>) ?? {}).city_highlight_city_name as string) ?? content.city_highlight.city_name,
          title: (((content.content_en as Record<string, unknown>) ?? {}).city_highlight_title as string) ?? content.city_highlight.title,
          description: (((content.content_en as Record<string, unknown>) ?? {}).city_highlight_description as string) ?? content.city_highlight.description,
          aria_label: (((content.content_en as Record<string, unknown>) ?? {}).city_highlight_aria_label as string) ?? content.city_highlight.aria_label,
        } : {}),
      },
      journal_posts: content.journal_posts.map((post) => {
        const enTitle = ((content.content_en as Record<string, unknown>) ?? {})[`journal_post_${post.id}_title`] as string;
        const enBody = ((content.content_en as Record<string, unknown>) ?? {})[`journal_post_${post.id}_body`] as string;
        const enDate = ((content.content_en as Record<string, unknown>) ?? {})[`journal_post_${post.id}_date_label`] as string;
        const enCategory = ((content.content_en as Record<string, unknown>) ?? {})[`journal_post_${post.id}_category`] as string;

        return {
          ...post,
          image_url: withCacheBust(post.image_url, previewVersion),
          video_url: withCacheBust(post.video_url, previewVersion),
          ...(editLocale === "en" ? {
            title: enTitle ?? post.title,
            body: enBody ?? post.body,
            date_label: enDate ?? post.date_label,
            category: enCategory ?? post.category,
          } : {})
        };
      }),
    };
  }, [content, previewVersion, editLocale]);

  function notifyImageSaved(label: string) {
    setPreviewVersion((current) => current + 1);
    setUploadMessage(`${label} guardada en el servidor.`);
    setSaveMessage(null);
  }

  function patchContent(patch: Partial<HomePageContent>) {
    setContent((current) => {
      if (!current) return current;
      if (editLocale === "es") {
        return { ...current, ...patch };
      }

      // Si editLocale === "en", guardamos los parches de texto en content_en,
      // y los parches de configuraciones globales directamente en la raíz.
      const nextPack = { ...((current.content_en as Record<string, unknown>) ?? {}) };
      const rootPatch: Record<string, unknown> = {};

      Object.entries(patch).forEach(([key, val]) => {
        if ((HOME_TEXT_KEYS as readonly string[]).includes(key)) {
          nextPack[key] = val;
        } else {
          rootPatch[key] = val;
        }
      });

      return {
        ...current,
        ...rootPatch,
        content_en: nextPack,
      };
    });
    setSaveMessage(null);
  }

  function patchCity(patch: Partial<HomeCityHighlight>) {
    setContent((current) => {
      if (!current) return current;
      if (editLocale === "es") {
        return {
          ...current,
          city_highlight: { ...current.city_highlight, ...patch },
        };
      }

      const nextPack = { ...((current.content_en as Record<string, unknown>) ?? {}) };
      Object.entries(patch).forEach(([key, val]) => {
        if (["city_name", "title", "description", "aria_label"].includes(key)) {
          nextPack[`city_highlight_${key}`] = val;
        }
      });
      return {
        ...current,
        content_en: nextPack,
      };
    });
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

  function patchJournalPost(id: number, patch: Partial<HomeJournalPost>) {
    setContent((current) => {
      if (!current) return current;
      if (editLocale === "es") {
        return {
          ...current,
          journal_posts: current.journal_posts.map((post) =>
            post.id === id ? { ...post, ...patch } : post,
          ),
        };
      }

      const nextPack = { ...((current.content_en as Record<string, unknown>) ?? {}) };
      Object.entries(patch).forEach(([key, val]) => {
        if (["title", "body", "date_label", "category"].includes(key)) {
          nextPack[`journal_post_${id}_${key}`] = val;
        }
      });
      
      const rootPatch = { ...patch };
      ["title", "body", "date_label", "category"].forEach((k) => delete rootPatch[k as keyof HomeJournalPost]);

      return {
        ...current,
        journal_posts: current.journal_posts.map((post) =>
            post.id === id ? { ...post, ...rootPatch } : post,
        ),
        content_en: nextPack,
      };
    });
    setSaveMessage(null);
  }

  const isJournalDirty = useMemo(() => {
    if (!content || !baseline) return false;
    if (content.journal_posts.length !== baseline.journal_posts.length) {
      return true;
    }
    return content.journal_posts.some((post) => {
      const original = baseline.journal_posts.find((item) => item.id === post.id);
      if (!original) return true;
      return (
        original.kind !== post.kind ||
        original.category !== post.category ||
        original.title !== post.title ||
        original.body !== post.body ||
        original.date_label !== post.date_label ||
        original.order !== post.order ||
        original.is_active !== post.is_active
      );
    });
  }, [content, baseline]);

  async function createJournalCard() {
    if (!content) return;
    const activeCount = content.journal_posts.filter((p) => p.is_active).length;
    if (activeCount >= HOME_JOURNAL_MAX) {
      setError(`Máximo ${HOME_JOURNAL_MAX} cards en Novedades.`);
      return;
    }

    // Reactivar un inactivo si existe
    const inactive = content.journal_posts.find((post) => !post.is_active);
    if (inactive) {
      const updated = await updateJournalPost(inactive.id, {
        kind: inactive.kind === "video" ? "video" : "image",
        category: inactive.category || "Novedad",
        title: inactive.title || `Card ${activeCount + 1}`,
        body: inactive.body || "Escribe el caption aquí.",
        date_label: inactive.date_label || "Hoy",
        order: activeCount,
        is_active: true,
      });
      setContent((current) =>
        current
          ? {
              ...current,
              journal_posts: current.journal_posts.map((post) =>
                post.id === inactive.id ? updated : post,
              ),
            }
          : current,
      );
      setBaseline((current) =>
        current
          ? {
              ...current,
              journal_posts: current.journal_posts.map((post) =>
                post.id === inactive.id ? updated : post,
              ),
            }
          : current,
      );
      setUploadMessage("Card agregada.");
      return;
    }

    const created = await createJournalPost({
      kind: "image",
      category: "Novedad",
      title: `Card ${activeCount + 1}`,
      body: "Escribe el caption aquí.",
      date_label: "Hoy",
      order: activeCount,
      is_active: true,
    });
    setContent((current) =>
      current
        ? { ...current, journal_posts: [...current.journal_posts, created] }
        : current,
    );
    setBaseline((current) =>
      current
        ? { ...current, journal_posts: [...current.journal_posts, created] }
        : current,
    );
    setUploadMessage("Card agregada.");
  }

  async function removeJournalCard(id: number) {
    await deleteJournalPost(id);
    setContent((current) =>
      current
        ? {
            ...current,
            journal_posts: current.journal_posts.filter(
              (post) => post.id !== id,
            ),
          }
        : current,
    );
    setBaseline((current) =>
      current
        ? {
            ...current,
            journal_posts: current.journal_posts.filter(
              (post) => post.id !== id,
            ),
          }
        : current,
    );
    setUploadMessage("Card eliminada.");
  }

  async function saveJournalSection(pending: {
    images: Record<number, File>;
    videos: Record<number, File>;
  }) {
    if (!content || !baseline) return;

    setIsSaving(true);
    setError(null);
    setSaveMessage(null);
    setUploadMessage(null);

    try {
      let working = [...content.journal_posts];

      for (const [idRaw, file] of Object.entries(pending.videos)) {
        const id = Number(idRaw);
        let post = await uploadJournalPostVideo(id, file);
        if (post.kind !== "video") {
          post = await updateJournalPost(post.id, {
            kind: "video",
            category: post.category,
            title: post.title,
            body: post.body,
            date_label: post.date_label,
            order: post.order,
            is_active: post.is_active,
          });
        }
        working = working.map((item) => (item.id === id ? post : item));
      }

      for (const [idRaw, file] of Object.entries(pending.images)) {
        const id = Number(idRaw);
        const current = working.find((item) => item.id === id);
        let post = await uploadJournalPostImage(id, file);
        if (current?.kind === "video" || post.kind === "video") {
          // portada de video: no cambiar kind
        } else if (post.kind !== "image") {
          post = await updateJournalPost(post.id, {
            kind: "image",
            category: post.category,
            title: post.title,
            body: post.body,
            date_label: post.date_label,
            order: post.order,
            is_active: post.is_active,
          });
        }
        working = working.map((item) => (item.id === id ? post : item));
      }

      // Mezcla textos editados del state actual (kind/category/title/body/…)
      working = working.map((post) => {
        const draft = content.journal_posts.find((item) => item.id === post.id);
        if (!draft) return post;
        return {
          ...post,
          kind: draft.kind === "video" ? "video" : "image",
          category: draft.category,
          title: draft.title,
          body: draft.body,
          date_label: draft.date_label,
          order: draft.order,
          is_active: draft.is_active,
        };
      });

      const journalUpdates = await Promise.all(
        working
          .filter((post) => {
            const original = baseline.journal_posts.find(
              (item) => item.id === post.id,
            );
            const mediaChanged =
              Boolean(pending.images[post.id]) ||
              Boolean(pending.videos[post.id]);
            if (!original) return true;
            return (
              mediaChanged ||
              original.kind !== post.kind ||
              original.category !== post.category ||
              original.title !== post.title ||
              original.body !== post.body ||
              original.date_label !== post.date_label ||
              original.order !== post.order ||
              original.is_active !== post.is_active
            );
          })
          .map(async (post) => {
            const saved = await updateJournalPost(post.id, {
              kind: post.kind === "video" ? "video" : "image",
              category: post.category,
              title: post.title,
              body: post.body,
              date_label: post.date_label,
              order: post.order,
              is_active: post.is_active,
            });
            // Conserva URLs de media recién subidas
            const withMedia = working.find((item) => item.id === post.id);
            return {
              ...saved,
              image_url: withMedia?.image_url ?? saved.image_url,
              video_url: withMedia?.video_url ?? saved.video_url,
            };
          }),
      );

      if (journalUpdates.length > 0) {
        working = working.map(
          (post) =>
            journalUpdates.find((item) => item.id === post.id) ?? post,
        );
      }

      setContent((current) =>
        current ? { ...current, journal_posts: working } : current,
      );
      setBaseline((current) =>
        current
          ? { ...current, journal_posts: structuredClone(working) }
          : current,
      );
      setPreviewVersion((current) => current + 1);
      setSaveMessage("Novedades guardadas.");
      if (editLocale === "en") {
        await updateHomeContent({ content_en: content.content_en ?? {} });
      }
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudieron guardar las novedades.",
      );
      throw saveError;
    } finally {
      setIsSaving(false);
    }
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
        journal_posts: content.journal_posts,
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

      const journalUpdates = await Promise.all(
        content.journal_posts
          .filter((post) => {
            const original = baseline.journal_posts.find(
              (item) => item.id === post.id,
            );
            return original && JSON.stringify(original) !== JSON.stringify(post);
          })
          .map((post) =>
            updateJournalPost(post.id, {
              kind: post.kind === "video" ? "video" : "image",
              category: post.category,
              title: post.title,
              body: post.body,
              date_label: post.date_label,
              order: post.order,
              is_active: post.is_active,
            }),
          ),
      );

      if (journalUpdates.length > 0) {
        nextContent = {
          ...nextContent,
          journal_posts: nextContent.journal_posts.map(
            (post) =>
              journalUpdates.find((item) => item.id === post.id) ?? post,
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

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] p-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-tl-gold/80">
          Idioma de edición
        </span>
        <button
          type="button"
          onClick={() => setEditLocale("es")}
          className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] ${
            editLocale === "es"
              ? "bg-tl-gold text-tl-black"
              : "border border-white/10 text-tl-beige/80 hover:border-tl-gold"
          }`}
        >
          Español
        </button>
        <button
          type="button"
          onClick={() => setEditLocale("en")}
          className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] ${
            editLocale === "en"
              ? "bg-tl-gold text-tl-black"
              : "border border-white/10 text-tl-beige/80 hover:border-tl-gold"
          }`}
        >
          English
        </button>
      </div>



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
            onUploadHeroVideo={async (file) => {
              const updated = await uploadHeroVideo(file);
              setContent(updated);
              setBaseline(structuredClone(updated));
              notifyImageSaved("Video del hero");
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

        {activeSection === "journal" ? (
          <JournalSectionForm
            content={previewContent}
            onPostChange={patchJournalPost}
            onCreateCard={createJournalCard}
            onDeleteCard={removeJournalCard}
            isSaving={isSaving}
            isDirty={isJournalDirty}
            onSave={saveJournalSection}
          />
        ) : null}
      </section>
    </div>
  );
}
