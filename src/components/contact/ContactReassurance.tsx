import { cn } from "@/lib/utils";
import {
  contactBody,
  contactBodyMuted,
  contactLabel,
} from "@/components/contact/contact-typography";
import { CONTACT_PAGE } from "@/lib/data/contact-page";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

interface ContactReassuranceProps {
  className?: string;
  showHeading?: boolean;
}

export function ContactReassurance({
  className,
  showHeading = true,
}: ContactReassuranceProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/8 bg-black/20 p-4 sm:p-5 md:p-6",
        className,
      )}
    >
      {showHeading ? (
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 shrink-0 text-tl-gold" strokeWidth={1.25} />
          <p className={contactLabel}>Por qué es fácil</p>
        </div>
      ) : null}
      <ul className={cn("space-y-3.5", showHeading ? "mt-5" : "")}>
        {CONTACT_PAGE.reassurance.map((item) => (
          <li key={item} className={cn("flex items-start gap-3", contactBody)}>
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-tl-gold/80"
              strokeWidth={1.25}
            />
            {item}
          </li>
        ))}
      </ul>
      <div className={cn("mt-5 flex items-center gap-2", contactBodyMuted)}>
        <Clock3 className="h-4 w-4 shrink-0" strokeWidth={1.25} />
        Respuesta habitual en horario laboral
      </div>
    </div>
  );
}
