"use client";

import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface TagChipsInputProps {
  label: string;
  hint?: string;
  values: string[];
  onChange: (values: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
}

export function TagChipsInput({
  label,
  hint,
  values,
  onChange,
  suggestions = [],
  placeholder = "Escribe y Enter",
  className,
}: TagChipsInputProps) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    const exists = values.some(
      (value) => value.toLowerCase() === tag.toLowerCase(),
    );
    if (exists) {
      setDraft("");
      return;
    }
    onChange([...values, tag]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(values.filter((value) => value !== tag));
  }

  const availableSuggestions = suggestions.filter(
    (item) =>
      !values.some((value) => value.toLowerCase() === item.toLowerCase()),
  );

  return (
    <div className={cn("sm:col-span-2 xl:col-span-3", className)}>
      <p className="mb-1.5 font-outfit font-light text-[11px] uppercase tracking-[0.14em] text-tl-beige/60">
        {label}
      </p>
      {hint ? (
        <p className="mb-2 font-outfit font-light text-[10px] text-tl-beige/40">
          {hint}
        </p>
      ) : null}

      <div className="rounded-2xl border border-tl-gold/20 bg-[#0a0a0a] p-3">
        <div className="flex flex-wrap gap-2">
          {values.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-tl-gold/35 bg-tl-gold/10 px-3 py-1.5 font-outfit text-xs font-light text-tl-beige"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-tl-beige/50 transition-colors hover:text-tl-gold"
                aria-label={`Quitar ${tag}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
          <div className="flex min-w-[12rem] flex-1 items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag(draft.replace(/,/g, ""));
                }
                if (e.key === "Backspace" && !draft && values.length > 0) {
                  removeTag(values[values.length - 1]!);
                }
              }}
              placeholder={placeholder}
              className="w-full bg-transparent px-1 py-1.5 font-outfit text-sm font-light text-tl-beige outline-none placeholder:text-tl-beige/30"
            />
            <button
              type="button"
              onClick={() => addTag(draft)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-tl-gold/25 text-tl-gold transition-colors hover:border-tl-gold"
              aria-label="Agregar"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {availableSuggestions.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {availableSuggestions.slice(0, 10).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => addTag(item)}
              className="rounded-full border border-tl-gold/15 px-3 py-1 font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-beige/55 transition-colors hover:border-tl-gold/40 hover:text-tl-gold"
            >
              + {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
