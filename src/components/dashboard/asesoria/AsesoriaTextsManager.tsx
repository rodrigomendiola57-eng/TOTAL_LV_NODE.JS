"use client";

import { ZoneImageDropzone } from "@/components/dashboard/zonas/ZoneImageDropzone";
import { AsesoriaSectionNav } from "@/components/dashboard/asesoria/AsesoriaSectionNav";
import {
  getAsesoriaPageContent,
  updateAsesoriaPageContent,
  uploadAsesoriaHeroImage,
} from "@/lib/api/asesoria";
import { cn } from "@/lib/utils";
import type {
  AsesoriaDashboardSectionId,
  AsesoriaFeatureApi,
  AsesoriaPageApiContent,
  AsesoriaPillarApi,
  AsesoriaProcessStepApi,
  AsesoriaTabApi,
} from "@/types/asesoria-page";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

const fieldClass =
  "w-full rounded-xl border border-tl-gold/20 bg-[#0a0a0a] px-3 py-2.5 font-outfit text-sm font-light text-tl-beige outline-none focus:border-tl-gold/50";
const labelClass =
  "mb-1.5 block font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-gold/80";
const cardClass =
  "rounded-2xl border border-tl-gold/15 bg-[#0a0a0a]/80 p-4 sm:p-5";

const FEATURE_ICON_OPTIONS = [
  "Search",
  "FileCheck",
  "Handshake",
  "MapPin",
  "LineChart",
  "Sparkles",
  "Users",
  "TrendingUp",
  "Target",
  "PiggyBank",
] as const;

