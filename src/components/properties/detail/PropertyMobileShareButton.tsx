"use client";

import { shareProperty } from "@/lib/property-share";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";
import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PropertyMobileShareButtonProps {
  property: Property;
}

export function PropertyMobileShareButton({ property }: PropertyMobileShareButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 2200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label="Compartir propiedad"
        onClick={() => {
          void shareProperty(property).then((message) => {
            if (message) setFeedback(message);
          });
        }}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-tl-beige/75 transition-colors hover:border-tl-gold/35 hover:bg-tl-gold/8 hover:text-tl-gold active:scale-[0.98]",
        )}
      >
        <Share2 className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.25} />
      </button>

      {feedback ? (
        <span
          role="status"
          className="pointer-events-none absolute bottom-[calc(100%+0.35rem)] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full border border-tl-gold/25 bg-tl-black/95 px-2.5 py-1 font-outfit text-[9px] font-light uppercase tracking-[0.12em] text-tl-gold shadow-lg"
        >
          {feedback}
        </span>
      ) : null}
    </div>
  );
}
