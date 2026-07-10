"use client";

import { cn } from "@/lib/utils";
import { FileText, Trash2, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export const ACCEPTED_PDF_TYPES = ["application/pdf"] as const;
export const ACCEPTED_PDF_EXTENSION = ".pdf";
export const MAX_TECHNICAL_SHEET_BYTES = 15 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validatePdf(file: File): string | null {
  const extension = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    : "";

  if (extension !== ACCEPTED_PDF_EXTENSION && file.type !== "application/pdf") {
    return `"${file.name}" no es un PDF válido.`;
  }

  if (file.size > MAX_TECHNICAL_SHEET_BYTES) {
    return `"${file.name}" supera el límite de ${formatFileSize(MAX_TECHNICAL_SHEET_BYTES)}.`;
  }

  return null;
}

interface PropertyTechnicalSheetUploadProps {
  existingUrl?: string | null;
  existingFilename?: string | null;
  pendingFile: File | null;
  markedForRemoval: boolean;
  onFileSelect: (file: File | null) => void;
  onMarkForRemoval: () => void;
  onUndoRemoval: () => void;
  error?: string | null;
}

export function PropertyTechnicalSheetUpload({
  existingUrl,
  existingFilename,
  pendingFile,
  markedForRemoval,
  onFileSelect,
  onMarkForRemoval,
  onUndoRemoval,
  error,
}: PropertyTechnicalSheetUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const hasExisting = Boolean(existingUrl) && !markedForRemoval && !pendingFile;
  const displayName =
    pendingFile?.name ??
    (hasExisting ? existingFilename ?? "ficha-tecnica.pdf" : null);

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validatePdf(file);
      if (validationError) {
        setLocalError(validationError);
        return;
      }
      setLocalError(null);
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const displayError = localError ?? error;

  if (hasExisting || pendingFile) {
    return (
      <div className="space-y-3">
        <div className="flex flex-col gap-3 rounded-2xl border border-tl-gold/20 bg-[#0a0a0a]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-tl-gold/25 bg-tl-black/80 text-tl-gold">
              <FileText className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-outfit text-sm font-light text-tl-beige">
                {displayName}
              </p>
              <p className="font-outfit text-xs font-light text-tl-beige/45">
                {pendingFile
                  ? `${formatFileSize(pendingFile.size)} · pendiente de guardar`
                  : "PDF actual de la propiedad"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {hasExisting && existingUrl ? (
              <a
                href={existingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-tl-gold/30 px-4 py-2 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-gold transition-colors hover:border-tl-gold/60"
              >
                Ver PDF
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => {
                onFileSelect(null);
                if (existingUrl) onMarkForRemoval();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/25 px-4 py-2 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-red-300/90 transition-colors hover:border-red-400/50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Quitar
            </button>
          </div>
        </div>

        {displayError ? (
          <p className="font-outfit text-sm font-light text-red-300">{displayError}</p>
        ) : null}
      </div>
    );
  }

  if (markedForRemoval) {
    return (
      <div className="rounded-2xl border border-dashed border-tl-gold/20 bg-[#0a0a0a]/40 px-5 py-6 text-center">
        <p className="font-outfit text-sm font-light text-tl-beige/55">
          La ficha técnica se eliminará al guardar.
        </p>
        <button
          type="button"
          onClick={onUndoRemoval}
          className="mt-3 font-outfit text-xs font-light uppercase tracking-[0.14em] text-tl-gold transition-opacity hover:opacity-80"
        >
          Deshacer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
          const file = event.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={cn(
          "rounded-2xl border border-dashed px-5 py-7 text-center transition-colors sm:px-8",
          isDraggingFiles
            ? "border-tl-gold bg-tl-gold/10"
            : "border-tl-gold/30 bg-[#0a0a0a]/50 hover:border-tl-gold/50",
        )}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-tl-gold/30 bg-tl-black/80 text-tl-gold">
          <Upload className="h-5 w-5" />
        </div>
        <p className="mt-3 font-outfit text-base font-extralight text-tl-beige">
          Arrastra el PDF de la ficha técnica
        </p>
        <p className="mt-1 font-outfit text-xs font-light text-tl-beige/50">
          Un solo archivo PDF · hasta {formatFileSize(MAX_TECHNICAL_SHEET_BYTES)}
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-tl-gold/40 px-5 py-2.5 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-gold transition-colors hover:border-tl-gold/70 hover:bg-tl-gold/8"
        >
          <FileText className="h-4 w-4" />
          Seleccionar PDF
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_PDF_EXTENSION}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
            event.target.value = "";
          }}
        />
      </div>

      {displayError ? (
        <p className="font-outfit text-sm font-light text-red-300">{displayError}</p>
      ) : null}
    </div>
  );
}