function slugifyId(value: string): string {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || `item-${Date.now()}`
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function FeatureEditor({
  feature,
  onChange,
  onRemove,
}: {
  feature: AsesoriaFeatureApi;
  onChange: (next: AsesoriaFeatureApi) => void;
  onRemove: () => void;
}) {
  return (
    <div className={cardClass}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-outfit text-[10px] uppercase tracking-[0.16em] text-tl-gold/70">
          Card
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-red-300/80 transition-colors hover:text-red-200"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          Quitar
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Icono (Lucide)">
          <select
            className={fieldClass}
            value={feature.icon}
            onChange={(e) => onChange({ ...feature, icon: e.target.value })}
          >
            {FEATURE_ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
            {!FEATURE_ICON_OPTIONS.includes(
              feature.icon as (typeof FEATURE_ICON_OPTIONS)[number],
            ) ? (
              <option value={feature.icon}>{feature.icon}</option>
            ) : null}
          </select>
        </Field>
        <Field label="Título">
          <input
            className={fieldClass}
            value={feature.title}
            onChange={(e) => onChange({ ...feature, title: e.target.value })}
          />
        </Field>
        <Field label="Descripción" className="sm:col-span-2">
          <textarea
            className={cn(fieldClass, "min-h-[4.5rem] resize-y")}
            value={feature.description}
            onChange={(e) =>
              onChange({ ...feature, description: e.target.value })
            }
          />
        </Field>
        <Field label="Detalle (opcional)" className="sm:col-span-2">
          <input
            className={fieldClass}
            value={feature.detail ?? ""}
            onChange={(e) =>
              onChange({ ...feature, detail: e.target.value || undefined })
            }
            placeholder="Ej. Brief · shortlist"
          />
        </Field>
      </div>
    </div>
  );
}

function ProcessEditor({
  step,
  onChange,
  onRemove,
}: {
  step: AsesoriaProcessStepApi;
  onChange: (next: AsesoriaProcessStepApi) => void;
  onRemove: () => void;
}) {
  return (
    <div className={cardClass}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-outfit text-[10px] uppercase tracking-[0.16em] text-tl-gold/70">
          Paso
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-red-300/80 transition-colors hover:text-red-200"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          Quitar
        </button>
      </div>
      <div className="grid gap-3">
        <Field label="Título">
          <input
            className={fieldClass}
            value={step.title}
            onChange={(e) => {
              const title = e.target.value;
              onChange({
                ...step,
                title,
                id: step.id || slugifyId(title),
              });
            }}
          />
        </Field>
        <Field label="Descripción">
          <textarea
            className={cn(fieldClass, "min-h-[4rem] resize-y")}
            value={step.description}
            onChange={(e) =>
              onChange({ ...step, description: e.target.value })
            }
          />
        </Field>
      </div>
    </div>
  );
}

function TabSectionEditor({
  tab,
  onChange,
  showProcess,
}: {
  tab: AsesoriaTabApi;
  onChange: (next: AsesoriaTabApi) => void;
  showProcess: boolean;
}) {
  const process = tab.process ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Etiqueta del tab">
          <input
            className={fieldClass}
            value={tab.tabLabel}
            onChange={(e) => onChange({ ...tab, tabLabel: e.target.value })}
          />
        </Field>
        <Field label="Título del panel">
          <input
            className={fieldClass}
            value={tab.title}
            onChange={(e) => onChange({ ...tab, title: e.target.value })}
          />
        </Field>
        <Field label="Descripción" className="sm:col-span-2">
          <textarea
            className={cn(fieldClass, "min-h-[5rem] resize-y")}
            value={tab.description}
            onChange={(e) =>
              onChange({ ...tab, description: e.target.value })
            }
          />
        </Field>
        <Field label="Mensaje WhatsApp" className="sm:col-span-2">
          <textarea
            className={cn(fieldClass, "min-h-[3.5rem] resize-y")}
            value={tab.whatsappMessage}
            onChange={(e) =>
              onChange({ ...tab, whatsappMessage: e.target.value })
            }
          />
        </Field>
      </div>

      {showProcess ? (
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-outfit text-lg font-extralight text-tl-beige">
              Proceso
            </h3>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...tab,
                  process: [
                    ...process,
                    {
                      id: `paso-${process.length + 1}`,
                      title: "Nuevo paso",
                      description: "",
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-tl-gold/30 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-gold transition-colors hover:bg-tl-gold/10"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              Agregar paso
            </button>
          </div>
          <div className="space-y-3">
            {process.map((step, index) => (
              <ProcessEditor
                key={`${step.id}-${index}`}
                step={step}
                onChange={(next) => {
                  const nextProcess = [...process];
                  nextProcess[index] = next;
                  onChange({ ...tab, process: nextProcess });
                }}
                onRemove={() =>
                  onChange({
                    ...tab,
                    process: process.filter((_, i) => i !== index),
                  })
                }
              />
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-outfit text-lg font-extralight text-tl-beige">
            Cards / features
          </h3>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...tab,
                features: [
                  ...tab.features,
                  {
                    icon: "Sparkles",
                    title: "Nueva card",
                    description: "",
                    detail: "",
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-tl-gold/30 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-gold transition-colors hover:bg-tl-gold/10"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Agregar card
          </button>
        </div>
        <div className="space-y-3">
          {tab.features.map((feature, index) => (
            <FeatureEditor
              key={`${feature.title}-${index}`}
              feature={feature}
              onChange={(next) => {
                const nextFeatures = [...tab.features];
                nextFeatures[index] = next;
                onChange({ ...tab, features: nextFeatures });
              }}
              onRemove={() =>
                onChange({
                  ...tab,
                  features: tab.features.filter((_, i) => i !== index),
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AsesoriaTextsManager() {
  const [content, setContent] = useState<AsesoriaPageApiContent | null>(null);
  const [section, setSection] =
    useState<AsesoriaDashboardSectionId>("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [editLocale, setEditLocale] = useState<"es" | "en">("es");

  useEffect(() => {
    let cancelled = false;
    getAsesoriaPageContent({ revalidate: false, lang: "edit" })
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

  const previewContent = useMemo(() => {
    if (!content) return null;
    if (editLocale === "es") return content;
    const enPack = (content.content_en ?? {}) as Partial<AsesoriaPageApiContent>;
    return {
      ...content,
      hero_eyebrow: enPack.hero_eyebrow ?? content.hero_eyebrow,
      hero_title: enPack.hero_title ?? content.hero_title,
      hero_subtitle: enPack.hero_subtitle ?? content.hero_subtitle,
      services_title: enPack.services_title ?? content.services_title,
      tabs: enPack.tabs ?? content.tabs,
      pillars: enPack.pillars ?? content.pillars,
      cta_title: enPack.cta_title ?? content.cta_title,
      cta_subtitle: enPack.cta_subtitle ?? content.cta_subtitle,
      cta_label: enPack.cta_label ?? content.cta_label,
      cta_whatsapp_message: enPack.cta_whatsapp_message ?? content.cta_whatsapp_message,
    };
  }, [content, editLocale]);

  const activeTab = useMemo(() => {
    if (!previewContent) return null;
    if (section !== "compra" && section !== "venta" && section !== "inversion") {
      return null;
    }
    return previewContent.tabs.find((tab) => tab.id === section) ?? null;
  }, [previewContent, section]);

  function setField<K extends keyof AsesoriaPageApiContent>(
    key: K,
    value: AsesoriaPageApiContent[K],
  ) {
    setContent((current) => {
      if (!current) return current;

      const alwaysRootKeys: Array<keyof AsesoriaPageApiContent> = [
        "is_published",
        "hero_image_external_url",
      ];

      if (editLocale === "en" && !alwaysRootKeys.includes(key)) {
        return {
          ...current,
          content_en: {
            ...((current.content_en as Record<string, unknown>) ?? {}),
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

  function updateTab(tabId: string, next: AsesoriaTabApi) {
    if (!content || !previewContent) return;
    const nextTabs = previewContent.tabs.map((tab) =>
      tab.id === tabId ? next : tab,
    );
    setField("tabs", nextTabs);
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateAsesoriaPageContent({
        hero_eyebrow: content.hero_eyebrow,
        hero_title: content.hero_title,
        hero_subtitle: content.hero_subtitle,
        hero_image_external_url: content.hero_image_external_url,
        services_title: content.services_title,
        tabs: content.tabs,
        pillars: content.pillars,
        cta_title: content.cta_title,
        cta_subtitle: content.cta_subtitle,
        cta_label: content.cta_label,
        cta_whatsapp_message: content.cta_whatsapp_message,
        is_published: content.is_published,
        content_en: content.content_en ?? {},
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
      const updated = await uploadAsesoriaHeroImage(file);
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
            Textos de Asesoría
          </h2>
          <p className="mt-1 max-w-xl font-outfit text-sm font-light text-tl-beige/55">
            Edita hero, compra, venta, inversión, enfoque y CTA de{" "}
            <Link
              href="/asesoria"
              target="_blank"
              className="text-tl-gold/90 underline-offset-2 hover:underline"
            >
              /asesoria
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {savedAt ? (
            <p className="font-outfit text-[10px] uppercase tracking-[0.14em] text-emerald-300/80">
              Guardado {savedAt}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-tl-gold px-5 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="font-outfit text-sm text-red-300/90">{error}</p>
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

      <AsesoriaSectionNav active={section} onChange={setSection} />

      <div className="rounded-2xl border border-tl-gold/15 bg-[#111110] p-5 sm:p-7">
        {section === "hero" ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow">
                <input
                  className={fieldClass}
                  value={previewContent.hero_eyebrow}
                  onChange={(e) => setField("hero_eyebrow", e.target.value)}
                />
              </Field>
              <Field label="Título hero">
                <input
                  className={fieldClass}
                  value={previewContent.hero_title}
                  onChange={(e) => setField("hero_title", e.target.value)}
                />
              </Field>
              <Field label="Subtítulo" className="sm:col-span-2">
                <textarea
                  className={cn(fieldClass, "min-h-[5rem] resize-y")}
                  value={previewContent.hero_subtitle}
                  onChange={(e) => setField("hero_subtitle", e.target.value)}
                />
              </Field>
              <Field label="Título sección servicios" className="sm:col-span-2">
                <input
                  className={fieldClass}
                  value={previewContent.services_title}
                  onChange={(e) => setField("services_title", e.target.value)}
                />
              </Field>
              <Field label="URL externa de imagen (opcional)" className="sm:col-span-2">
                <input
                  className={fieldClass}
                  value={previewContent.hero_image_external_url}
                  onChange={(e) =>
                    setField("hero_image_external_url", e.target.value)
                  }
                  placeholder="https://…"
                />
              </Field>
            </div>
            <div>
              <p className={labelClass}>Imagen hero (subir)</p>
              <ZoneImageDropzone
                previewUrl={previewContent.hero_image_url || null}
                onFile={handleHeroUpload}
                disabled={saving}
                label="Imagen hero"
              />
              <p className="mt-2 font-outfit text-[11px] font-light text-tl-beige/45">
                Si no subes imagen propia, la página puede seguir usando el
                fondo de Inicio como respaldo visual.
              </p>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={previewContent.is_published}
                onChange={(e) => setField("is_published", e.target.checked)}
                className="rounded border-tl-gold/30"
              />
              <span className="font-outfit text-sm font-light text-tl-beige/80">
                Publicado en /asesoria
              </span>
            </label>
          </div>
        ) : null}

        {activeTab &&
        (section === "compra" ||
          section === "venta" ||
          section === "inversion") ? (
          <TabSectionEditor
            tab={activeTab}
            showProcess={section === "compra" || section === "venta"}
            onChange={(next) => updateTab(activeTab.id, next)}
          />
        ) : null}

        {section === "enfoque" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-outfit text-lg font-extralight text-tl-beige">
                Pilares del enfoque
              </h3>
              <button
                type="button"
                onClick={() =>
                  setField("pillars", [
                    ...previewContent.pillars,
                    {
                      id: `pilar-${previewContent.pillars.length + 1}`,
                      title: "Nuevo pilar",
                      description: "",
                    },
                  ])
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-tl-gold/30 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-gold transition-colors hover:bg-tl-gold/10"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                Agregar pilar
              </button>
            </div>
            <div className="space-y-3">
              {previewContent.pillars.map((pillar: AsesoriaPillarApi, index) => (
                <div key={`${pillar.id}-${index}`} className={cardClass}>
                  <div className="mb-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setField(
                          "pillars",
                          previewContent.pillars.filter((_, i) => i !== index),
                        )
                      }
                      className="inline-flex items-center gap-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-red-300/80 hover:text-red-200"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Quitar
                    </button>
                  </div>
                  <div className="grid gap-3">
                    <Field label="Título">
                      <input
                        className={fieldClass}
                        value={pillar.title}
                        onChange={(e) => {
                          const next = [...previewContent.pillars];
                          next[index] = {
                            ...pillar,
                            title: e.target.value,
                            id: pillar.id || slugifyId(e.target.value),
                          };
                          setField("pillars", next);
                        }}
                      />
                    </Field>
                    <Field label="Descripción">
                      <textarea
                        className={cn(fieldClass, "min-h-[4rem] resize-y")}
                        value={pillar.description}
                        onChange={(e) => {
                          const next = [...previewContent.pillars];
                          next[index] = {
                            ...pillar,
                            description: e.target.value,
                          };
                          setField("pillars", next);
                        }}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {section === "cta" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título CTA" className="sm:col-span-2">
              <input
                className={fieldClass}
                value={previewContent.cta_title}
                onChange={(e) => setField("cta_title", e.target.value)}
              />
            </Field>
            <Field label="Subtítulo" className="sm:col-span-2">
              <textarea
                className={cn(fieldClass, "min-h-[4.5rem] resize-y")}
                value={previewContent.cta_subtitle}
                onChange={(e) => setField("cta_subtitle", e.target.value)}
              />
            </Field>
            <Field label="Texto del botón">
              <input
                className={fieldClass}
                value={previewContent.cta_label}
                onChange={(e) => setField("cta_label", e.target.value)}
              />
            </Field>
            <Field label="Mensaje WhatsApp" className="sm:col-span-2">
              <textarea
                className={cn(fieldClass, "min-h-[3.5rem] resize-y")}
                value={previewContent.cta_whatsapp_message}
                onChange={(e) =>
                  setField("cta_whatsapp_message", e.target.value)
                }
              />
            </Field>
          </div>
        ) : null}
      </div>
    </div>
  );
}
