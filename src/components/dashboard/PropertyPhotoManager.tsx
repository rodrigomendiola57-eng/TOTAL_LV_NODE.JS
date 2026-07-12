"use client";

import {
  ACCEPTED_IMAGE_ACCEPT_ATTR,
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_TYPES,
  createPhotoDraftFromFile,
  MAX_PHOTO_SIZE_BYTES,
  type PhotoDraft,
} from "@/types/property-photo";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ImagePlus,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface PropertyPhotoManagerProps {
  photos: PhotoDraft[];
  onChange: (photos: PhotoDraft[]) => void;
  onDeleteExisting?: (photoId: number) => void;
  error?: string | null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  const extension = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    : "";

  const acceptedExtensions = ACCEPTED_IMAGE_EXTENSIONS.split(",");
  const hasValidExtension = acceptedExtensions.some(
    (item) => item.toLowerCase() === extension,
  );
  const hasValidMime =
    file.type.startsWith("image/") &&
    (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);

  if (!hasValidExtension && !hasValidMime) {
    return `"${file.name}" no es un formato de imagen compatible.`;
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return `"${file.name}" supera el límite de ${formatFileSize(MAX_PHOTO_SIZE_BYTES)}.`;
  }

  return null;
}

function normalizeCover(photos: PhotoDraft[]): PhotoDraft[] {
  if (photos.length === 0) return photos;

  const coverIndex = photos.findIndex((photo) => photo.isCover);
  if (coverIndex === -1) {
    return photos.map((photo, index) => ({
      ...photo,
      isCover: index === 0,
    }));
  }

  return photos.map((photo, index) => ({
    ...photo,
    isCover: index === coverIndex,
  }));
}

