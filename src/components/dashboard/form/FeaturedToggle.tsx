"use client";

import { cn } from "@/lib/utils";
import { Star, type LucideIcon } from "lucide-react";

interface FeaturedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

export function FeaturedToggle({
  checked,
  onChange,
  title = "Propiedad destacada",
  description = "Aparecerá en la sección premium del sitio público.",
  icon: Icon = Star,
}: FeaturedToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-all sm:col-span-2 xl:col-span-3",
        checked
          ? "border-tl-gold/50 bg-gradient-to-r from-tl-gold/15 to-tl-olive/20"
          : "border-tl-gold/15 bg-[#0a0a0a] hover:border-tl-gold/30",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border",
            checked
              ? "border-tl-gold bg-tl-gold/20 text-tl-gold"
              : "border-tl-gold/20 text-tl-beige/40",
          )}
        >
          <Icon
            className="h-4 w-4"
            fill={Icon === Star && checked ? "currentColor" : "none"}
          />
        </span>
        <div>
          <p className="font-outfit font-light text-sm text-tl-beige">{title}</p>
          <p className="mt-0.5 font-outfit font-light text-xs text-tl-beige/50">
            {description}
          </p>
        </div>
      </div>
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-tl-gold" : "bg-tl-beige/20",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-tl-black transition-transform",
            checked ? "left-6" : "left-1",
          )}
        />
      </span>
    </button>
  );
}

