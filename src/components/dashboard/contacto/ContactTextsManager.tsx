"use client";

import { ContactSectionNav } from "@/components/dashboard/contacto/ContactSectionNav";
import {
  getContactPageContent,
  updateContactPageContent,
} from "@/lib/api/contact";
import { cn } from "@/lib/utils";
import type {
  ContactChannelApi,
  ContactDashboardSectionId,
  ContactPageApiContent,
  ContactPageEnPack,
} from "@/types/contact-page";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

const fieldClass =
  "w-full rounded-xl border border-tl-gold/20 bg-[#0a0a0a] px-3 py-2.5 font-outfit text-sm font-light text-tl-beige outline-none focus:border-tl-gold/50";
const labelClass =
  "mb-1.5 block font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-gold/80";
const cardClass =
  "rounded-2xl border border-tl-gold/15 bg-[#0a0a0a]/80 p-4 sm:p-5";

const CHANNEL_IDS: ContactChannelApi["id"][] = [
  "whatsapp",
  "email",
  "location",
];

type EditLocale = "es" | "en";

type TextKey = keyof Pick<
  ContactPageApiContent,
  | "hero_eyebrow"
  | "hero_title"
  | "hero_description"
  | "form_title"
  | "form_description"
  | "form_name_label"
  | "form_name_placeholder"
  | "form_phone_label"
  | "form_phone_hint"
  | "form_phone_placeholder"
  | "form_email_label"
  | "form_email_placeholder"
  | "form_message_label"
  | "form_message_placeholder"
  | "form_quick_prompts_label"
  | "form_submit_label"
  | "form_submitting_label"
  | "form_success_title"
  | "form_success_message"
  | "form_reset_label"
  | "reassurance_title"
  | "reassurance_footer"
  | "property_banner_label"
  | "property_banner_cta"
  | "property_form_label"
  | "seo_title"
  | "seo_description"
>;

