"use client";

import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { PropertyShareSheet } from "./PropertyShareSheet";

interface PropertyMobileShareButtonProps {
  property: Property;
}

export function PropertyMobileShareButton({ property }: PropertyMobileShareButtonProps) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label="Compartir propiedad"
        onClick={() => setShareOpen(true)}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-tl-beige/75 transition-colors hover:border-tl-gold/35 hover:bg-tl-gold/8 hover:text-tl-gold active:scale-[0.98]",
        )}
      >
        <Share2 className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.25} />
      </button>

      <PropertyShareSheet
        property={property}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
