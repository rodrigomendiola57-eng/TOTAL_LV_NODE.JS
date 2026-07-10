import type { ZoneGrowthLabel } from "@/types/zone";
import { cn } from "@/lib/utils";

const growthStyles: Record<ZoneGrowthLabel, string> = {
  "Plusvalía premium":
    "border-tl-gold/50 bg-tl-gold/15 text-tl-gold",
  "Crecimiento alto":
    "border-white/20 bg-white/[0.08] text-tl-beige/90",
  "Crecimiento medio":
    "border-tl-beige/25 bg-tl-beige/[0.06] text-tl-beige/80",
  Emergente:
    "border-white/20 bg-white/[0.06] text-tl-beige/75",
};

interface ZoneGrowthBadgeProps {
  label: ZoneGrowthLabel;
  className?: string;
}

export function ZoneGrowthBadge({ label, className }: ZoneGrowthBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3.5 py-1 font-outfit text-[9px] font-light uppercase tracking-[0.2em] backdrop-blur-sm",
        growthStyles[label],
        className,
      )}
    >
      {label}
    </span>
  );
}