function Field({
  label,
  children,
  className,
  hint,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className={labelClass}>{label}</span>
      {children}
      {hint ? (
        <span className="mt-1.5 block font-outfit text-[11px] font-light text-tl-beige/40">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-2xl border border-tl-gold/15 bg-[linear-gradient(165deg,rgba(214,181,133,0.05),rgba(10,10,10,0.9)_45%)] p-5 sm:p-6">
      <div>
        <h3 className="font-outfit text-xl font-extralight text-tl-beige">
          {title}
        </h3>
        <p className="mt-1 font-outfit text-sm font-light text-tl-beige/50">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function emptyEnPack(): ContactPageEnPack {
  return {
    channels: [],
    form_quick_prompts: [],
    reassurance_items: [],
  };
}

export function ContactTextsManager() {
  const [content, setContent] = useState<ContactPageApiContent | null>(null);
  const [editLocale, setEditLocale] = useState<EditLocale>("es");
  const [section, setSection] =
    useState<ContactDashboardSectionId>("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getContactPageContent({ revalidate: false, lang: "edit" })
      .then((data) => {
        if (cancelled) return;
        setContent({
          ...data,
          content_en: data.content_en ?? emptyEnPack(),
        });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar textos",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function getStr(key: TextKey): string {
    if (!content) return "";
    if (editLocale === "es") return content[key] ?? "";
    const pack = content.content_en ?? {};
    const value = pack[key];
    return typeof value === "string" ? value : "";
  }

  function setStr(key: TextKey, value: string) {
    setContent((current) => {
      if (!current) return current;
      if (editLocale === "es") {
        return { ...current, [key]: value };
      }
      return {
        ...current,
        content_en: { ...(current.content_en ?? {}), [key]: value },
      };
    });
  }

  function getChannels(): ContactChannelApi[] {
    if (!content) return [];
    if (editLocale === "es") return content.channels;
    const enChannels = content.content_en?.channels;
    return Array.isArray(enChannels) ? enChannels : [];
  }

  function updateChannel(index: number, patch: Partial<ContactChannelApi>) {
    setContent((current) => {
      if (!current) return current;
      if (editLocale === "es") {
        const channels = current.channels.map((ch, i) =>
          i === index ? { ...ch, ...patch } : ch,
        );
        return { ...current, channels };
      }
      const pack = current.content_en ?? emptyEnPack();
      const channels = (pack.channels ?? []).map((ch, i) =>
        i === index ? { ...ch, ...patch } : ch,
      );
      return { ...current, content_en: { ...pack, channels } };
    });
  }

  function getPrompts(): string[] {
    if (!content) return [];
    if (editLocale === "es") return content.form_quick_prompts;
    const list = content.content_en?.form_quick_prompts;
    return Array.isArray(list) ? list : [];
  }

  function setPrompts(next: string[]) {
    setContent((current) => {
      if (!current) return current;
      if (editLocale === "es") {
        return { ...current, form_quick_prompts: next };
      }
      return {
        ...current,
        content_en: {
          ...(current.content_en ?? {}),
          form_quick_prompts: next,
        },
      };
    });
  }

  function getReassuranceItems(): string[] {
    if (!content) return [];
    if (editLocale === "es") return content.reassurance_items;
    const list = content.content_en?.reassurance_items;
    return Array.isArray(list) ? list : [];
  }

  function setReassuranceItems(next: string[]) {
    setContent((current) => {
      if (!current) return current;
      if (editLocale === "es") {
        return { ...current, reassurance_items: next };
      }
      return {
        ...current,
        content_en: {
          ...(current.content_en ?? {}),
          reassurance_items: next,
        },
      };
    });
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateContactPageContent({
        hero_eyebrow: content.hero_eyebrow,
        hero_title: content.hero_title,
        hero_description: content.hero_description,
        channels: content.channels,
        form_title: content.form_title,
        form_description: content.form_description,
        form_name_label: content.form_name_label,
        form_name_placeholder: content.form_name_placeholder,
        form_phone_label: content.form_phone_label,
        form_phone_hint: content.form_phone_hint,
        form_phone_placeholder: content.form_phone_placeholder,
        form_email_label: content.form_email_label,
        form_email_placeholder: content.form_email_placeholder,
        form_message_label: content.form_message_label,
        form_message_placeholder: content.form_message_placeholder,
        form_quick_prompts_label: content.form_quick_prompts_label,
        form_quick_prompts: content.form_quick_prompts,
        form_submit_label: content.form_submit_label,
        form_submitting_label: content.form_submitting_label,
        form_success_title: content.form_success_title,
        form_success_message: content.form_success_message,
        form_reset_label: content.form_reset_label,
        reassurance_title: content.reassurance_title,
        reassurance_items: content.reassurance_items,
        reassurance_footer: content.reassurance_footer,
        property_banner_label: content.property_banner_label,
        property_banner_cta: content.property_banner_cta,
        property_form_label: content.property_form_label,
        seo_title: content.seo_title,
        seo_description: content.seo_description,
        content_en: content.content_en ?? {},
        is_published: content.is_published,
      });
      setContent({
        ...updated,
        content_en: updated.content_en ?? emptyEnPack(),
      });
      setSavedAt(new Date().toLocaleTimeString("es-MX"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  const sectionMeta = useMemo(
    () =>
      ({
        hero: {
          title: "Hero",
          description: "Textos principales de la portada de /contacto.",
        },
        channels: {
          title: "Canales de contacto",
          description:
            "WhatsApp, correo y ubicación visibles junto al formulario.",
        },
        form: {
          title: "Formulario",
          description:
            "Labels, placeholders, chips rápidos y mensajes de éxito.",
        },
        reassurance: {
          title: "Bloque de confianza",
          description: "Lista de beneficios y pie de horario.",
        },
        seo: {
          title: "SEO y publicación",
          description: "Metadatos de la página y estado publicado.",
        },
      }) as const,
    [],
  );

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

  const channels = getChannels();
  const prompts = getPrompts();
  const reassuranceItems = getReassuranceItems();
  const enHint =
    editLocale === "en"
      ? "Vacío = se muestra el texto en español (fallback)."
      : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-outfit text-[10px] uppercase tracking-[0.2em] text-tl-gold/80">
            CMS · Página pública
          </p>
          <h2 className="mt-1 font-outfit text-3xl font-extralight text-tl-beige">
            Contacto
          </h2>
          <p className="mt-1 max-w-xl font-outfit text-sm font-light text-tl-beige/55">
            Edita los textos de{" "}
            <Link
              href="/contacto"
              className="text-tl-gold/80 underline-offset-2 hover:underline"
              target="_blank"
            >
              /contacto
            </Link>
            . Guarda ES y EN por separado; EN vacío usa el español.
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

      <div
        className="inline-flex rounded-full border border-tl-gold/25 bg-black/30 p-1"
        role="tablist"
        aria-label="Idioma de edición"
      >
        {([
          { id: "es", label: "Español" },
          { id: "en", label: "English" },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={editLocale === tab.id}
            onClick={() => setEditLocale(tab.id)}
            className={cn(
              "rounded-full px-4 py-2 font-outfit text-xs font-light uppercase tracking-[0.14em] transition-colors",
              editLocale === tab.id
                ? "bg-tl-gold text-tl-black"
                : "text-tl-beige/70 hover:text-tl-gold",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ContactSectionNav active={section} onChange={setSection} />

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

      {section === "hero" ? (
        <SectionCard {...sectionMeta.hero}>
          <div className="grid gap-4">
            <Field label="Eyebrow" hint={enHint}>
              <input
                className={fieldClass}
                value={getStr("hero_eyebrow")}
                onChange={(e) => setStr("hero_eyebrow", e.target.value)}
              />
            </Field>
            <Field label="Título" hint={enHint}>
              <input
                className={fieldClass}
                value={getStr("hero_title")}
                onChange={(e) => setStr("hero_title", e.target.value)}
              />
            </Field>
            <Field label="Descripción" hint={enHint}>
              <textarea
                className={cn(fieldClass, "min-h-28 resize-y")}
                value={getStr("hero_description")}
                onChange={(e) => setStr("hero_description", e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Etiqueta banner propiedad" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("property_banner_label")}
                  onChange={(e) =>
                    setStr("property_banner_label", e.target.value)
                  }
                />
              </Field>
              <Field label="CTA banner propiedad" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("property_banner_cta")}
                  onChange={(e) =>
                    setStr("property_banner_cta", e.target.value)
                  }
                />
              </Field>
              <Field
                label="Etiqueta form con propiedad"
                className="sm:col-span-2"
                hint={enHint}
              >
                <input
                  className={fieldClass}
                  value={getStr("property_form_label")}
                  onChange={(e) =>
                    setStr("property_form_label", e.target.value)
                  }
                />
              </Field>
            </div>
          </div>
        </SectionCard>
      ) : null}

      {section === "channels" ? (
        <SectionCard {...sectionMeta.channels}>
          {editLocale === "en" && channels.length === 0 ? (
            <p className="font-outfit text-sm text-tl-beige/45">
              Sin canales EN. Se mostrarán los de español. Copia desde ES o
              añade valores aquí y guarda.
            </p>
          ) : null}
          <div className="space-y-4">
            {channels.map((channel, index) => (
              <div key={`${channel.id}-${index}`} className={cardClass}>
                <p className="mb-3 font-outfit text-[10px] uppercase tracking-[0.16em] text-tl-gold/70">
                  Canal {index + 1}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Tipo">
                    <select
                      className={fieldClass}
                      value={channel.id}
                      onChange={(e) =>
                        updateChannel(index, {
                          id: e.target.value as ContactChannelApi["id"],
                        })
                      }
                    >
                      {CHANNEL_IDS.map((id) => (
                        <option key={id} value={id}>
                          {id}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Label" hint={enHint}>
                    <input
                      className={fieldClass}
                      value={channel.label}
                      onChange={(e) =>
                        updateChannel(index, { label: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Valor visible" hint={enHint}>
                    <input
                      className={fieldClass}
                      value={channel.value}
                      onChange={(e) =>
                        updateChannel(index, { value: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Hint" hint={enHint}>
                    <input
                      className={fieldClass}
                      value={channel.hint}
                      onChange={(e) =>
                        updateChannel(index, { hint: e.target.value })
                      }
                    />
                  </Field>
                  <Field
                    label="Enlace (href)"
                    className="sm:col-span-2"
                    hint="Ej. https://wa.me/..., mailto:..., /zonas"
                  >
                    <input
                      className={fieldClass}
                      value={channel.href}
                      onChange={(e) =>
                        updateChannel(index, { href: e.target.value })
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
            {editLocale === "en" && channels.length === 0 ? (
              <button
                type="button"
                onClick={() =>
                  setContent((current) => {
                    if (!current) return current;
                    return {
                      ...current,
                      content_en: {
                        ...(current.content_en ?? {}),
                        channels: current.channels.map((ch) => ({ ...ch })),
                      },
                    };
                  })
                }
                className="font-outfit text-xs uppercase tracking-[0.14em] text-tl-gold/80 hover:text-tl-gold"
              >
                Copiar canales desde Español
              </button>
            ) : null}
          </div>
        </SectionCard>
      ) : null}

      {section === "form" ? (
        <SectionCard {...sectionMeta.form}>
          <div className="grid gap-4">
            <Field label="Título del formulario" hint={enHint}>
              <input
                className={fieldClass}
                value={getStr("form_title")}
                onChange={(e) => setStr("form_title", e.target.value)}
              />
            </Field>
            <Field label="Descripción" hint={enHint}>
              <textarea
                className={cn(fieldClass, "min-h-20 resize-y")}
                value={getStr("form_description")}
                onChange={(e) => setStr("form_description", e.target.value)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Label nombre" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_name_label")}
                  onChange={(e) => setStr("form_name_label", e.target.value)}
                />
              </Field>
              <Field label="Placeholder nombre" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_name_placeholder")}
                  onChange={(e) =>
                    setStr("form_name_placeholder", e.target.value)
                  }
                />
              </Field>
              <Field label="Label teléfono" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_phone_label")}
                  onChange={(e) => setStr("form_phone_label", e.target.value)}
                />
              </Field>
              <Field label="Hint teléfono" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_phone_hint")}
                  onChange={(e) => setStr("form_phone_hint", e.target.value)}
                />
              </Field>
              <Field label="Placeholder teléfono" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_phone_placeholder")}
                  onChange={(e) =>
                    setStr("form_phone_placeholder", e.target.value)
                  }
                />
              </Field>
              <Field label="Label correo" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_email_label")}
                  onChange={(e) => setStr("form_email_label", e.target.value)}
                />
              </Field>
              <Field
                label="Placeholder correo"
                className="sm:col-span-2"
                hint={enHint}
              >
                <input
                  className={fieldClass}
                  value={getStr("form_email_placeholder")}
                  onChange={(e) =>
                    setStr("form_email_placeholder", e.target.value)
                  }
                />
              </Field>
              <Field label="Label mensaje" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_message_label")}
                  onChange={(e) => setStr("form_message_label", e.target.value)}
                />
              </Field>
              <Field label="Placeholder mensaje" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_message_placeholder")}
                  onChange={(e) =>
                    setStr("form_message_placeholder", e.target.value)
                  }
                />
              </Field>
            </div>

            <Field label="Label chips rápidos" hint={enHint}>
              <input
                className={fieldClass}
                value={getStr("form_quick_prompts_label")}
                onChange={(e) =>
                  setStr("form_quick_prompts_label", e.target.value)
                }
              />
            </Field>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className={labelClass}>Respuestas rápidas</p>
                <button
                  type="button"
                  onClick={() =>
                    setPrompts([
                      ...prompts,
                      editLocale === "en" ? "New reply" : "Nueva respuesta",
                    ])
                  }
                  className="inline-flex items-center gap-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-gold/80 hover:text-tl-gold"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Agregar
                </button>
              </div>
              {prompts.map((prompt, index) => (
                <div key={`prompt-${index}`} className="flex gap-2">
                  <input
                    className={fieldClass}
                    value={prompt}
                    onChange={(e) => {
                      const next = prompts.map((item, i) =>
                        i === index ? e.target.value : item,
                      );
                      setPrompts(next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPrompts(prompts.filter((_, i) => i !== index))
                    }
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/20 text-red-300/80 hover:bg-red-500/10"
                    aria-label="Quitar respuesta rápida"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Botón enviar" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_submit_label")}
                  onChange={(e) => setStr("form_submit_label", e.target.value)}
                />
              </Field>
              <Field label="Botón enviando…" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_submitting_label")}
                  onChange={(e) =>
                    setStr("form_submitting_label", e.target.value)
                  }
                />
              </Field>
              <Field label="Éxito — título" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_success_title")}
                  onChange={(e) => setStr("form_success_title", e.target.value)}
                />
              </Field>
              <Field label="Éxito — botón reset" hint={enHint}>
                <input
                  className={fieldClass}
                  value={getStr("form_reset_label")}
                  onChange={(e) => setStr("form_reset_label", e.target.value)}
                />
              </Field>
              <Field
                label="Éxito — mensaje"
                className="sm:col-span-2"
                hint={enHint}
              >
                <textarea
                  className={cn(fieldClass, "min-h-24 resize-y")}
                  value={getStr("form_success_message")}
                  onChange={(e) =>
                    setStr("form_success_message", e.target.value)
                  }
                />
              </Field>
            </div>
          </div>
        </SectionCard>
      ) : null}

      {section === "reassurance" ? (
        <SectionCard {...sectionMeta.reassurance}>
          <div className="grid gap-4">
            <Field label="Título del bloque" hint={enHint}>
              <input
                className={fieldClass}
                value={getStr("reassurance_title")}
                onChange={(e) => setStr("reassurance_title", e.target.value)}
              />
            </Field>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className={labelClass}>Puntos</p>
                <button
                  type="button"
                  onClick={() =>
                    setReassuranceItems([
                      ...reassuranceItems,
                      editLocale === "en"
                        ? "New trust point"
                        : "Nuevo punto de confianza",
                    ])
                  }
                  className="inline-flex items-center gap-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-gold/80 hover:text-tl-gold"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Agregar
                </button>
              </div>
              {reassuranceItems.map((item, index) => (
                <div key={`reassure-${index}`} className="flex gap-2">
                  <input
                    className={fieldClass}
                    value={item}
                    onChange={(e) => {
                      const next = reassuranceItems.map((row, i) =>
                        i === index ? e.target.value : row,
                      );
                      setReassuranceItems(next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setReassuranceItems(
                        reassuranceItems.filter((_, i) => i !== index),
                      )
                    }
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/20 text-red-300/80 hover:bg-red-500/10"
                    aria-label="Quitar punto"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
            <Field label="Pie (horario / nota)" hint={enHint}>
              <input
                className={fieldClass}
                value={getStr("reassurance_footer")}
                onChange={(e) => setStr("reassurance_footer", e.target.value)}
              />
            </Field>
          </div>
        </SectionCard>
      ) : null}

      {section === "seo" ? (
        <SectionCard {...sectionMeta.seo}>
          <div className="grid gap-4">
            <Field label="SEO title" hint={enHint}>
              <input
                className={fieldClass}
                value={getStr("seo_title")}
                onChange={(e) => setStr("seo_title", e.target.value)}
              />
            </Field>
            <Field label="SEO description" hint={enHint}>
              <textarea
                className={cn(fieldClass, "min-h-24 resize-y")}
                value={getStr("seo_description")}
                onChange={(e) => setStr("seo_description", e.target.value)}
              />
            </Field>
            {editLocale === "es" ? (
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <input
                  type="checkbox"
                  checked={content.is_published}
                  onChange={(e) =>
                    setContent((current) =>
                      current
                        ? { ...current, is_published: e.target.checked }
                        : current,
                    )
                  }
                  className="h-4 w-4 accent-[#d6b585]"
                />
                <span className="font-outfit text-sm font-light text-tl-beige/80">
                  Publicado en /contacto
                </span>
              </label>
            ) : (
              <p className="font-outfit text-xs text-tl-beige/45">
                El estado de publicación es global (se edita en Español).
              </p>
            )}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
