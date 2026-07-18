"use client";

import { ZoneImageDropzone } from "@/components/dashboard/zonas/ZoneImageDropzone";
import {
  getZonesPageContent,
  updateZonesPageContent,
  uploadZonesPageHero,
} from "@/lib/api/zones";
import type { ZonesPageContent } from "@/types/zones-page";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const fieldClass =
  "w-full rounded-xl border border-tl-gold/20 bg-[#0a0a0a] px-3 py-2.5 font-outfit text-sm font-light text-tl-beige outline-none focus:border-tl-gold/50";
const labelClass =
  "mb-1.5 block font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-gold/80";

export function ZonesTextsManager() {
  const [content, setContent] = useState<ZonesPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [editLocale, setEditLocale] = useState<"es" | "en">("es");

  useEffect(() => {
    let cancelled = false;
    getZonesPageContent({ revalidate: false, lang: "edit" })
      .then((data) => {
        if (!cancelled) {
          setContent(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar textos");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const previewContent = useMemo(() => {
    if (!content) return null;
    if (editLocale === "es") return content;
    const enPack = (content.content_en ?? {}) as Partial<ZonesPageContent>;
    return {
      ...content,
      hero_eyebrow: enPack.hero_eyebrow ?? "",
      hero_title: enPack.hero_title ?? "",
      hero_subtitle: enPack.hero_subtitle ?? "",
      scroll_hint: enPack.scroll_hint ?? "",
    };
  }, [content, editLocale]);

  function patchContent<K extends keyof ZonesPageContent>(
    key: K,
    value: ZonesPageContent[K],
  ) {
    setContent((current) => {
      if (!current) return current;

      const alwaysRootKeys: Array<keyof ZonesPageContent> = [
        "is_published",
        "hero_image_external_url",
      ];

      if (editLocale === "en" && !alwaysRootKeys.includes(key)) {
        return {
          ...current,
          content_en: {
            ...current.content_en,
            [key]: value,
          },
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateZonesPageContent({
        hero_eyebrow: content.hero_eyebrow,
        hero_title: content.hero_title,
        hero_subtitle: content.hero_subtitle,
        hero_image_external_url: content.hero_image_external_url,
        scroll_hint: content.scroll_hint,
        content_en: content.content_en ?? {},
        is_published: content.is_published,
      });
      setContent(updated);
      setSavedAt(new Date().toLocaleTimeString("es-MX"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleHeroUpload(file: File | null) {
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await uploadZonesPageHero(file);
      setContent(updated);
      setSavedAt(new Date().toLocaleTimeString("es-MX"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="font-outfit text-sm text-tl-beige/50">Cargando textos…</p>
    );
  }

  if (!content || !previewContent) {
    return (
      <p className="font-outfit text-sm text-red-300/80">
        {error ?? "No se pudieron cargar los textos."}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-outfit text-[10px] uppercase tracking-[0.2em] text-tl-gold/80">
            CMS · Intro público
          </p>
          <h2 className="mt-1 font-outfit text-3xl font-extralight text-tl-beige">
            Textos de zonas
          </h2>
          <p className="mt-1 max-w-xl font-outfit text-sm font-light text-tl-beige/55">
            Imagen y copy del primer bloque de{" "}
            <Link
              href="/zonas"
              className="text-tl-gold/80 underline-offset-2 hover:underline"
              target="_blank"
            >
              /zonas
            </Link>
            . Los números de zonas y propiedades se calculan solos.
          </p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="rounded-full bg-tl-gold px-5 py-2.5 font-outfit text-xs uppercase tracking-[0.14em] text-tl-black disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar textos"}
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-outfit text-sm text-red-200">
          {error}
        </p>
      ) : null}
      {savedAt ? (
        <p className="font-outfit text-xs text-tl-gold/70">
          Guardado a las {savedAt}
        </p>
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

      <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 font-outfit text-sm font-light text-tl-beige/55">
        No editables aquí: <span className="text-tl-beige/80">N zonas premium</span>{" "}
        y <span className="text-tl-beige/80">N propiedades activas</span> — salen
        del catálogo y del inventario real.
      </div>

      <div className="space-y-5 rounded-2xl border border-tl-gold/15 bg-[linear-gradient(165deg,rgba(214,181,133,0.05),rgba(10,10,10,0.9)_45%)] p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelClass}>Eyebrow</span>
            <input
              className={fieldClass}
              value={previewContent.hero_eyebrow}
              placeholder={editLocale === "en" ? content.hero_eyebrow : "Eyebrow"}
              onChange={(e) => patchContent("hero_eyebrow", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Título</span>
            <input
              className={fieldClass}
              value={previewContent.hero_title}
              placeholder={editLocale === "en" ? content.hero_title : "Título"}
              onChange={(e) => patchContent("hero_title", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Párrafo de apoyo</span>
            <textarea
              className={`${fieldClass} min-h-28`}
              value={previewContent.hero_subtitle}
              placeholder={editLocale === "en" ? content.hero_subtitle : "Párrafo de apoyo"}
              onChange={(e) => patchContent("hero_subtitle", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Texto “Desplázate”</span>
            <input
              className={fieldClass}
              value={previewContent.scroll_hint}
              placeholder={editLocale === "en" ? content.scroll_hint : "Desplázate"}
              onChange={(e) => patchContent("scroll_hint", e.target.value)}
            />
          </label>
          <details className="sm:col-span-2">
            <summary className="cursor-pointer font-outfit text-[10px] uppercase tracking-[0.16em] text-tl-beige/40 hover:text-tl-gold">
              Opción avanzada: URL de imagen externa
            </summary>
            <label className="mt-3 block">
              <span className={labelClass}>URL externa</span>
              <input
                className={fieldClass}
                value={previewContent.hero_image_external_url}
                onChange={(e) =>
                  patchContent("hero_image_external_url", e.target.value)
                }
                placeholder="https://..."
              />
            </label>
          </details>
        </div>

        <div className="border-t border-white/8 pt-5">
          <ZoneImageDropzone
            previewUrl={previewContent.hero_image_url || null}
            disabled={saving}
            onFile={(file) => void handleHeroUpload(file)}
            label="Imagen del intro"
            hint="Se sube al soltar o seleccionar"
          />
        </div>
      </div>
    </div>
  );
}
