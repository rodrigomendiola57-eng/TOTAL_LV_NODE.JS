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
import { useEffect, useState } from "react";

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

  useEffect(() => {
    let cancelled = false;
    getAboutPageContent({ revalidate: false })
      .then((data) => {
        if (!cancelled) setContent(data);
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

  function setField<K extends keyof AboutPageContent>(
    key: K,
    value: AboutPageContent[K],
  ) {
    setContent((current) => (current ? { ...current, [key]: value } : current));
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

      <section className="space-y-4 rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] p-5">
        <h3 className="font-outfit text-xl font-extralight text-tl-beige">
          Filosofía
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelClass}>Título</span>
            <input
              className={fieldClass}
              value={content.philosophy_title}
              onChange={(e) => setField("philosophy_title", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Subtítulo</span>
            <input
              className={fieldClass}
              value={content.philosophy_subtitle}
              onChange={(e) => setField("philosophy_subtitle", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Intro (una línea por renglón)</span>
            <textarea
              className={`${fieldClass} min-h-24`}
              value={content.philosophy_intro_lines.join("\n")}
              onChange={(e) =>
                setField(
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
              value={content.philosophy_method_closing}
              onChange={(e) =>
                setField("philosophy_method_closing", e.target.value)
              }
            />
          </label>
        </div>

        <div className="space-y-3 border-t border-white/8 pt-4">
          <p className={labelClass}>Pilares TOTAL</p>
          {content.philosophy_pillars.map((pillar, index) => (
            <div
              key={pillar.id || index}
              className="grid gap-3 rounded-xl border border-white/8 p-3 sm:grid-cols-[4rem_1fr_1fr]"
            >
              <input
                className={fieldClass}
                value={pillar.letter}
                onChange={(e) => {
                  const next = [...content.philosophy_pillars];
                  next[index] = { ...pillar, letter: e.target.value };
                  setField("philosophy_pillars", next);
                }}
                aria-label="Letra"
              />
              <input
                className={fieldClass}
                value={pillar.title}
                onChange={(e) => {
                  const next = [...content.philosophy_pillars];
                  next[index] = { ...pillar, title: e.target.value };
                  setField("philosophy_pillars", next);
                }}
                placeholder="Título"
              />
              <input
                className={fieldClass}
                value={pillar.description}
                onChange={(e) => {
                  const next = [...content.philosophy_pillars];
                  next[index] = { ...pillar, description: e.target.value };
                  setField("philosophy_pillars", next);
                }}
                placeholder="Descripción"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] p-5">
        <h3 className="font-outfit text-xl font-extralight text-tl-beige">
          Valores
        </h3>
        {content.values.map((value, index) => (
          <div
            key={value.id || index}
            className="grid gap-3 rounded-xl border border-white/8 p-3 sm:grid-cols-2"
          >
            <label className="block">
              <span className={labelClass}>Título</span>
              <input
                className={fieldClass}
                value={value.title}
                onChange={(e) => {
                  const next = [...content.values];
                  next[index] = { ...value, title: e.target.value };
                  setField("values", next);
                }}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Descripción</span>
              <textarea
                className={`${fieldClass} min-h-20`}
                value={value.description}
                onChange={(e) => {
                  const next = [...content.values];
                  next[index] = { ...value, description: e.target.value };
                  setField("values", next);
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
                value={content.mission_title}
                onChange={(e) => setField("mission_title", e.target.value)}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Texto misión</span>
              <textarea
                className={`${fieldClass} min-h-28`}
                value={content.mission_statement}
                onChange={(e) => setField("mission_statement", e.target.value)}
              />
            </label>
            <ZoneImageDropzone
              previewUrl={content.mission_image_url || null}
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
                value={content.vision_title}
                onChange={(e) => setField("vision_title", e.target.value)}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Texto visión</span>
              <textarea
                className={`${fieldClass} min-h-28`}
                value={content.vision_statement}
                onChange={(e) => setField("vision_statement", e.target.value)}
              />
            </label>
            <ZoneImageDropzone
              previewUrl={content.vision_image_url || null}
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
              value={content.team_eyebrow}
              onChange={(e) => setField("team_eyebrow", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Título equipo</span>
            <input
              className={fieldClass}
              value={content.team_title}
              onChange={(e) => setField("team_title", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Eyebrow organigrama</span>
            <input
              className={fieldClass}
              value={content.org_eyebrow}
              onChange={(e) => setField("org_eyebrow", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Título organigrama</span>
            <input
              className={fieldClass}
              value={content.org_title}
              onChange={(e) => setField("org_title", e.target.value)}
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
              value={content.cta_eyebrow}
              onChange={(e) => setField("cta_eyebrow", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Título</span>
            <input
              className={fieldClass}
              value={content.cta_title}
              onChange={(e) => setField("cta_title", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Texto</span>
            <textarea
              className={`${fieldClass} min-h-24`}
              value={content.cta_body}
              onChange={(e) => setField("cta_body", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Botón primario</span>
            <input
              className={fieldClass}
              value={content.cta_primary_label}
              onChange={(e) => setField("cta_primary_label", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>URL primaria</span>
            <input
              className={fieldClass}
              value={content.cta_primary_url}
              onChange={(e) => setField("cta_primary_url", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Botón secundario</span>
            <input
              className={fieldClass}
              value={content.cta_secondary_label}
              onChange={(e) => setField("cta_secondary_label", e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>URL secundaria</span>
            <input
              className={fieldClass}
              value={content.cta_secondary_url}
              onChange={(e) => setField("cta_secondary_url", e.target.value)}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
