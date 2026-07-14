"use client";

import { cn } from "@/lib/utils";
import { Film, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v";

interface InicioVideoUploadProps {
  label: string;
  currentUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  hint?: string;
  posterUrl?: string | null;
  buttonLabel?: string;
}

export function InicioVideoUpload({
  label,
  currentUrl,
  onUpload,
  hint = "MP4, WebM o MOV. Máximo 120 MB. Se guarda en S3 si está configurado.",
  posterUrl,
  buttonLabel = "Subir video",
}: InicioVideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setIsUploading(true);
    setError(null);
    try {
      await onUpload(file);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo subir el video.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-tl-gold/15 bg-tl-black/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-outfit text-xs uppercase tracking-[0.14em] text-tl-beige/70">
          {label}
        </p>
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-tl-gold/25 px-3 py-1.5 font-outfit text-xs text-tl-gold transition-colors",
            "hover:bg-tl-gold/10 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Film className="h-3.5 w-3.5" />
          )}
          {buttonLabel}
        </button>
      </div>

      {currentUrl ? (
        <div className="mx-auto aspect-[9/16] w-full max-w-[14rem] overflow-hidden rounded-xl border border-tl-gold/10 bg-black/50">
          <video
            src={currentUrl}
            poster={posterUrl ?? undefined}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="mx-auto flex aspect-[9/16] w-full max-w-[14rem] items-center justify-center rounded-xl border border-dashed border-tl-gold/20 bg-tl-olive/10">
          <p className="font-outfit text-xs text-tl-beige/45">Sin video</p>
        </div>
      )}

      {hint ? (
        <p className="font-outfit text-xs text-tl-beige/45">{hint}</p>
      ) : null}
      {error ? (
        <p className="font-outfit text-xs text-red-400/90">{error}</p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={VIDEO_ACCEPT}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
