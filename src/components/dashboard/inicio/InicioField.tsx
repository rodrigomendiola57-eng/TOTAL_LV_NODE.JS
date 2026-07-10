"use client";

import { cn } from "@/lib/utils";

interface InicioFieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function InicioField({ label, hint, children, className }: InicioFieldProps) {
  return (
    <label className={cn("block space-y-2", className)}>
      <span className="block font-outfit text-xs uppercase tracking-[0.14em] text-tl-beige/70">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="block font-outfit text-xs text-tl-beige/45">{hint}</span>
      ) : null}
    </label>
  );
}

const inputClassName =
  "w-full rounded-xl border border-tl-gold/15 bg-tl-black/60 px-4 py-3 font-outfit text-sm text-tl-beige outline-none transition-colors focus:border-tl-gold/40";

export function InicioTextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={cn(inputClassName, props.className)} />;
}

export function InicioTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      rows={props.rows ?? 4}
      className={cn(inputClassName, "resize-y min-h-[96px]", props.className)}
    />
  );
}
