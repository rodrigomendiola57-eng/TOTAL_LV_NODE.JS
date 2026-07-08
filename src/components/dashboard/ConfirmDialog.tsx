"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCancel}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-2xl border border-tl-gold/25 bg-tl-black p-6 shadow-2xl"
      >
        <h3 className="font-cormorant text-2xl text-tl-beige">{title}</h3>
        <p className="mt-3 font-outfit font-light text-sm leading-relaxed text-tl-beige/70">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-full px-5 py-2.5 font-outfit font-light text-xs uppercase tracking-[0.14em] text-tl-beige/60 transition-colors hover:text-tl-beige disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-outfit font-light text-xs uppercase tracking-[0.14em]",
              "border border-red-400/40 bg-red-950/40 text-red-200 transition-colors hover:bg-red-900/50 disabled:opacity-50",
            )}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
