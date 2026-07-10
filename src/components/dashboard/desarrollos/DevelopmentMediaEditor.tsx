"use client";

import {
  addDevelopmentGalleryImage,
  deleteDevelopmentGalleryImage,
  listDevelopmentGallery,
  uploadDevelopmentCover,
  type DevelopmentApiModel,
  type DevelopmentMediaItem,
} from "@/lib/api/developments";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";
import {
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface DevelopmentMediaEditorProps {
  slug: string | null;
  coverUrl: string;
  coverExternalUrl: string;
  onCoverExternalUrlChange: (url: string) => void;
  onCoverUpdated: (row: DevelopmentApiModel) => void;
  disabled?: boolean;
}

export function DevelopmentMediaEditor({
  slug,
  coverUrl,
  coverExternalUrl,
  onCoverExternalUrlChange,
  onCoverUpdated,
  disabled = false,
}: DevelopmentMediaEditorProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [gallery, setGallery] = useState<DevelopmentMediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshGallery = useCallback(async () => {
    if (!slug) {
      setGallery([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await listDevelopmentGallery(slug);
      setGallery(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la galería");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void refreshGallery();
  }, [refreshGallery]);

  async function handleCoverFile(file: File | null) {
    if (!file || !slug) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await uploadDevelopmentCover(slug, file);
      onCoverUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir portada");
    } finally {
      setBusy(false);
    }
  }

  async function handleGalleryFiles(files: FileList | null) {
    if (!files?.length || !slug) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        await addDevelopmentGalleryImage(slug, file);
      }
      await refreshGallery();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir galería");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(imageId: number) {
    if (!slug) return;
    if (!window.confirm("¿Eliminar esta imagen de la galería?")) return;
    setBusy(true);
    setError(null);
    try {
      await deleteDevelopmentGalleryImage(slug, imageId);
      setGallery((current) => current.filter((item) => item.id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar");
    } finally {
      setBusy(false);
    }
  }

  const resolvedCover =
    resolveMediaUrl(coverUrl) ||
    coverUrl ||
    coverExternalUrl ||
    "";

  if (!slug) {
    return (
      <div className="rounded-2xl border border-dashed border-tl-gold/25 bg-[#0a0a0a]/60 px-5 py-10 text-center">
        <p className="font-outfit text-sm font-light text-tl-beige/60">
          Guarda el desarrollo primero para subir portada y galería.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:col-span-2 xl:col-span-3">
      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-outfit text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          <p className="font-outfit text-[11px] uppercase tracking-[0.14em] text-tl-beige/60">
            Portada
          </p>
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl border border-tl-gold/20 bg-[#0a0a0a]",
              "aspect-[16/10]",
            )}
          >
            {resolvedCover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolvedCover}
                alt="Portada del desarrollo"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-tl-beige/40">
                <ImagePlus className="h-8 w-8" />
                <span className="font-outfit text-xs">Sin portada</span>
              </div>
            )}
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-tl-black/70 px-2.5 py-1 font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-gold">
              <Star className="h-3 w-3" /> Cover
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => coverInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-tl-gold/35 px-4 py-2 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-gold disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              Subir archivo
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                void handleCoverFile(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
          </div>
          <label className="block">
            <span className="mb-1.5 block font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-beige/45">
              O URL externa
            </span>
            <input
              value={coverExternalUrl}
              onChange={(e) => onCoverExternalUrlChange(e.target.value)}
              disabled={disabled}
              placeholder="https://…"
              className="w-full rounded-xl border border-tl-gold/20 bg-[#0a0a0a] px-3 py-2.5 font-outfit text-sm font-light text-tl-beige outline-none focus:border-tl-gold/50"
            />
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-outfit text-[11px] uppercase tracking-[0.14em] text-tl-beige/60">
              Galería ({gallery.length})
            </p>
            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => galleryInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-tl-gold/15 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-gold disabled:opacity-50"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Agregar
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                void handleGalleryFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-tl-gold/15 bg-[#0a0a0a]">
              <Loader2 className="h-5 w-5 animate-spin text-tl-gold" />
            </div>
          ) : gallery.length === 0 ? (
            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => galleryInputRef.current?.click()}
              className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-tl-gold/25 bg-[#0a0a0a]/60 text-tl-beige/45 transition-colors hover:border-tl-gold/40 hover:text-tl-gold"
            >
              <ImagePlus className="h-7 w-7" />
              <span className="font-outfit text-xs">Arrastra o selecciona fotos</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                    disabled={busy}
                    onClick={() => void handleDelete(item.id)}
                    className="absolute right-2 top-2 rounded-full bg-tl-black/75 p-1.5 text-red-300 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Eliminar imagen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
