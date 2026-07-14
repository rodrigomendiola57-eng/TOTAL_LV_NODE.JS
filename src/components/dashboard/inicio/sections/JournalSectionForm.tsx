"use client";

import {
  InicioField,
  InicioTextarea,
  InicioTextInput,
} from "@/components/dashboard/inicio/InicioField";
import { InicioImageUpload } from "@/components/dashboard/inicio/InicioImageUpload";
import { InicioVideoUpload } from "@/components/dashboard/inicio/InicioVideoUpload";
import { cn } from "@/lib/utils";
import type {
  HomeJournalMediaKind,
  HomeJournalPost,
  HomePageContent,
} from "@/types/home-content";
import { HOME_JOURNAL_MAX } from "@/types/home-content";
import { Film, ImageIcon, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PendingMedia {
  images: Record<number, File>;
  videos: Record<number, File>;
}

interface JournalSectionFormProps {
  content: HomePageContent;
  onPostChange: (id: number, patch: Partial<HomeJournalPost>) => void;
  onCreateCard: () => Promise<void>;
  onDeleteCard: (id: number) => Promise<void>;
  onSave: (pending: PendingMedia) => Promise<void>;
  isSaving?: boolean;
  isDirty?: boolean;
}

function asMediaKind(kind: HomeJournalPost["kind"]): HomeJournalMediaKind {
  return kind === "video" ? "video" : "image";
}

export function JournalSectionForm({
  content,
  onPostChange,
  onCreateCard,
  onDeleteCard,
  onSave,
  isSaving = false,
  isDirty = false,
}: JournalSectionFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingImages, setPendingImages] = useState<Record<number, File>>({});
  const [pendingVideos, setPendingVideos] = useState<Record<number, File>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<number, string>>(
    {},
  );
  const [videoPreviews, setVideoPreviews] = useState<Record<number, string>>(
    {},
  );

  const posts = [...content.journal_posts]
    .filter((post) => post.is_active)
    .sort((a, b) => a.order - b.order || a.id - b.id)
    .slice(0, HOME_JOURNAL_MAX);

  const canAdd = posts.length < HOME_JOURNAL_MAX;
  const hasPendingMedia =
    Object.keys(pendingImages).length > 0 ||
    Object.keys(pendingVideos).length > 0;
  const canSave = isDirty || hasPendingMedia;

  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach((url) => URL.revokeObjectURL(url));
      Object.values(videoPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stageImage(id: number, file: File) {
    setImagePreviews((current) => {
      const prev = current[id];
      if (prev) URL.revokeObjectURL(prev);
      return { ...current, [id]: URL.createObjectURL(file) };
    });
    setPendingImages((current) => ({ ...current, [id]: file }));
  }

  function stageVideo(id: number, file: File) {
    setVideoPreviews((current) => {
      const prev = current[id];
      if (prev) URL.revokeObjectURL(prev);
      return { ...current, [id]: URL.createObjectURL(file) };
    });
    setPendingVideos((current) => ({ ...current, [id]: file }));
  }

  function clearPending() {
    Object.values(imagePreviews).forEach((url) => URL.revokeObjectURL(url));
    Object.values(videoPreviews).forEach((url) => URL.revokeObjectURL(url));
    setPendingImages({});
    setPendingVideos({});
    setImagePreviews({});
    setVideoPreviews({});
  }

  async function handleCreate() {
    setIsCreating(true);
    try {
      await onCreateCard();
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(id: number) {
    if (
      !window.confirm(
        "¿Quitar esta card de Novedades? Esta acción no se puede deshacer desde aquí.",
      )
    ) {
      return;
    }
    setDeletingId(id);
    try {
      await onDeleteCard(id);
      setPendingImages((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      setPendingVideos((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSave() {
    await onSave({ images: pendingImages, videos: pendingVideos });
    clearPending();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-xl font-outfit text-sm text-tl-beige/65">
          Agrega cards de fotografía o video (máx. {HOME_JOURNAL_MAX}). En el
          sitio, el carrusel abre en la card del medio para mostrar contenido a
          ambos lados.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-tl-gold/20 px-3 py-1.5 font-outfit text-[11px] uppercase tracking-[0.14em] text-tl-beige/55">
            {posts.length}/{HOME_JOURNAL_MAX}
          </span>
          <button
            type="button"
            disabled={!canAdd || isCreating}
            onClick={() => void handleCreate()}
            className="inline-flex items-center gap-2 rounded-full border border-tl-gold/30 px-4 py-2 font-outfit text-xs uppercase tracking-[0.14em] text-tl-gold transition-colors hover:bg-tl-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isCreating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Agregar card
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-tl-gold/20 px-4 py-10 text-center font-outfit text-sm text-tl-beige/50">
          No hay cards. Pulsa «Agregar card» para crear la primera.
        </p>
      ) : null}

      <div className="space-y-5">
        {posts.map((post, index) => {
          const kind = asMediaKind(post.kind);
          const isVideo = kind === "video";
          const imageUrl = imagePreviews[post.id] ?? post.image_url;
          const videoUrl = videoPreviews[post.id] ?? post.video_url;

          return (
            <article
              key={post.id}
              className="space-y-5 rounded-2xl border border-tl-gold/15 bg-tl-black/40 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-outfit text-lg font-extralight text-tl-beige">
                  Card {index + 1}
                </h3>
                <button
                  type="button"
                  disabled={deletingId === post.id}
                  onClick={() => void handleDelete(post.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-400/25 px-3 py-1.5 font-outfit text-xs text-red-300/90 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                >
                  {deletingId === post.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Quitar
                </button>
              </div>

              <div>
                <p className="mb-2 font-outfit text-[11px] uppercase tracking-[0.14em] text-tl-beige/50">
                  ¿Fotografía o video?
                </p>
                <div className="inline-flex rounded-full border border-tl-gold/20 p-1">
                  {(
                    [
                      { value: "image", label: "Fotografía", Icon: ImageIcon },
                      { value: "video", label: "Video", Icon: Film },
                    ] as const
                  ).map(({ value, label, Icon }) => {
                    const selected = kind === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => onPostChange(post.id, { kind: value })}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-4 py-2 font-outfit text-xs uppercase tracking-[0.12em] transition-colors",
                          selected
                            ? "bg-tl-gold/20 text-tl-gold"
                            : "text-tl-beige/55 hover:text-tl-beige",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <InicioField label="Título (dorado y mayúsculas en el sitio)">
                <InicioTextInput
                  value={post.title}
                  onChange={(event) =>
                    onPostChange(post.id, { title: event.target.value })
                  }
                  placeholder="Formación continua"
                />
              </InicioField>

              <InicioField label="Texto">
                <InicioTextarea
                  rows={3}
                  value={post.body}
                  onChange={(event) =>
                    onPostChange(post.id, { body: event.target.value })
                  }
                />
              </InicioField>

              {isVideo ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  <InicioVideoUpload
                    label="Video"
                    currentUrl={videoUrl}
                    posterUrl={imageUrl}
                    onUpload={async (file) => stageVideo(post.id, file)}
                    hint="Se guarda al pulsar Guardar abajo."
                    buttonLabel="Elegir video"
                  />
                  <InicioImageUpload
                    label="Portada"
                    currentUrl={imageUrl}
                    onUpload={async (file) => stageImage(post.id, file)}
                    aspectClass="aspect-[9/16]"
                    buttonLabel="Elegir portada"
                    hint="Se ve antes del play. Se guarda al pulsar Guardar."
                  />
                </div>
              ) : (
                <InicioImageUpload
                  label="Fotografía"
                  currentUrl={imageUrl}
                  onUpload={async (file) => stageImage(post.id, file)}
                  aspectClass="aspect-[9/16]"
                  buttonLabel="Elegir foto"
                  hint="Se guarda al pulsar Guardar abajo."
                />
              )}
            </article>
          );
        })}
      </div>

      {posts.length > 0 ? (
        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-tl-gold/20 bg-tl-black/90 px-4 py-3 backdrop-blur-md sm:px-5">
          <p className="font-outfit text-xs text-tl-beige/50">
            {canSave
              ? "Hay cambios sin guardar."
              : "Sin cambios pendientes."}
          </p>
          <button
            type="button"
            disabled={!canSave || isSaving}
            onClick={() => void handleSave()}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-outfit text-sm transition-colors",
              canSave
                ? "bg-tl-gold text-tl-black hover:bg-tl-gold/90"
                : "cursor-not-allowed bg-tl-gold/20 text-tl-beige/40",
            )}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar
          </button>
        </div>
      ) : null}
    </div>
  );
}
