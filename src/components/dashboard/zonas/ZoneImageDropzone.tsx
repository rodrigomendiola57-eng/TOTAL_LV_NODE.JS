"use client";

import { ACCEPTED_IMAGE_ACCEPT_ATTR } from "@/types/property-photo";
import { cn } from "@/lib/utils";
import { ImagePlus, Replace, X } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";

interface ZoneImageDropzoneProps {
  previewUrl?: string | null;
  disabled?: boolean;
  /** Muestra “Quitar” (útil para limpiar una imagen pendiente local). */
  allowClear?: boolean;
  onFile: (file: File | null) => void;
  className?: string;
  label?: string;
  hint?: string;
}

export function ZoneImageDropzone({
  previewUrl,
  disabled = false,
  allowClear = false,
  onFile,
  className,
  label = "Fotografía",
  hint = "Arrastra una imagen o selecciónala desde tu equipo",
}: ZoneImageDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const acceptFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) return;
      onFile(file);
    },
    [onFile],
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45">
          {label}
        </p>
        {previewUrl && allowClear ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              onFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="inline-flex items-center gap-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-beige/45 transition-colors hover:text-tl-gold disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            Quitar
          </button>
        ) : null}
      </div>

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget.contains(event.relatedTarget as Node)) return;
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (disabled) return;
          acceptFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "group relative overflow-hidden rounded-xl border border-dashed transition-all",
          "min-h-[8.5rem] cursor-pointer sm:min-h-[9.5rem]",
          dragging
            ? "border-tl-gold/70 bg-tl-gold/[0.07]"
            : "border-white/10 bg-transparent hover:border-tl-gold/35",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        {previewUrl ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${previewUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 py-3">
              <p className="font-outfit text-[11px] font-light text-tl-beige/75">
                Vista previa
              </p>
              <span className="inline-flex items-center gap-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-beige/70 transition-colors group-hover:text-tl-gold">
                <Replace className="h-3.5 w-3.5" strokeWidth={1.5} />
                Cambiar
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-[8.5rem] items-center justify-center gap-4 px-5 sm:min-h-[9.5rem] sm:justify-start sm:px-6">
            <span
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors",
                dragging
                  ? "border-tl-gold/45 text-tl-gold"
                  : "border-white/12 text-tl-beige/40 group-hover:border-tl-gold/30 group-hover:text-tl-gold",
              )}
            >
              <ImagePlus className="h-4 w-4" strokeWidth={1.25} />
            </span>
            <div className="min-w-0 text-left">
              <p className="font-outfit text-sm font-light text-tl-beige/75">
                {dragging ? "Suelta la imagen aquí" : "Arrastra una imagen aquí"}
              </p>
              <p className="mt-0.5 font-outfit text-[11px] font-light text-tl-beige/35">
                {hint} ·{" "}
                <span className="text-tl-gold/80">seleccionar archivo</span>
              </p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_IMAGE_ACCEPT_ATTR}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            acceptFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
