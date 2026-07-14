import { cn } from "@/lib/utils";
import {
  contactBody,
  contactBodyMuted,
  contactLabel,
} from "@/components/contact/contact-typography";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

interface ContactReassuranceProps {
  title: string;
  items: readonly string[];
  footer: string;
  className?: string;
  showHeading?: boolean;
}

export function ContactReassurance({
  title,
  items,
  footer,
  className,
  showHeading = true,
}: ContactReassuranceProps) {
  const hasTitle = title.trim().length > 0;
  const hasFooter = footer.trim().length > 0;
  const visibleItems = items.filter((item) => item.trim().length > 0);

  if (!hasTitle && visibleItems.length === 0 && !hasFooter) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/8 bg-black/20 p-4 sm:p-5 md:p-6",
        className,
      )}
    >
      {showHeading && hasTitle ? (
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 shrink-0 text-tl-gold" strokeWidth={1.25} />
          <p className={contactLabel}>{title}</p>
        </div>
      ) : null}
      {visibleItems.length > 0 ? (
        <ul
          className={cn(
            "space-y-3.5",
            showHeading && hasTitle ? "mt-5" : "",
          )}
        >
          {visibleItems.map((item) => (
            <li key={item} className={cn("flex items-start gap-3", contactBody)}>
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-tl-gold/80"
                strokeWidth={1.25}
              />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {hasFooter ? (
        <div
          className={cn(
            "flex items-center gap-2",
            contactBodyMuted,
            visibleItems.length > 0 || (showHeading && hasTitle) ? "mt-5" : "",
          )}
        >
          <Clock3 className="h-4 w-4 shrink-0" strokeWidth={1.25} />
          {footer}
        </div>
      ) : null}
    </div>
  );
}
