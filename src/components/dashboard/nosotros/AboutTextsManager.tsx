"use client";

import { ZoneImageDropzone } from "@/components/dashboard/zonas/ZoneImageDropzone";
import {
  getAboutPageContent,
  updateAboutPageContent,
  uploadAboutMissionImage,
  uploadAboutVisionImage,
} from "@/lib/api/about";
import type { AboutPageContent } from "@/types/about-page";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const fieldClass =
  "w-full rounded-xl border border-tl-gold/20 bg-[#0a0a0a] px-3 py-2.5 font-outfit text-sm font-light text-tl-beige outline-none focus:border-tl-gold/50";
const labelClass =
  "mb-1.5 block font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-gold/80";

export function AboutTextsManager() {
  const [content, setContent] = useState<AboutPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [editLocale, setEditLocale] = useState<"es" | "en">("es");

  useEffect(() => {
    let cancelled = false;
    getAboutPageContent({ revalidate: false, lang: "edit" })
      .then((data) => {
        if (!cancelled) {
          setContent(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar");
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
    const enPack = (content.content_en ?? {}) as Partial<AboutPageContent>;

    const philosophy_pillars = (content.philosophy_pillars ?? []).map((p, idx) => {
      const enPillars = enPack.philosophy_pillars ?? [];
      const enP = enPillars[idx] || {};
      return {
        ...p,
        title: enP.title ?? "",
        description: enP.description ?? "",
      };
    });

    const values = (content.values ?? []).map((v, idx) => {
      const enValues = enPack.values ?? [];
      const enV = enValues[idx] || {};
      return {
        ...v,
        title: enV.title ?? "",
        description: enV.description ?? "",
      };
    });

    return {
      ...content,
      philosophy_title: enPack.philosophy_title ?? "",
      philosophy_subtitle: enPack.philosophy_subtitle ?? "",
      philosophy_intro_lines: enPack.philosophy_intro_lines ?? [],
      philosophy_method_closing: enPack.philosophy_method_closing ?? "",
      philosophy_pillars,
      values,
      mission_title: enPack.mission_title ?? "",
      mission_statement: enPack.mission_statement ?? "",
      vision_title: enPack.vision_title ?? "",
      vision_statement: enPack.vision_statement ?? "",
      team_eyebrow: enPack.team_eyebrow ?? "",
      team_title: enPack.team_title ?? "",
      org_eyebrow: enPack.org_eyebrow ?? "",
      org_title: enPack.org_title ?? "",
      cta_eyebrow: enPack.cta_eyebrow ?? "",
      cta_title: enPack.cta_title ?? "",
      cta_body: enPack.cta_body ?? "",
      cta_primary_label: enPack.cta_primary_label ?? "",
      cta_secondary_label: enPack.cta_secondary_label ?? "",
    };
  }, [content, editLocale]);

  function patchContent<K extends keyof AboutPageContent>(
    key: K,
    value: AboutPageContent[K],
  ) {
    setContent((current) => {
      if (!current) return current;

      const alwaysRootKeys: Array<keyof AboutPageContent> = [
        "is_published",
        "section_nav",
        "org_chart",
        "cta_primary_url",
        "cta_secondary_url",
        "mission_image_external_url",
        "vision_image_external_url",
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
      const updated = await updateAboutPageContent({
        philosophy_title: content.philosophy_title,
        philosophy_subtitle: content.philosophy_subtitle,
        philosophy_intro_lines: content.philosophy_intro_lines,
        philosophy_method_closing: content.philosophy_method_closing,
        philosophy_pillars: content.philosophy_pillars,
        values: content.values,
        mission_title: content.mission_title,
        mission_statement: content.mission_statement,
        vision_title: content.vision_title,
        vision_statement: content.vision_statement,
        mission_image_external_url: content.mission_image_external_url,
        vision_image_external_url: content.vision_image_external_url,
        team_eyebrow: content.team_eyebrow,
        team_title: content.team_title,
        org_eyebrow: content.org_eyebrow,
        org_title: content.org_title,
        org_chart: content.org_chart,
        cta_eyebrow: content.cta_eyebrow,
        cta_title: content.cta_title,
        cta_body: content.cta_body,
        cta_primary_label: content.cta_primary_label,
        cta_primary_url: content.cta_primary_url,
        cta_secondary_label: content.cta_secondary_label,
        cta_secondary_url: content.cta_secondary_url,
        section_nav: content.section_nav,
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

  async function handleMissionUpload(file: File | null) {
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await uploadAboutMissionImage(file);
      setContent(updated);
      setSavedAt(new Date().toLocaleTimeString("es-MX"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir");
    } finally {
      setSaving(false);
    }
  }

  async function handleVisionUpload(file: File | null) {
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await uploadAboutVisionImage(file);
      setContent(updated);
      setSavedAt(new Date().toLocaleTimeString("es-MX"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir");
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
            CMS · Página pública
          </p>
          <h2 className="mt-1 font-outfit text-3xl font-extralight text-tl-beige">
            Textos de Nosotros
          </h2>
          <p className="mt-1 max-w-xl font-outfit text-sm font-light text-tl-beige/55">
            Contenido de{" "}
            <Link
              href="/nosotros"
              target="_blank"
              className="text-tl-gold/80 underline-offset-2 hover:underline"
            >
              /nosotros
            </Link>
            . El equipo se edita en el otro apartado.
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

      <section className="space-y-4 rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] p-5">
        <h3 className="font-outfit text-xl font-extralight text-tl-beige">
          Filosofía
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelClass}>Título</span>
            <input
              className={fieldClass}
              value={previewContent.philosophy_title}
              placeholder={editLocale === "en" ? content.philosophy_title : "Título"}
              onChange={(e) => patchContent("philosophy_title", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Subtítulo</span>
            <input
              className={fieldClass}
              value={previewContent.philosophy_subtitle}
              placeholder={editLocale === "en" ? content.philosophy_subtitle : "Subtítulo"}
              onChange={(e) => patchContent("philosophy_subtitle", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Intro (una línea por renglón)</span>
            <textarea
              className={`${fieldClass} min-h-24`}
              value={previewContent.philosophy_intro_lines.join("\n")}
              placeholder={editLocale === "en" ? content.philosophy_intro_lines.join("\n") : "Intro"}
              onChange={(e) =>
                patchContent(
                  "philosophy_intro_lines",
                  e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                )
              }
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Cierre del método</span>
            <input
              className={fieldClass}
              value={previewContent.philosophy_method_closing}
              placeholder={editLocale === "en" ? content.philosophy_method_closing : "Cierre del método"}
              onChange={(e) =>
                patchContent("philosophy_method_closing", e.target.value)
              }
            />
          </label>
        </div>

        <div className="space-y-3 border-t border-white/8 pt-4">
          <p className={labelClass}>Pilares TOTAL</p>
          {previewContent.philosophy_pillars.map((pillar, index) => (
            <div
              key={pillar.id || index}
              className="grid gap-3 rounded-xl border border-white/8 p-3 sm:grid-cols-[4rem_1fr_1fr]"
            >
              <input
                className={fieldClass}
                value={pillar.letter}
                onChange={(e) => {
                  const next = [...previewContent.philosophy_pillars];
                  next[index] = { ...pillar, letter: e.target.value };
                  patchContent("philosophy_pillars", next);
                }}
                aria-label="Letra"
              />
              <input
                className={fieldClass}
                value={pillar.title}
                placeholder={editLocale === "en" ? (content.philosophy_pillars[index]?.title || "") : "Título"}
                onChange={(e) => {
                  const next = [...previewContent.philosophy_pillars];
                  next[index] = { ...pillar, title: e.target.value };
                  patchContent("philosophy_pillars", next);
                }}
              />
              <input
                className={fieldClass}
                value={pillar.description}
                placeholder={editLocale === "en" ? (content.philosophy_pillars[index]?.description || "") : "Descripción"}
                onChange={(e) => {
                  const next = [...previewContent.philosophy_pillars];
                  next[index] = { ...pillar, description: e.target.value };
                  patchContent("philosophy_pillars", next);
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] p-5">
        <h3 className="font-outfit text-xl font-extralight text-tl-beige">
          Valores
        </h3>
        {previewContent.values.map((value, index) => (
          <div
            key={value.id || index}
            className="grid gap-3 rounded-xl border border-white/8 p-3 sm:grid-cols-2"
          >
            <label className="block">
              <span className={labelClass}>Título</span>
              <input
                className={fieldClass}
                value={value.title}
                placeholder={editLocale === "en" ? (content.values[index]?.title || "") : "Título"}
                onChange={(e) => {
                  const next = [...previewContent.values];
                  next[index] = { ...value, title: e.target.value };
                  patchContent("values", next);
                }}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Descripción</span>
              <textarea
                className={`${fieldClass} min-h-20`}
                value={value.description}
                placeholder={editLocale === "en" ? (content.values[index]?.description || "") : "Descripción"}
                onChange={(e) => {
                  const next = [...previewContent.values];
                  next[index] = { ...value, description: e.target.value };
                  patchContent("values", next);
                }}
              />
            </label>
          </div>
        ))}
      </section>

      <section className="space-y-5 rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] p-5">
        <h3 className="font-outfit text-xl font-extralight text-tl-beige">
          Misión y visión
        </h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className={labelClass}>Título misión</span>
              <input
                className={fieldClass}
                value={previewContent.mission_title}
                placeholder={editLocale === "en" ? content.mission_title : "Misión"}
                onChange={(e) => patchContent("mission_title", e.target.value)}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Texto misión</span>
              <textarea
                className={`${fieldClass} min-h-28`}
                value={previewContent.mission_statement}
                placeholder={editLocale === "en" ? content.mission_statement : "Texto misión"}
                onChange={(e) => patchContent("mission_statement", e.target.value)}
              />
            </label>
            <ZoneImageDropzone
              previewUrl={previewContent.mission_image_url || null}
              disabled={saving}
              onFile={(file) => void handleMissionUpload(file)}
              label="Imagen misión"
              hint="Se sube al soltar o seleccionar"
            />
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className={labelClass}>Título visión</span>
              <input
                className={fieldClass}
                value={previewContent.vision_title}
                placeholder={editLocale === "en" ? content.vision_title : "Visión"}
                onChange={(e) => patchContent("vision_title", e.target.value)}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Texto visión</span>
              <textarea
                className={`${fieldClass} min-h-28`}
                value={previewContent.vision_statement}
                placeholder={editLocale === "en" ? content.vision_statement : "Texto visión"}
                onChange={(e) => patchContent("vision_statement", e.target.value)}
              />
            </label>
            <ZoneImageDropzone
              previewUrl={previewContent.vision_image_url || null}
              disabled={saving}
              onFile={(file) => void handleVisionUpload(file)}
              label="Imagen visión"
              hint="Se sube al soltar o seleccionar"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] p-5">
        <h3 className="font-outfit text-xl font-extralight text-tl-beige">
          Sección equipo (títulos)
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Eyebrow equipo</span>
            <input
              className={fieldClass}
              value={previewContent.team_eyebrow}
              placeholder={editLocale === "en" ? content.team_eyebrow : "Eyebrow"}
              onChange={(e) => patchContent("team_eyebrow", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Título equipo</span>
            <input
              className={fieldClass}
              value={previewContent.team_title}
              placeholder={editLocale === "en" ? content.team_title : "Título"}
              onChange={(e) => patchContent("team_title", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Eyebrow organigrama</span>
            <input
              className={fieldClass}
              value={previewContent.org_eyebrow}
              placeholder={editLocale === "en" ? content.org_eyebrow : "Eyebrow"}
              onChange={(e) => patchContent("org_eyebrow", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Título organigrama</span>
            <input
              className={fieldClass}
              value={previewContent.org_title}
              placeholder={editLocale === "en" ? content.org_title : "Título"}
              onChange={(e) => patchContent("org_title", e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] p-5">
        <h3 className="font-outfit text-xl font-extralight text-tl-beige">
          CTA final
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelClass}>Eyebrow</span>
            <input
              className={fieldClass}
              value={previewContent.cta_eyebrow}
              placeholder={editLocale === "en" ? content.cta_eyebrow : "Eyebrow"}
              onChange={(e) => patchContent("cta_eyebrow", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Título</span>
            <input
              className={fieldClass}
              value={previewContent.cta_title}
              placeholder={editLocale === "en" ? content.cta_title : "Título"}
              onChange={(e) => patchContent("cta_title", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Texto</span>
            <textarea
              className={`${fieldClass} min-h-24`}
              value={previewContent.cta_body}
              placeholder={editLocale === "en" ? content.cta_body : "Texto"}
              onChange={(e) => patchContent("cta_body", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Botón primario</span>
            <input
              className={fieldClass}
              value={previewContent.cta_primary_label}
              placeholder={editLocale === "en" ? content.cta_primary_label : "Botón primario"}
              onChange={(e) => patchContent("cta_primary_label", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>URL primaria</span>
            <input
              className={fieldClass}
              value={previewContent.cta_primary_url}
              onChange={(e) => patchContent("cta_primary_url", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Botón secundario</span>
            <input
              className={fieldClass}
              value={previewContent.cta_secondary_label}
              placeholder={editLocale === "en" ? content.cta_secondary_label : "Botón secundario"}
              onChange={(e) => patchContent("cta_secondary_label", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>URL secundaria</span>
            <input
              className={fieldClass}
              value={previewContent.cta_secondary_url}
              onChange={(e) => patchContent("cta_secondary_url", e.target.value)}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