export function PropertyPhotoManager({
  photos,
  onChange,
  onDeleteExisting,
  error,
}: PropertyPhotoManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList);
      if (incoming.length === 0) return;

      const errors: string[] = [];
      const accepted: PhotoDraft[] = [];

      for (const file of incoming) {
        const validationError = validateFile(file);
        if (validationError) {
          errors.push(validationError);
          continue;
        }
        accepted.push(
          createPhotoDraftFromFile(file, photos.length === 0 && accepted.length === 0),
        );
      }

      if (errors.length > 0) {
        setLocalError(errors[0]);
      } else {
        setLocalError(null);
      }

      if (accepted.length === 0) return;

      const next = normalizeCover([...photos, ...accepted]);
      onChange(next);
    },
    [onChange, photos],
  );

  function setCover(clientId: string) {
    onChange(
      photos.map((photo) => ({
        ...photo,
        isCover: photo.clientId === clientId,
      })),
    );
  }

  function removePhoto(clientId: string) {
    const target = photos.find((photo) => photo.clientId === clientId);
    if (!target) return;

    if (target.kind === "existing" && target.id) {
      onDeleteExisting?.(target.id);
    }

    if (target.kind === "new") {
      URL.revokeObjectURL(target.previewUrl);
    }

    const next = photos.filter((photo) => photo.clientId !== clientId);
    onChange(normalizeCover(next));
  }

  function movePhoto(clientId: string, direction: -1 | 1) {
    const index = photos.findIndex((photo) => photo.clientId === clientId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= photos.length) return;

    const next = [...photos];
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
    onChange(next);
  }

  function reorderPhotos(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;

    const sourceIndex = photos.findIndex((photo) => photo.clientId === sourceId);
    const targetIndex = photos.findIndex((photo) => photo.clientId === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;

    const next = [...photos];
    const [item] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, item);
    onChange(next);
  }

  const displayError = localError ?? error;

  return (
    <div className="space-y-5">
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDraggingFiles(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node)) return;
          setIsDraggingFiles(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDraggingFiles(false);
          if (event.dataTransfer.files?.length) {
            addFiles(event.dataTransfer.files);
          }
        }}
        className={cn(
          "rounded-2xl border border-dashed px-5 py-8 text-center transition-colors sm:px-8 sm:py-10",
          isDraggingFiles
            ? "border-tl-gold bg-tl-gold/10"
            : "border-tl-gold/30 bg-[#0a0a0a]/50 hover:border-tl-gold/50",
        )}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-tl-gold/30 bg-tl-black/80 text-tl-gold">
          <Upload className="h-6 w-6" />
        </div>
        <p className="mt-4 font-outfit text-2xl font-extralight text-tl-beige">
          Arrastra tus fotografías aquí
        </p>
        <p className="mt-2 font-outfit text-sm font-light text-tl-beige/60">
          JPG, PNG, WEBP, GIF, HEIC, AVIF y más · hasta{" "}
          {formatFileSize(MAX_PHOTO_SIZE_BYTES)} por archivo
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-tl-gold px-5 py-2.5 font-outfit font-light text-xs uppercase tracking-[0.14em] text-tl-black transition-opacity hover:opacity-90"
        >
          <ImagePlus className="h-4 w-4" />
          Seleccionar imágenes
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_ACCEPT_ATTR}
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files);
            }
            event.target.value = "";
          }}
        />
      </div>

      {displayError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-950/25 px-4 py-3 font-outfit font-light text-sm text-red-300">
          {displayError}
        </p>
      ) : null}

      {photos.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-outfit font-light text-[11px] uppercase tracking-[0.16em] text-tl-beige/55">
              {photos.length} foto{photos.length === 1 ? "" : "s"} · arrastra para ordenar
            </p>
            <p className="font-outfit font-light text-[10px] uppercase tracking-[0.14em] text-tl-gold/80">
              La portada aparece primero en el catálogo
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {photos.map((photo, index) => (
              <article
                key={photo.clientId}
                draggable
                onDragStart={() => setDraggingId(photo.clientId)}
                onDragEnd={() => {
                  setDraggingId(null);
                  setDropTargetId(null);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDropTargetId(photo.clientId);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggingId) {
                    reorderPhotos(draggingId, photo.clientId);
                  }
                  setDraggingId(null);
                  setDropTargetId(null);
                }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-[#0a0a0a] transition-all",
                  photo.isCover
                    ? "border-tl-gold shadow-[0_0_24px_rgba(214,181,133,0.15)]"
                    : "border-tl-gold/20",
                  dropTargetId === photo.clientId && draggingId !== photo.clientId
                    ? "ring-2 ring-tl-gold/60"
                    : "",
                  draggingId === photo.clientId ? "opacity-60" : "",
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.previewUrl}
                    alt={photo.kind === "new" ? photo.file?.name ?? "Nueva foto" : "Foto de propiedad"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 font-outfit font-light text-[10px] uppercase tracking-[0.12em] text-tl-beige/85">
                      <GripVertical className="h-3.5 w-3.5" />
                      {index + 1}
                    </span>
                    {photo.isCover ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-tl-gold/50 bg-tl-gold/20 px-2.5 py-1 font-outfit font-light text-[10px] uppercase tracking-[0.12em] text-tl-gold">
                        <Star className="h-3.5 w-3.5" fill="currentColor" />
                        Portada
                      </span>
                    ) : null}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    {!photo.isCover ? (
                      <button
                        type="button"
                        onClick={() => setCover(photo.clientId)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-tl-gold/35 bg-black/70 px-3 py-1.5 font-outfit font-light text-[10px] uppercase tracking-[0.12em] text-tl-beige/85 hover:border-tl-gold hover:text-tl-gold"
                      >
                        <Star className="h-3.5 w-3.5" />
                        Portada
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.clientId)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-400/35 bg-black/70 px-3 py-1.5 font-outfit font-light text-[10px] uppercase tracking-[0.12em] text-red-200 hover:border-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Quitar
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-tl-gold/10 px-3 py-2.5">
                  <p className="truncate font-outfit font-light text-xs text-tl-beige/65">
                    {photo.kind === "new" ? photo.file?.name : `Foto #${photo.id}`}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => movePhoto(photo.clientId, -1)}
                      disabled={index === 0}
                      className="rounded-lg border border-tl-gold/20 p-1.5 text-tl-beige/60 transition-colors hover:border-tl-gold hover:text-tl-gold disabled:opacity-30"
                      aria-label="Mover antes"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhoto(photo.clientId, 1)}
                      disabled={index === photos.length - 1}
                      className="rounded-lg border border-tl-gold/20 p-1.5 text-tl-beige/60 transition-colors hover:border-tl-gold hover:text-tl-gold disabled:opacity-30"
                      aria-label="Mover después"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-tl-gold/15 bg-[#0a0a0a]/40 px-4 py-3 font-outfit font-light text-sm text-tl-beige/55">
          Aún no hay fotos. Sube al menos una imagen para mostrar la propiedad en el
          catálogo público.
        </p>
      )}
    </div>
  );
}
