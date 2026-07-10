"use client";

import { downloadTechnicalSheet } from "@/lib/property-share";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";
import { FileText } from "lucide-react";

interface PropertyTechnicalSheetDownloadProps {
  property: Property;
  className?: string;
}

export function PropertyTechnicalSheetDownload({
  property,
  className,
}: PropertyTechnicalSheetDownloadProps) {
  const sheetUrl = resolveMediaUrl(property.technical_sheet_url);
  const hasSheet = Boolean(sheetUrl);

  return (
    <button
      type="button"
      onClick={() => {
        if (sheetUrl) downloadTechnicalSheet(property, sheetUrl);
      }}
      disabled={!hasSheet}
      className={cn(
        "col-span-2 flex items-center justify-center gap-2.5 rounded-2xl border px-4 py-4 transition-colors",
        hasSheet
          ? "border-tl-gold/18 bg-[linear-gradient(160deg,rgba(214,181,133,0.06),rgba(0,0,0,0.18))] text-tl-gold/90 hover:border-tl-gold/30 hover:bg-tl-gold/[0.07]"
          : "cursor-not-allowed border-white/8 bg-white/[0.02] text-tl-beige/28",
        className,
      )}
    >
      <FileText className="h-4 w-4 shrink-0" strokeWidth={1.25} />
      <span className="font-outfit text-[10px] font-light uppercase tracking-[0.16em]">
        Descargar ficha técnica
      </span>
    </button>
  );
}
