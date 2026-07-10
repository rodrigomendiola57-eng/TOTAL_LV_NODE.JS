"use client";

import { cn } from "@/lib/utils";
import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface InicioImageUploadProps {
  label: string;
  currentUrl?: string | null;
  onUpload: (file: File) => Promise<void>;
  hint?: string;
}

export function InicioImageUpload({
  label,
  currentUrl,
  onUpload,
  hint,
}: InicioImageUploadProps) {
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
          : "No se pudo subir la imagen.",
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
            <ImagePlus className="h-3.5 w-3.5" />
          )}
          Subir imagen
        </button>
      </div>

      {currentUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-tl-gold/10">
          <Image
            src={currentUrl}
            alt={label}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center rounded-xl border border-dashed border-tl-gold/20 bg-tl-olive/10">
          <p className="font-outfit text-xs text-tl-beige/45">Sin imagen</p>
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
        accept="image/jpeg,image/png,image/webp"
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
