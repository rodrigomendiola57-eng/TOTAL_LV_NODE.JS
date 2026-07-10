import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type DetailButtonVariant = "primary" | "secondary" | "ghost";

interface DetailButtonProps {
  href: string;
  label: string;
  icon?: LucideIcon;
  variant?: DetailButtonVariant;
  external?: boolean;
  className?: string;
  compact?: boolean;
}

const variantClasses: Record<DetailButtonVariant, string> = {
  primary:
    "border border-tl-gold/80 bg-tl-gold text-tl-black shadow-[0_12px_40px_rgba(214,181,133,0.18)] hover:bg-[#e2c59a]",
  secondary:
    "border border-tl-gold/35 bg-transparent text-tl-gold hover:border-tl-gold/60 hover:bg-tl-gold/8",
  ghost:
    "border border-white/12 bg-white/[0.03] text-tl-beige/85 hover:border-white/20 hover:bg-white/[0.05]",
};

export function DetailButton({
  href,
  label,
  icon: Icon,
  variant = "secondary",
  external = false,
  className,
  compact = false,
}: DetailButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-outfit font-light uppercase tracking-[0.16em] transition-all duration-300",
    compact ? "px-4 py-3 text-[10px]" : "w-full px-5 py-3.5 text-[11px]",
    variantClasses[variant],
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={classes}
      >
        {Icon ? <Icon className="h-4 w-4" strokeWidth={1.5} /> : null}
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {Icon ? <Icon className="h-4 w-4" strokeWidth={1.5} /> : null}
      {label}
    </Link>
  );
}
