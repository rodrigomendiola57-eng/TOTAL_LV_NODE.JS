"use client";

import { DevelopmentMediaEditor } from "@/components/dashboard/desarrollos/DevelopmentMediaEditor";
import { DevelopmentModelsEditor } from "@/components/dashboard/desarrollos/DevelopmentModelsEditor";
import {
  FormField,
  FormSection,
  formInputClass,
} from "@/components/dashboard/form/FormField";
import { FeaturedToggle } from "@/components/dashboard/form/FeaturedToggle";
import { FormStepIndicator } from "@/components/dashboard/form/FormStepIndicator";
import { NumberStepper } from "@/components/dashboard/form/NumberStepper";
import { TagChipsInput } from "@/components/dashboard/form/TagChipsInput";
import { ZoneSelector } from "@/components/dashboard/form/ZoneSelector";
import {
  createDevelopmentApi,
  getDevelopmentBySlugApi,
  updateDevelopmentApi,
  type DevelopmentApiModel,
  type DevelopmentWritePayload,
} from "@/lib/api/developments";
import { getCitiesByState, MEXICO_STATES } from "@/lib/data/mexico-locations";
import { DEFAULT_MAP_CENTER } from "@/lib/data/property-options";
import {
  DEVELOPMENT_FORM_STEPS,
  DEVELOPMENT_STATUSES,
  SUGGESTED_AMENITIES,
  SUGGESTED_UNIT_TYPES,
  formatPricePreview,
  slugifyPreview,
  type DevelopmentFormStepId,
} from "@/lib/data/development-form-ux";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";
import type { DevelopmentStatus } from "@/types/development";
import type { QueretaroZone } from "@/types/property";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Layers,
  Loader2,
  MapPinned,
  Ruler,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const DynamicLocationPicker = dynamic(
  () =>
    import("@/components/dashboard/LocationPicker").then(
      (module) => module.LocationPicker,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 animate-pulse items-center justify-center rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] font-outfit text-sm text-tl-beige/40">
        Cargando mapa…
      </div>
    ),
  },
);

export type DevelopmentFormState = {
  name: string;
  slug: string;
  tagline: string;
  developer: string;
  description: string;
  zone: string;
  city: string;
  state: string;
  address: string;
  latitude: string;
  longitude: string;
  status: DevelopmentStatus;
  price_from: string;
  currency: string;
  delivery: string;
  unit_types: string[];
  bedrooms_min: string;
  bedrooms_max: string;
  area_min: string;
  area_max: string;
  amenities: string[];
  cover_image_external_url: string;
  total_units: string;
  featured: boolean;
  is_published: boolean;
};

function emptyForm(): DevelopmentFormState {
  return {
    name: "",
    slug: "",
    tagline: "",
    developer: "",
    description: "",
    zone: "Zona Juriquilla / Jurica",
    city: "Querétaro",
    state: "Querétaro",
    address: "",
    latitude: String(DEFAULT_MAP_CENTER.latitude),
    longitude: String(DEFAULT_MAP_CENTER.longitude),
    status: "Preventa",
    price_from: "",
    currency: "MXN",
    delivery: "",
    unit_types: [],
    bedrooms_min: "1",
    bedrooms_max: "3",
    area_min: "60",
    area_max: "180",
    amenities: [],
    cover_image_external_url: "",
    total_units: "0",
    featured: false,
    is_published: true,
  };
}

function fromApi(row: DevelopmentApiModel): DevelopmentFormState {
  return {
    name: row.name,
    slug: row.slug,
    tagline: row.tagline ?? "",
    developer: row.developer ?? "",
    description: row.description ?? "",
    zone: row.zone || "Zona Juriquilla / Jurica",
    city: row.city || "Querétaro",
    state: row.state || "Querétaro",
    address: row.address ?? "",
    latitude: String(row.latitude ?? DEFAULT_MAP_CENTER.latitude),
    longitude: String(row.longitude ?? DEFAULT_MAP_CENTER.longitude),
    status: row.status,
    price_from: String(row.price_from ?? ""),
    currency: row.currency || "MXN",
    delivery: row.delivery ?? "",
    unit_types: row.unit_types ?? [],
    bedrooms_min: String(row.bedrooms_min ?? 1),
    bedrooms_max: String(row.bedrooms_max ?? 1),
    area_min: String(row.area_min ?? 0),
    area_max: String(row.area_max ?? 0),
    amenities: row.amenities ?? [],
    cover_image_external_url: row.cover_image_external_url ?? "",
    total_units: String(row.total_units ?? 0),
    featured: Boolean(row.featured),
    is_published: Boolean(row.is_published),
  };
}

