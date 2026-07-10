"use client";

import { shareProperty, downloadTechnicalSheet } from "@/lib/property-share";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";
import { FileText, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PropertyContactActionsProps {
  property: Property;
}

const actionButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border px-2 py-2.5 font-outfit text-[9px] font-light uppercase tracking-[0.1em] transition-all duration-300 sm:text-[10px] sm:tracking-[0.12em]";

export function PropertyContactActions({ property }: PropertyContactActionsProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const sheetUrl = resolveMediaUrl(property.technical_sheet_url);
  const hasSheet = Boolean(sheetUrl);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 2200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  async function handleShare() {
    const message = await shareProperty(property);
    if (message) setFeedback(message);
  }

  function handleDownload() {
    if (!sheetUrl) return;
    downloadTechnicalSheet(property, sheetUrl);
  }

  return (
    <div className="relative space-y-2">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => void handleShare()}
          className={cn(
            actionButtonClass,
            "border-white/12 bg-white/[0.03] text-tl-beige/85 hover:border-white/20 hover:bg-white/[0.05] hover:text-tl-gold",
          )}
        >
          <Share2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          <span className="text-center leading-tight">Compartir propiedad</span>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!hasSheet}
          className={cn(
            actionButtonClass,
            hasSheet
              ? "border-tl-gold/35 bg-transparent text-tl-gold hover:border-tl-gold/60 hover:bg-tl-gold/8"
              : "cursor-not-allowed border-white/8 bg-white/[0.02] text-tl-beige/28",
          )}
        >
          <FileText className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          <span className="text-center leading-tight">Ficha técnica</span>
        </button>
      </div>

      {feedback ? (
        <p
          role="status"
          className="text-center font-outfit text-[10px] font-light uppercase tracking-[0.12em] text-tl-gold"
        >
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
