"use client";

import {
  FormField,
  formInputClass,
} from "@/components/dashboard/form/FormField";
import { NumberStepper } from "@/components/dashboard/form/NumberStepper";
import { TagChipsInput } from "@/components/dashboard/form/TagChipsInput";
import {
  addDevelopmentModelFloorPlan,
  addDevelopmentModelGalleryImage,
  createDevelopmentModel,
  deleteDevelopmentModel,
  deleteDevelopmentModelFloorPlan,
  deleteDevelopmentModelGalleryImage,
  listDevelopmentModelFloorPlans,
  listDevelopmentModelGallery,
  listDevelopmentModels,
  updateDevelopmentModel,
  updateDevelopmentModelFloorPlan,
  uploadDevelopmentModelCover,
  type DevelopmentApiUnitModel,
  type DevelopmentMediaItem,
  type DevelopmentUnitModelWritePayload,
} from "@/lib/api/developments";
import { resolveMediaUrl } from "@/lib/media-url";
import {
  buildMatterportShareUrl,
  MATTERPORT_DEMO_MODEL_ID,
  parseMatterportId,
} from "@/lib/maps/matterport";
import { cn } from "@/lib/utils";
import { ACCEPTED_IMAGE_ACCEPT_ATTR } from "@/types/property-photo";
import {
  Box,
  ChevronDown,
  ImagePlus,
  Layers,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const FLOOR_PLAN_PRESETS = [
  "Planta baja",
  "Primer piso",
  "Segundo piso",
  "Tercer piso",
  "Terraza",
  "Azotea",
  "Roof garden",
  "Planta única",
] as const;

type ModelFormState = {
  name: string;
  slug: string;
  bedrooms: string;
  bathrooms: string;
  half_bathrooms: string;
  area_m2: string;
  lot_m2: string;
  parking: string;
  price_from: string;
  list_price: string;
  description: string;
  features: string[];
  available: string;
  cover_image_external_url: string;
  tour_url: string;
  tour_title: string;
  tour_enabled: boolean;
};

function emptyModelForm(): ModelFormState {
  return {
    name: "",
    slug: "",
    bedrooms: "2",
    bathrooms: "2",
    half_bathrooms: "0",
    area_m2: "90",
    lot_m2: "",
    parking: "1",
    price_from: "",
    list_price: "",
    description: "",
    features: [],
    available: "",
    cover_image_external_url: "",
    tour_url: "",
    tour_title: "",
    tour_enabled: false,
  };
}

function fromApi(model: DevelopmentApiUnitModel): ModelFormState {
  return {
    name: model.name,
    slug: model.slug,
    bedrooms: String(model.bedrooms ?? 1),
    bathrooms: String(model.bathrooms ?? 1),
    half_bathrooms: String(model.half_bathrooms ?? 0),
    area_m2: String(model.area_m2 ?? 0),
    lot_m2: model.lot_m2 != null ? String(model.lot_m2) : "",
    parking: String(model.parking ?? 0),
    price_from: String(model.price_from ?? ""),
    list_price: model.list_price != null ? String(model.list_price) : "",
    description: model.description ?? "",
    features: model.features ?? [],
    available: model.available != null ? String(model.available) : "",
    cover_image_external_url: model.cover_image_external_url ?? "",
    tour_url:
      model.tour_url ||
      (model.tour_id ? buildMatterportShareUrl(model.tour_id) : ""),
    tour_title: model.tour_title ?? "",
    tour_enabled: Boolean(model.tour_enabled),
  };
}

function toPayload(form: ModelFormState): DevelopmentUnitModelWritePayload {
  const parsedId = parseMatterportId(form.tour_url);
  return {
    name: form.name.trim(),
    slug: form.slug.trim() || undefined,
    bedrooms: Number(form.bedrooms) || 1,
    bathrooms: Number(form.bathrooms) || 1,
    half_bathrooms: Number(form.half_bathrooms) || 0,
    area_m2: Number(form.area_m2) || 0,
    lot_m2: form.lot_m2 ? Number(form.lot_m2) : null,
    parking: Number(form.parking) || 0,
    price_from: Number(form.price_from) || 0,
    list_price: form.list_price ? Number(form.list_price) : null,
    description: form.description.trim(),
    features: form.features,
    available: form.available ? Number(form.available) : null,
    cover_image_external_url: form.cover_image_external_url.trim(),
    tour_provider: "matterport",
    tour_url: form.tour_url.trim(),
    tour_id: parsedId ?? "",
    tour_title: form.tour_title.trim(),
    tour_enabled: form.tour_enabled && Boolean(parsedId),
  };
}

interface DevelopmentModelsEditorProps {
  developmentSlug: string | null;
  onModelsCountChange?: (count: number) => void;
}

export function DevelopmentModelsEditor({
  developmentSlug,
  onModelsCountChange,
}: DevelopmentModelsEditorProps) {
  const [models, setModels] = useState<DevelopmentApiUnitModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<ModelFormState>(emptyModelForm);
  const [saving, setSaving] = useState(false);
  const [gallery, setGallery] = useState<DevelopmentMediaItem[]>([]);
  const [floorPlans, setFloorPlans] = useState<DevelopmentMediaItem[]>([]);
  const [mediaBusy, setMediaBusy] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const planRef = useRef<HTMLInputElement>(null);
  const [planLabel, setPlanLabel] = useState("Planta baja");

  const refresh = useCallback(async () => {
    if (!developmentSlug) {
      setModels([]);
      onModelsCountChange?.(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await listDevelopmentModels(developmentSlug);
      setModels(rows);
      onModelsCountChange?.(rows.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar modelos");
    } finally {
      setLoading(false);
    }
  }, [developmentSlug, onModelsCountChange]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function syncFloorPlansInModels(
    modelId: number,
    plans: DevelopmentMediaItem[],
  ) {
    setModels((current) =>
      current.map((item) =>
        item.id === modelId
          ? {
              ...item,
              floor_plans: plans.map((plan) => ({
                id: plan.id,
                label: plan.label ?? "Planta",
                image_url: plan.image_url,
                order: plan.order ?? 0,
              })),
            }
          : item,
      ),
    );
  }

  async function loadModelMedia(modelId: number) {
    setMediaBusy(true);
    try {
      const [galleryRows, planRows] = await Promise.all([
        listDevelopmentModelGallery(modelId),
        listDevelopmentModelFloorPlans(modelId),
      ]);
      setGallery(galleryRows);
      setFloorPlans(planRows);
      syncFloorPlansInModels(modelId, planRows);
    } catch {
      setGallery([]);
      setFloorPlans([]);
    } finally {
      setMediaBusy(false);
    }
  }

  function openNew() {
    setDraft(emptyModelForm());
    setGallery([]);
    setFloorPlans([]);
    setExpandedId("new");
    setPlanLabel("Planta baja");
    setError(null);
  }

  async function openEdit(model: DevelopmentApiUnitModel) {
    setDraft(fromApi(model));
    setExpandedId(model.id);
    setError(null);
    await loadModelMedia(model.id);
  }

  function setField<K extends keyof ModelFormState>(
    key: K,
    value: ModelFormState[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleSaveModel() {
    if (!developmentSlug) return;
    if (!draft.name.trim()) {
      setError("El nombre del modelo es obligatorio.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(draft);
      if (expandedId === "new") {
        const created = await createDevelopmentModel(developmentSlug, payload);
        await refresh();
        setExpandedId(created.id);
        setDraft(fromApi(created));
        await loadModelMedia(created.id);
      } else if (typeof expandedId === "number") {
        const updated = await updateDevelopmentModel(expandedId, payload);
        await refresh();
        setDraft(fromApi(updated));
        await loadModelMedia(updated.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el modelo");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteModel(modelId: number) {
    if (!window.confirm("¿Eliminar este modelo y todas sus fotos?")) return;
    setError(null);
    try {
      await deleteDevelopmentModel(modelId);
      if (expandedId === modelId) setExpandedId(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar");
    }
  }

  async function handleCoverUpload(file: File | null) {
    if (!file || typeof expandedId !== "number") return;
    setMediaBusy(true);
    setError(null);
    try {
      const updated = await uploadDevelopmentModelCover(expandedId, file);
      setModels((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setDraft(fromApi(updated));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir portada");
    } finally {
      setMediaBusy(false);
    }
  }

  async function handleGalleryUpload(files: FileList | null) {
    if (!files?.length || typeof expandedId !== "number") return;
    setMediaBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        await addDevelopmentModelGalleryImage(expandedId, file);
      }
      const rows = await listDevelopmentModelGallery(expandedId);
      setGallery(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en galería");
    } finally {
      setMediaBusy(false);
    }
  }

  async function handleDeleteGallery(imageId: number) {
    if (typeof expandedId !== "number") return;
    if (!window.confirm("¿Eliminar esta foto de la galería?")) return;
    setMediaBusy(true);
    setError(null);
    try {
      await deleteDevelopmentModelGalleryImage(expandedId, imageId);
      const rows = await listDevelopmentModelGallery(expandedId);
      setGallery(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar");
    } finally {
      setMediaBusy(false);
    }
  }

  async function reloadFloorPlans(modelId: number) {
    const rows = await listDevelopmentModelFloorPlans(modelId);
    setFloorPlans(rows);
    syncFloorPlansInModels(modelId, rows);
  }

  async function handleFloorPlanUpload(file: File | null) {
    if (!file || typeof expandedId !== "number") return;
    setMediaBusy(true);
    setError(null);
    try {
      await addDevelopmentModelFloorPlan(
        expandedId,
        file,
        planLabel.trim() || "Planta",
      );
      await reloadFloorPlans(expandedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir planta");
    } finally {
      setMediaBusy(false);
    }
  }

  async function handleReplacePlanImage(planId: number, file: File | null) {
    if (!file || typeof expandedId !== "number") return;
    setMediaBusy(true);
    setError(null);
    try {
      await updateDevelopmentModelFloorPlan(expandedId, planId, { file });
      await reloadFloorPlans(expandedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reemplazar planta");
    } finally {
      setMediaBusy(false);
    }
  }

  async function handleUpdatePlanLabel(planId: number, label: string) {
    if (typeof expandedId !== "number") return;
    const next = label.trim();
    if (!next) return;
    setMediaBusy(true);
    setError(null);
    try {
      await updateDevelopmentModelFloorPlan(expandedId, planId, {
        label: next,
      });
      await reloadFloorPlans(expandedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo renombrar");
    } finally {
      setMediaBusy(false);
    }
  }

  async function handleDeletePlan(planId: number) {
    if (typeof expandedId !== "number") return;
    if (!window.confirm("¿Eliminar esta planta?")) return;
    setMediaBusy(true);
    setError(null);
    try {
      await deleteDevelopmentModelFloorPlan(expandedId, planId);
      await reloadFloorPlans(expandedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar");
    } finally {
      setMediaBusy(false);
    }
  }

  if (!developmentSlug) {
    return (
      <div className="rounded-2xl border border-dashed border-tl-gold/25 bg-[#0a0a0a]/60 px-5 py-12 text-center sm:col-span-2 xl:col-span-3">
        <Layers className="mx-auto h-8 w-8 text-tl-gold/50" />
        <p className="mt-3 font-outfit text-sm font-light text-tl-beige/60">
          Guarda el desarrollo para comenzar a agregar modelos de unidad.
        </p>
      </div>
    );
  }

  const coverPreview =
    resolveMediaUrl(
      models.find((m) => m.id === expandedId)?.image_url ?? "",
    ) ||
    draft.cover_image_external_url ||
    "";

  return (
    <div className="space-y-5 sm:col-span-2 xl:col-span-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-outfit text-[11px] uppercase tracking-[0.14em] text-tl-beige/55">
            {models.length} modelo{models.length === 1 ? "" : "s"}
          </p>
          <p className="mt-1 font-outfit text-xs font-light text-tl-beige/45">
            Cada tipología tiene sus propios datos, portada, galería y plantas.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-tl-gold px-4 py-2 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-black"
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo modelo
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-outfit text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex h-28 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-tl-gold" />
        </div>
      ) : (
        <div className="space-y-3">
          {models.map((model) => {
            const isOpen = expandedId === model.id;
            return (
              <div
                key={model.id}
                className="overflow-hidden rounded-2xl border border-tl-gold/15 bg-[#0a0a0a]/70"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isOpen) setExpandedId(null);
                    else void openEdit(model);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-tl-gold/15 bg-tl-black">
                    {model.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveMediaUrl(model.image_url) ?? model.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-tl-beige/30">
                        <Layers className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-outfit text-xl font-extralight text-tl-beige">
                      {model.name}
                    </p>
                    <p className="mt-0.5 font-outfit text-xs text-tl-beige/50">
                      {model.bedrooms} rec · {model.bathrooms} baños ·{" "}
                      {model.area_m2} m² · desde{" "}
                      {Number(model.price_from).toLocaleString("es-MX")}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-tl-beige/40 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
              </div>
            );
          })}

          {expandedId === "new" || typeof expandedId === "number" ? (
            <div className="rounded-2xl border border-tl-gold/30 bg-gradient-to-b from-tl-gold/5 to-transparent p-4 sm:p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-outfit text-2xl font-extralight text-tl-beige">
                  {expandedId === "new" ? "Nuevo modelo" : draft.name || "Editar modelo"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {typeof expandedId === "number" ? (
                    <button
                      type="button"
                      onClick={() => void handleDeleteModel(expandedId)}
                      className="rounded-full border border-red-400/30 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.12em] text-red-300/80"
                    >
                      Eliminar
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setExpandedId(null)}
                    className="rounded-full border border-tl-gold/25 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-beige/70"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <FormField label="Nombre del modelo *">
                  <input
                    className={formInputClass}
                    value={draft.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="DOMI PB"
                  />
                </FormField>
                <FormField label="Slug" hint="Opcional, se genera del nombre">
                  <input
                    className={formInputClass}
                    value={draft.slug}
                    onChange={(e) => setField("slug", e.target.value)}
                  />
                </FormField>
                <FormField label="Precio desde">
                  <input
                    className={formInputClass}
                    type="number"
                    value={draft.price_from}
                    onChange={(e) => setField("price_from", e.target.value)}
                  />
                </FormField>
                <FormField label="Precio de lista" hint="Opcional, para mostrar descuento">
                  <input
                    className={formInputClass}
                    type="number"
                    value={draft.list_price}
                    onChange={(e) => setField("list_price", e.target.value)}
                  />
                </FormField>
                <NumberStepper
                  label="Recámaras"
                  value={draft.bedrooms}
                  onChange={(v) => setField("bedrooms", v)}
                  min={0}
                  max={12}
                />
                <NumberStepper
                  label="Baños"
                  value={draft.bathrooms}
                  onChange={(v) => setField("bathrooms", v)}
                  min={0}
                  max={12}
                />
                <NumberStepper
                  label="Medios baños"
                  value={draft.half_bathrooms}
                  onChange={(v) => setField("half_bathrooms", v)}
                  min={0}
                  max={4}
                />
                <NumberStepper
                  label="Estacionamientos"
                  value={draft.parking}
                  onChange={(v) => setField("parking", v)}
                  min={0}
                  max={10}
                />
                <FormField label="m² construidos">
                  <input
                    className={formInputClass}
                    type="number"
                    value={draft.area_m2}
                    onChange={(e) => setField("area_m2", e.target.value)}
                  />
                </FormField>
                <FormField label="m² terreno" hint="Opcional">
                  <input
                    className={formInputClass}
                    type="number"
                    value={draft.lot_m2}
                    onChange={(e) => setField("lot_m2", e.target.value)}
                  />
                </FormField>
                <FormField label="Disponibles" hint="Unidades restantes">
                  <input
                    className={formInputClass}
                    type="number"
                    value={draft.available}
                    onChange={(e) => setField("available", e.target.value)}
                  />
                </FormField>
                <div className="sm:col-span-2 xl:col-span-3">
                  <FormField label="Descripción">
                    <textarea
                      className={`${formInputClass} min-h-24`}
                      value={draft.description}
                      onChange={(e) => setField("description", e.target.value)}
                    />
                  </FormField>
                </div>
                <TagChipsInput
                  label="Características del modelo"
                  values={draft.features}
                  onChange={(values) => setField("features", values)}
                  placeholder="Cocina integral, Walk-in closet…"
                  suggestions={[
                    "Cocina integral",
                    "Walk-in closet",
                    "Balcón",
                    "Terraza",
                    "Doble altura",
                    "Cuarto de servicio",
                  ]}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSaveModel()}
                  className="rounded-full bg-tl-gold px-5 py-2.5 font-outfit text-xs uppercase tracking-[0.14em] text-tl-black disabled:opacity-60"
                >
                  {saving
                    ? "Guardando…"
                    : expandedId === "new"
                      ? "Crear modelo"
                      : "Guardar cambios"}
                </button>
                {expandedId === "new" ? (
                  <p className="self-center font-outfit text-xs text-tl-beige/45">
                    Después de crear podrás subir fotos y plantas.
                  </p>
                ) : null}
              </div>

              {typeof expandedId === "number" ? (
                <div className="mt-8 space-y-6 border-t border-tl-gold/15 pt-6">
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-3">
                      <p className="font-outfit text-[11px] uppercase tracking-[0.14em] text-tl-beige/60">
                        Portada del modelo
                      </p>
                      <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-tl-gold/15 bg-tl-black">
                        {coverPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={coverPreview}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-tl-beige/35">
                            <ImagePlus className="h-7 w-7" />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={mediaBusy}
                        onClick={() => coverRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-full border border-tl-gold/35 px-4 py-2 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-gold"
                      >
                        {mediaBusy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        Subir portada
                      </button>
                      <input
                        ref={coverRef}
                        type="file"
                        accept={ACCEPTED_IMAGE_ACCEPT_ATTR}
                        className="hidden"
                        onChange={(e) => {
                          void handleCoverUpload(e.target.files?.[0] ?? null);
                          e.target.value = "";
                        }}
                      />
                      <FormField label="URL externa (opcional)">
                        <input
                          className={formInputClass}
                          value={draft.cover_image_external_url}
                          onChange={(e) =>
                            setField("cover_image_external_url", e.target.value)
                          }
                        />
                      </FormField>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-outfit text-[11px] uppercase tracking-[0.14em] text-tl-beige/60">
                          Galería ({gallery.length})
                        </p>
                        <button
                          type="button"
                          disabled={mediaBusy}
                          onClick={() => galleryRef.current?.click()}
                          className="rounded-full bg-tl-gold/15 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-gold"
                        >
                          + Fotos
                        </button>
                        <input
                          ref={galleryRef}
                          type="file"
                          accept={ACCEPTED_IMAGE_ACCEPT_ATTR}
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            void handleGalleryUpload(e.target.files);
                            e.target.value = "";
                          }}
                        />
                      </div>
                      {gallery.length === 0 ? (
                        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-tl-gold/20 text-tl-beige/40">
                          <span className="font-outfit text-xs">Sin fotos aún</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {gallery.map((item) => (
                            <div
                              key={item.id}
                              className="group relative aspect-square overflow-hidden rounded-xl border border-tl-gold/15"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                disabled={mediaBusy}
                                onClick={() => void handleDeleteGallery(item.id)}
                                className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-tl-black/80 text-red-300"
                                aria-label="Eliminar foto"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="font-outfit text-[11px] uppercase tracking-[0.14em] text-tl-beige/60">
                        Plantas arquitectónicas
                      </p>
                      <p className="mt-1 font-outfit text-xs font-light text-tl-beige/45">
                        Agrega tantas como necesites (planta baja, pisos,
                        terraza, azotea…). Cada una con su etiqueta e imagen.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {FLOOR_PLAN_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setPlanLabel(preset)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.12em] transition-colors",
                            planLabel === preset
                              ? "border-tl-gold bg-tl-gold/15 text-tl-gold"
                              : "border-tl-gold/20 text-tl-beige/55 hover:border-tl-gold/40 hover:text-tl-beige/80",
                          )}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-end gap-3">
                      <FormField
                        label="Etiqueta de la nueva planta"
                        className="min-w-[12rem] flex-1"
                        hint="Puedes escribir cualquier nombre"
                      >
                        <input
                          className={formInputClass}
                          value={planLabel}
                          onChange={(e) => setPlanLabel(e.target.value)}
                          placeholder="Ej. Planta baja, Terraza…"
                        />
                      </FormField>
                      <button
                        type="button"
                        disabled={mediaBusy || typeof expandedId !== "number"}
                        onClick={() => planRef.current?.click()}
                        className="mb-0.5 inline-flex items-center gap-2 rounded-full border border-tl-gold/35 px-4 py-3 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-gold disabled:opacity-40"
                      >
                        {mediaBusy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        Subir planta
                      </button>
                      <input
                        ref={planRef}
                        type="file"
                        accept={ACCEPTED_IMAGE_ACCEPT_ATTR}
                        className="hidden"
                        onChange={(e) => {
                          void handleFloorPlanUpload(e.target.files?.[0] ?? null);
                          e.target.value = "";
                        }}
                      />
                    </div>

                    {floorPlans.length === 0 ? (
                      <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-tl-gold/20 text-tl-beige/40">
                        <span className="font-outfit text-xs">
                          Sin plantas aún — elige etiqueta y sube la imagen
                        </span>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {floorPlans.map((plan) => (
                          <div
                            key={plan.id}
                            className="overflow-hidden rounded-xl border border-tl-gold/15 bg-tl-black/40"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={plan.image_url}
                              alt={plan.label || "Planta"}
                              className="aspect-[4/3] w-full bg-white object-contain"
                            />
                            <div className="space-y-2 px-3 py-2.5">
                              <input
                                className={cn(formInputClass, "py-2 text-xs")}
                                defaultValue={plan.label || "Planta"}
                                disabled={mediaBusy}
                                onBlur={(e) => {
                                  const next = e.target.value.trim();
                                  if (next && next !== (plan.label || "")) {
                                    void handleUpdatePlanLabel(plan.id, next);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.currentTarget.blur();
                                  }
                                }}
                                aria-label="Etiqueta de la planta"
                              />
                              <div className="flex items-center gap-2">
                                <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-tl-gold/30 px-3 py-2 font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-gold">
                                  <Upload className="h-3 w-3" />
                                  Cambiar imagen
                                  <input
                                    type="file"
                                    accept={ACCEPTED_IMAGE_ACCEPT_ATTR}
                                    className="hidden"
                                    disabled={mediaBusy}
                                    onChange={(e) => {
                                      void handleReplacePlanImage(
                                        plan.id,
                                        e.target.files?.[0] ?? null,
                                      );
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  disabled={mediaBusy}
                                  onClick={() => void handleDeletePlan(plan.id)}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-400/30 text-red-300"
                                  aria-label="Eliminar planta"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 rounded-2xl border border-tl-gold/20 bg-tl-gold/[0.03] p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-tl-gold/25 bg-tl-gold/10 text-tl-gold">
                        <Box className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-outfit text-[11px] uppercase tracking-[0.14em] text-tl-gold/80">
                          Recorrido 3D · Matterport
                        </p>
                        <p className="mt-1 font-outfit text-xs font-light text-tl-beige/50">
                          Pega el link de compartir de Matterport. Para probar
                          sin cuenta, usa el demo oficial.
                        </p>
                      </div>
                    </div>

                    <FormField
                      label="URL o ID de Matterport"
                      hint="Ej. https://my.matterport.com/show/?m=Zh14WDtkjdC"
                    >
                      <input
                        className={formInputClass}
                        value={draft.tour_url}
                        onChange={(e) => setField("tour_url", e.target.value)}
                        placeholder="https://my.matterport.com/show/?m=…"
                      />
                    </FormField>

                    <FormField label="Título del tour (opcional)">
                      <input
                        className={formInputClass}
                        value={draft.tour_title}
                        onChange={(e) => setField("tour_title", e.target.value)}
                        placeholder={`Recorrido 3D — ${draft.name || "modelo"}`}
                      />
                    </FormField>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 font-outfit text-sm text-tl-beige/80">
                        <input
                          type="checkbox"
                          checked={draft.tour_enabled}
                          onChange={(e) =>
                            setField("tour_enabled", e.target.checked)
                          }
                          className="h-4 w-4 accent-tl-gold"
                        />
                        Mostrar en el sitio público
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setField(
                            "tour_url",
                            buildMatterportShareUrl(MATTERPORT_DEMO_MODEL_ID),
                          );
                          setField("tour_enabled", true);
                          if (!draft.tour_title.trim()) {
                            setField(
                              "tour_title",
                              `Recorrido 3D — ${draft.name || "demo"}`,
                            );
                          }
                        }}
                        className="rounded-full border border-tl-gold/30 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-gold"
                      >
                        Usar demo Matterport
                      </button>
                      {parseMatterportId(draft.tour_url) ? (
                        <a
                          href={buildMatterportShareUrl(
                            parseMatterportId(draft.tour_url)!,
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-beige/45 hover:text-tl-gold"
                        >
                          Probar link →
                        </a>
                      ) : draft.tour_url.trim() ? (
                        <span className="font-outfit text-[10px] text-red-300/80">
                          URL no reconocida
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {models.length === 0 && expandedId === null ? (
            <div className="rounded-2xl border border-dashed border-tl-gold/20 px-5 py-10 text-center">
              <p className="font-outfit text-sm text-tl-beige/55">
                Aún no hay modelos. Agrega la primera tipología del desarrollo.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
