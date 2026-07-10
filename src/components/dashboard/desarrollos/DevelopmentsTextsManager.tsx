"use client";

import {
  getDevelopmentsPageContent,
  updateDevelopmentsPageContent,
  uploadDevelopmentsPageHero,
} from "@/lib/api/developments";
import type { DevelopmentsPageContent } from "@/types/developments-page";
import Link from "next/link";
import { useEffect, useState } from "react";

const fieldClass =
  "w-full rounded-xl border border-tl-gold/20 bg-[#0a0a0a] px-3 py-2.5 font-outfit text-sm font-light text-tl-beige outline-none focus:border-tl-gold/50";
const labelClass =
  "mb-1.5 block font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-gold/80";

export function DevelopmentsTextsManager() {
  const [content, setContent] = useState<DevelopmentsPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDevelopmentsPageContent()
      .then((data) => {
        if (!cancelled) setContent(data);
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

  function setField<K extends keyof DevelopmentsPageContent>(
    key: K,
    value: DevelopmentsPageContent[K],
  ) {
    setContent((current) => (current ? { ...current, [key]: value } : current));
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateDevelopmentsPageContent({
        hero_eyebrow: content.hero_eyebrow,
        hero_title: content.hero_title,
        hero_subtitle: content.hero_subtitle,
        hero_image_external_url: content.hero_image_external_url,
        empty_message: content.empty_message,
        empty_cta_label: content.empty_cta_label,
        empty_cta_url: content.empty_cta_url,
        meta_title: content.meta_title,
        meta_description: content.meta_description,
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
      const updated = await uploadDevelopmentsPageHero(file);
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

  if (!content) {
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
            CMS · Listado público
          </p>
          <h2 className="mt-1 font-cormorant text-3xl font-light text-tl-beige">
            Textos de desarrollos
          </h2>
          <p className="mt-1 font-outfit text-sm font-light text-tl-beige/55">
            Hero, mensaje vacío y SEO del listado{" "}
            <Link
              href="/propiedades/desarrollos"
              className="text-tl-gold/80 underline-offset-2 hover:underline"
              target="_blank"
            >
              /propiedades/desarrollos
            </Link>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={labelClass}>Eyebrow</span>
          <input
            className={fieldClass}
            value={content.hero_eyebrow}
            onChange={(e) => setField("hero_eyebrow", e.target.value)}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Título hero</span>
          <input
            className={fieldClass}
            value={content.hero_title}
            onChange={(e) => setField("hero_title", e.target.value)}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Subtítulo hero</span>
          <textarea
            className={`${fieldClass} min-h-24`}
            value={content.hero_subtitle}
            onChange={(e) => setField("hero_subtitle", e.target.value)}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>URL imagen hero (externa)</span>
          <input
            className={fieldClass}
            value={content.hero_image_external_url}
            onChange={(e) =>
              setField("hero_image_external_url", e.target.value)
            }
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Subir imagen hero</span>
          <input
            type="file"
            accept="image/*"
            className="font-outfit text-sm text-tl-beige/70"
            onChange={(e) =>
              void handleHeroUpload(e.target.files?.[0] ?? null)
            }
          />
          {content.hero_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.hero_image_url}
              alt=""
              className="mt-3 h-36 w-full rounded-xl object-cover"
            />
          ) : null}
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Mensaje sin desarrollos</span>
          <textarea
            className={`${fieldClass} min-h-24`}
            value={content.empty_message}
            onChange={(e) => setField("empty_message", e.target.value)}
          />
        </label>
        <label className="block">
          <span className={labelClass}>CTA vacío · texto</span>
          <input
            className={fieldClass}
            value={content.empty_cta_label}
            onChange={(e) => setField("empty_cta_label", e.target.value)}
          />
        </label>
        <label className="block">
          <span className={labelClass}>CTA vacío · URL</span>
          <input
            className={fieldClass}
            value={content.empty_cta_url}
            onChange={(e) => setField("empty_cta_url", e.target.value)}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Meta title</span>
          <input
            className={fieldClass}
            value={content.meta_title}
            onChange={(e) => setField("meta_title", e.target.value)}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Meta description</span>
          <input
            className={fieldClass}
            value={content.meta_description}
            onChange={(e) => setField("meta_description", e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 font-outfit text-sm text-tl-beige/80 sm:col-span-2">
          <input
            type="checkbox"
            checked={content.is_published}
            onChange={(e) => setField("is_published", e.target.checked)}
          />
          Publicado
        </label>
      </div>
    </div>
  );
}
