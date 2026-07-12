"use client";

import { ZoneImageDropzone } from "@/components/dashboard/zonas/ZoneImageDropzone";
import {
  createZoneApi,
  updateZoneApi,
  uploadZoneImageApi,
  type ZoneApiModel,
  type ZoneWritePayload,
} from "@/lib/api/zones";
import { QUERETARO_ZONES } from "@/lib/data/property-options";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";
import type { ZoneGrowthLabel } from "@/types/zone";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

const GROWTH_LABELS: ZoneGrowthLabel[] = [
  "Plusvalía premium",
  "Crecimiento alto",
  "Crecimiento medio",
  "Emergente",
];

const SUGGESTED_ZONE_NAMES = QUERETARO_ZONES.filter(
  (zone) => zone !== "Otra / Sin clasificar",
);

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 font-outfit text-sm font-light text-tl-beige outline-none transition-colors placeholder:text-tl-beige/25 focus:border-tl-gold/40";

const labelClass =
  "mb-1.5 block font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45";

interface ZoneFormProps {
  initial?: ZoneApiModel | null;
  onSaved: (row: ZoneApiModel) => void;
  onCancel: () => void;
}

export function ZoneForm({ initial, onSaved, onCancel }: ZoneFormProps) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [growthLabel, setGrowthLabel] = useState<ZoneGrowthLabel>(
    initial?.growth_label ?? "Crecimiento medio",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [subZonesText, setSubZonesText] = useState(
    (initial?.sub_zones ?? []).join("\n"),
  );
  const [order, setOrder] = useState(String(initial?.order ?? 0));
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    };
  }, [pendingPreview]);

  const previewImage = useMemo(() => {
    if (pendingPreview) return pendingPreview;
    return (
      resolveMediaUrl(initial?.image_url) ||
      initial?.image_external_url ||
      initial?.image_url ||
      ""
    );
  }, [initial, pendingPreview]);

  function handlePickImage(file: File | null) {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    if (!file) {
      setPendingImage(null);
      setPendingPreview(null);
      return;
    }
    setPendingImage(file);
    setPendingPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Escribe el nombre de la zona.");
      setSaving(false);
      return;
    }

    const payload: ZoneWritePayload = {
      name: trimmedName,
      growth_label: growthLabel,
      description: description.trim(),
      sub_zones: subZonesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      is_published: isPublished,
      order: Number(order) || 0,
    };

    try {
      let row =
        isEdit && initial
          ? await updateZoneApi(initial.slug, payload)
          : await createZoneApi(payload);

      if (pendingImage) {
        row = await uploadZoneImageApi(row.slug, pendingImage);
        handlePickImage(null);
      }

      onSaved(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-7">
      <div className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="zone-name">
            Nombre de la zona
          </label>
          <input
            id="zone-name"
            list="zone-name-suggestions"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Zona Juriquilla / Jurica"
            className={fieldClass}
            required
          />
          <datalist id="zone-name-suggestions">
            {SUGGESTED_ZONE_NAMES.map((zoneName) => (
              <option key={zoneName} value={zoneName} />
            ))}
          </datalist>
          <p className="mt-1.5 font-outfit text-[11px] font-light text-tl-beige/40">
            Si coincide con la zona de tus propiedades, el conteo se calcula
            solo. La URL se genera automáticamente.
          </p>
          {isEdit && initial ? (
            <p className="mt-1 font-outfit text-[11px] font-light text-tl-beige/35">
              /{initial.slug}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="zone-growth">
              Crecimiento
            </label>
            <select
              id="zone-growth"
              value={growthLabel}
              onChange={(event) =>
                setGrowthLabel(event.target.value as ZoneGrowthLabel)
              }
              className={fieldClass}
            >
              {GROWTH_LABELS.map((label) => (
                <option key={label} value={label} className="bg-tl-black">
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="zone-order">
              Orden
            </label>
            <input
              id="zone-order"
              type="number"
              min={0}
              value={order}
              onChange={(event) => setOrder(event.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="zone-description">
            Descripción
          </label>
          <textarea
            id="zone-description"
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={cn(fieldClass, "resize-y leading-relaxed")}
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="zone-subzones">
            Subzonas
          </label>
          <textarea
            id="zone-subzones"
            rows={4}
            value={subZonesText}
            onChange={(event) => setSubZonesText(event.target.value)}
            placeholder={"Una por línea\nEj. Juriquilla\nJurica"}
            className={cn(fieldClass, "resize-y")}
          />
        </div>

        <label className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2.5 font-outfit text-sm font-light text-tl-beige/75">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(event) => setIsPublished(event.target.checked)}
            className="accent-tl-gold"
          />
          Publicada en /zonas
        </label>
      </div>

      <div className="border-t border-white/8 pt-6">
        <ZoneImageDropzone
          previewUrl={previewImage || null}
          disabled={saving}
          allowClear={Boolean(pendingImage)}
          onFile={handlePickImage}
          label="Fotografía de la zona"
          hint="JPG, PNG o WebP"
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 font-outfit text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 py-2.5 font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-beige/70 hover:border-tl-gold/35 hover:text-tl-gold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-tl-gold bg-tl-gold px-6 py-2.5 font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-black transition-opacity disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isEdit ? "Guardar cambios" : "Crear zona"}
        </button>
      </div>
    </form>
  );
}