function toPayload(form: DevelopmentFormState): DevelopmentWritePayload {
  return {
    name: form.name.trim(),
    slug: form.slug.trim() || undefined,
    tagline: form.tagline.trim(),
    developer: form.developer.trim(),
    description: form.description.trim(),
    zone: form.zone.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    address: form.address.trim(),
    latitude: Number(form.latitude) || null,
    longitude: Number(form.longitude) || null,
    status: form.status,
    price_from: Number(form.price_from) || 0,
    currency: form.currency.trim() || "MXN",
    delivery: form.delivery.trim(),
    unit_types: form.unit_types,
    bedrooms_min: Number(form.bedrooms_min) || 1,
    bedrooms_max: Number(form.bedrooms_max) || 1,
    area_min: Number(form.area_min) || 0,
    area_max: Number(form.area_max) || 0,
    amenities: form.amenities,
    cover_image_external_url: form.cover_image_external_url.trim(),
    total_units: Number(form.total_units) || 0,
    featured: form.featured,
    is_published: form.is_published,
  };
}

interface DevelopmentFormProps {
  mode: "create" | "edit";
  initialSlug?: string | null;
  initialRow?: DevelopmentApiModel | null;
  onCancel: () => void;
  onSaved: (row: DevelopmentApiModel) => void;
}

export function DevelopmentForm({
  mode,
  initialSlug = null,
  initialRow = null,
  onCancel,
  onSaved,
}: DevelopmentFormProps) {
  const [step, setStep] = useState<DevelopmentFormStepId>("basic");
  const [completed, setCompleted] = useState<DevelopmentFormStepId[]>([]);
  const [form, setForm] = useState<DevelopmentFormState>(() =>
    initialRow ? fromApi(initialRow) : emptyForm(),
  );
  const [savedSlug, setSavedSlug] = useState<string | null>(
    initialSlug ?? initialRow?.slug ?? null,
  );
  const [coverUrl, setCoverUrl] = useState(
    initialRow?.cover_image_url
      ? resolveMediaUrl(initialRow.cover_image_url) ?? initialRow.cover_image_url
      : "",
  );
  const [saving, setSaving] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!initialSlug || initialRow) return;
    let cancelled = false;
    setLoadingDetail(true);
    getDevelopmentBySlugApi(initialSlug)
      .then((row) => {
        if (cancelled) return;
        setForm(fromApi(row));
        setSavedSlug(row.slug);
        setCoverUrl(
          resolveMediaUrl(row.cover_image_url) ?? row.cover_image_url ?? "",
        );
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "No se pudo cargar");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialSlug, initialRow]);

  const cities = useMemo(
    () => getCitiesByState(form.state) ?? [],
    [form.state],
  );

  const stepIndex = DEVELOPMENT_FORM_STEPS.findIndex((item) => item.id === step);

  function setField<K extends keyof DevelopmentFormState>(
    key: K,
    value: DevelopmentFormState[K],
  ) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && mode === "create" && !savedSlug) {
        if (!current.slug || current.slug === slugifyPreview(current.name)) {
          next.slug = slugifyPreview(String(value));
        }
      }
      return next;
    });
  }

  function markCompleted(id: DevelopmentFormStepId) {
    setCompleted((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }

  function validateStep(id: DevelopmentFormStepId): string | null {
    if (id === "basic") {
      if (!form.name.trim()) return "El nombre del desarrollo es obligatorio.";
      if (!form.price_from.trim()) return "Indica el precio desde.";
    }
    if (id === "location") {
      if (!form.address.trim()) return "La dirección ayuda a ubicar el proyecto.";
      if (!form.latitude || !form.longitude) {
        return "Coloca el pin en el mapa.";
      }
    }
    return null;
  }

  async function persistParent(): Promise<DevelopmentApiModel> {
    const payload = toPayload(form);
    if (savedSlug) {
      return updateDevelopmentApi(savedSlug, payload);
    }
    return createDevelopmentApi(payload);
  }

  async function handleSaveParent(options?: { advance?: boolean }) {
    if (!form.name.trim()) {
      setError("El nombre del desarrollo es obligatorio.");
      setStep("basic");
      return null;
    }

    setSaving(true);
    setError(null);
    try {
      const row = await persistParent();
      setSavedSlug(row.slug);
      setForm(fromApi(row));
      setCoverUrl(
        resolveMediaUrl(row.cover_image_url) ?? row.cover_image_url ?? "",
      );
      markCompleted(step);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 1800);
      onSaved(row);
      if (options?.advance) {
        const next = DEVELOPMENT_FORM_STEPS[stepIndex + 1];
        if (next) setStep(next.id);
      }
      return row;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function goNext() {
    const validation = validateStep(step);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);

    // Auto-guardar al salir de pasos de datos o al entrar a media/modelos
    if (step === "basic" || step === "specs" || step === "location") {
      const row = await handleSaveParent();
      if (!row) return;
    } else if ((step === "media" || step === "models") && !savedSlug) {
      const row = await handleSaveParent();
      if (!row) return;
    } else {
      markCompleted(step);
    }

    const next = DEVELOPMENT_FORM_STEPS[stepIndex + 1];
    if (next) setStep(next.id);
  }

  function goBack() {
    const prev = DEVELOPMENT_FORM_STEPS[stepIndex - 1];
    if (prev) setStep(prev.id);
  }

  if (loadingDetail) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-tl-gold" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col">
      <header className="sticky top-0 z-20 -mx-1 mb-6 space-y-4 border-b border-tl-gold/10 bg-[#0c0c0b]/95 px-1 pb-4 backdrop-blur-md">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-outfit text-[10px] uppercase tracking-[0.2em] text-tl-gold/80">
              {mode === "create" ? "Nuevo desarrollo" : "Editar desarrollo"}
            </p>
            <h2 className="mt-1 font-cormorant text-3xl font-light text-tl-beige sm:text-4xl">
              {form.name.trim() || "Sin título"}
            </h2>
            <p className="mt-1 font-outfit text-xs text-tl-beige/50">
              {formatPricePreview(form.price_from, form.currency)} ·{" "}
              {form.status}
              {savedSlug ? ` · /${savedSlug}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {savedFlash ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-tl-olive/40 bg-tl-olive/15 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-beige">
                <CheckCircle2 className="h-3.5 w-3.5 text-tl-gold" />
                Guardado
              </span>
            ) : null}
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-tl-gold/25 px-4 py-2 font-outfit text-xs uppercase tracking-[0.14em] text-tl-beige/75"
            >
              Volver al listado
            </button>
          </div>
        </div>

        <FormStepIndicator
          steps={DEVELOPMENT_FORM_STEPS}
          currentStep={step}
          completedSteps={completed}
          onStepClick={(id) => {
            setError(null);
            setStep(id);
          }}
        />
      </header>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-outfit text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {step === "basic" ? (
              <FormSection
                title="Identidad del proyecto"
                description="Lo esencial que verá el visitante en el listado y la ficha."
                icon={<Building2 className="h-5 w-5" />}
              >
                <FormField label="Nombre *" className="sm:col-span-2">
                  <input
                    className={formInputClass}
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Torre Altea"
                  />
                </FormField>
                <FormField label="Slug" hint="URL pública">
                  <input
                    className={formInputClass}
                    value={form.slug}
                    onChange={(e) => setField("slug", e.target.value)}
                    placeholder="torre-altea"
                  />
                </FormField>
                <FormField label="Tagline" className="sm:col-span-2">
                  <input
                    className={formInputClass}
                    value={form.tagline}
                    onChange={(e) => setField("tagline", e.target.value)}
                    placeholder="Vivir con altura"
                  />
                </FormField>
                <FormField label="Desarrolladora">
                  <input
                    className={formInputClass}
                    value={form.developer}
                    onChange={(e) => setField("developer", e.target.value)}
                  />
                </FormField>
                <FormField label="Estatus">
                  <select
                    className={formInputClass}
                    value={form.status}
                    onChange={(e) =>
                      setField("status", e.target.value as DevelopmentStatus)
                    }
                  >
                    {DEVELOPMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Precio desde *">
                  <input
                    className={formInputClass}
                    type="number"
                    value={form.price_from}
                    onChange={(e) => setField("price_from", e.target.value)}
                    placeholder="4500000"
                  />
                </FormField>
                <FormField label="Moneda">
                  <select
                    className={formInputClass}
                    value={form.currency}
                    onChange={(e) => setField("currency", e.target.value)}
                  >
                    <option value="MXN">MXN</option>
                    <option value="USD">USD</option>
                  </select>
                </FormField>
                <FormField label="Entrega" hint="Ej. Q4 2027 o Inmediata">
                  <input
                    className={formInputClass}
                    value={form.delivery}
                    onChange={(e) => setField("delivery", e.target.value)}
                  />
                </FormField>
                <div className="sm:col-span-2 xl:col-span-3">
                  <FormField label="Descripción">
                    <textarea
                      className={cn(formInputClass, "min-h-32")}
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                      placeholder="Historia del proyecto, propuesta de valor…"
                    />
                  </FormField>
                </div>
                <FeaturedToggle
                  checked={form.featured}
                  onChange={(checked) => setField("featured", checked)}
                  title="Desarrollo destacado"
                  description="Aparece primero en el listado público."
                />
                <FeaturedToggle
                  checked={form.is_published}
                  onChange={(checked) => setField("is_published", checked)}
                  title="Publicado en el sitio"
                  description="Si está apagado, solo se ve en el dashboard."
                  icon={Eye}
                />
              </FormSection>
            ) : null}

            {step === "specs" ? (
              <FormSection
                title="Características del desarrollo"
                description="Rangos generales; el detalle fino vive en cada modelo."
                icon={<Ruler className="h-5 w-5" />}
              >
                <NumberStepper
                  label="Unidades totales"
                  value={form.total_units}
                  onChange={(v) => setField("total_units", v)}
                  min={0}
                  max={9999}
                  step={1}
                />
                <NumberStepper
                  label="Recámaras mín."
                  value={form.bedrooms_min}
                  onChange={(v) => setField("bedrooms_min", v)}
                  min={0}
                  max={12}
                />
                <NumberStepper
                  label="Recámaras máx."
                  value={form.bedrooms_max}
                  onChange={(v) => setField("bedrooms_max", v)}
                  min={0}
                  max={12}
                />
                <FormField label="m² desde">
                  <input
                    className={formInputClass}
                    type="number"
                    value={form.area_min}
                    onChange={(e) => setField("area_min", e.target.value)}
                  />
                </FormField>
                <FormField label="m² hasta">
                  <input
                    className={formInputClass}
                    type="number"
                    value={form.area_max}
                    onChange={(e) => setField("area_max", e.target.value)}
                  />
                </FormField>
                <TagChipsInput
                  label="Tipos de unidad"
                  values={form.unit_types}
                  onChange={(values) => setField("unit_types", values)}
                  suggestions={SUGGESTED_UNIT_TYPES}
                  placeholder="Departamentos, Penthouses…"
                />
                <TagChipsInput
                  label="Amenidades"
                  hint="Se muestran en la ficha pública del desarrollo"
                  values={form.amenities}
                  onChange={(values) => setField("amenities", values)}
                  suggestions={SUGGESTED_AMENITIES}
                />
              </FormSection>
            ) : null}

            {step === "location" ? (
              <FormSection
                title="Ubicación"
                description="Dirección visible y pin exacto en Google Maps."
                icon={<MapPinned className="h-5 w-5" />}
              >
                <FormField label="Dirección *" className="sm:col-span-2 xl:col-span-3">
                  <input
                    className={formInputClass}
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                  />
                </FormField>
                <FormField label="Estado">
                  <select
                    className={formInputClass}
                    value={form.state}
                    onChange={(e) => {
                      const state = e.target.value;
                      const nextCities = getCitiesByState(state) ?? [];
                      setForm((current) => ({
                        ...current,
                        state,
                        city: nextCities[0] ?? current.city,
                      }));
                    }}
                  >
                    {MEXICO_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Ciudad">
                  <select
                    className={formInputClass}
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                  >
                    {(cities.length ? cities : [form.city]).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </FormField>
                <div className="sm:col-span-2 xl:col-span-3">
                  <ZoneSelector
                    value={form.zone as QueretaroZone}
                    onChange={(zone) => setField("zone", zone)}
                  />
                </div>
                <div className="sm:col-span-2 xl:col-span-3">
                  <DynamicLocationPicker
                    latitude={Number(form.latitude) || DEFAULT_MAP_CENTER.latitude}
                    longitude={
                      Number(form.longitude) || DEFAULT_MAP_CENTER.longitude
                    }
                    onLocationChange={({ latitude, longitude }) => {
                      setForm((current) => ({
                        ...current,
                        latitude: String(latitude),
                        longitude: String(longitude),
                      }));
                    }}
                  />
                </div>
              </FormSection>
            ) : null}

            {step === "media" ? (
              <FormSection
                title="Fotografías del desarrollo"
                description="Portada del listado y galería de la ficha pública."
                icon={<ImageIcon className="h-5 w-5" />}
              >
                <DevelopmentMediaEditor
                  slug={savedSlug}
                  coverUrl={coverUrl}
                  coverExternalUrl={form.cover_image_external_url}
                  onCoverExternalUrlChange={(url) =>
                    setField("cover_image_external_url", url)
                  }
                  onCoverUpdated={(row) => {
                    setCoverUrl(
                      resolveMediaUrl(row.cover_image_url) ??
                        row.cover_image_url ??
                        "",
                    );
                    setForm(fromApi(row));
                    onSaved(row);
                  }}
                />
              </FormSection>
            ) : null}

            {step === "models" ? (
              <FormSection
                title="Modelos de unidad"
                description="Tipologías con precio, specs, galería y plantas propias."
                icon={<Layers className="h-5 w-5" />}
              >
                <DevelopmentModelsEditor developmentSlug={savedSlug} />
              </FormSection>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="sticky bottom-0 z-20 mt-8 -mx-1 flex flex-wrap items-center justify-between gap-3 border-t border-tl-gold/10 bg-[#0c0c0b]/95 px-1 py-4 backdrop-blur-md">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0 || saving}
          className="inline-flex items-center gap-2 rounded-full border border-tl-gold/25 px-4 py-2.5 font-outfit text-xs uppercase tracking-[0.14em] text-tl-beige/70 disabled:opacity-30"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Atrás
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSaveParent()}
            className="inline-flex items-center gap-2 rounded-full border border-tl-gold/40 px-4 py-2.5 font-outfit text-xs uppercase tracking-[0.14em] text-tl-gold disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Guardar
          </button>

          {stepIndex < DEVELOPMENT_FORM_STEPS.length - 1 ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => void goNext()}
              className="inline-flex items-center gap-2 rounded-full bg-tl-gold px-5 py-2.5 font-outfit text-xs uppercase tracking-[0.14em] text-tl-black disabled:opacity-60"
            >
              Siguiente
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                void handleSaveParent().then((row) => {
                  if (row) onCancel();
                });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-tl-gold px-5 py-2.5 font-outfit text-xs uppercase tracking-[0.14em] text-tl-black disabled:opacity-60"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Listo
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
