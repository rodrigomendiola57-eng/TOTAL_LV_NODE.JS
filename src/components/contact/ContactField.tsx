import { cn } from "@/lib/utils";
import {
  contactInputText,
  contactLabel,
} from "@/components/contact/contact-typography";
import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export const contactInputClassName = cn(
  "w-full min-h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition-[border-color,background-color,box-shadow]",
  "placeholder:text-tl-beige/28 focus:border-tl-gold/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-tl-gold/15",
  "sm:min-h-[3.25rem] sm:py-3.5",
  contactInputText,
);

interface ContactFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  hint?: string;
  wrapperClassName?: string;
}

export function ContactField({
  label,
  icon: Icon,
  hint,
  wrapperClassName,
  className,
  id,
  ...props
}: ContactFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <label htmlFor={fieldId} className={cn("block space-y-2.5", wrapperClassName)}>
      <span className="flex items-center justify-between gap-2">
        <span className={contactLabel}>{label}</span>
        {hint ? <span className={cn(contactLabel, "normal-case text-tl-beige/35")}>{hint}</span> : null}
      </span>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-tl-gold/55"
          strokeWidth={1.25}
        />
        <input
          id={fieldId}
          className={cn(contactInputClassName, "pl-11", className)}
          {...props}
        />
      </div>
    </label>
  );
}

interface ContactTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon: LucideIcon;
  footer?: ReactNode;
}

export function ContactTextarea({
  label,
  icon: Icon,
  footer,
  className,
  id,
  ...props
}: ContactTextareaProps) {
  const fieldId = id ?? props.name;

  return (
    <label htmlFor={fieldId} className="block space-y-2.5">
      <span className={contactLabel}>{label}</span>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-tl-gold/55"
          strokeWidth={1.25}
        />
        <textarea
          id={fieldId}
          className={cn(contactInputClassName, "min-h-[148px] resize-y pl-11 pt-3.5", className)}
          {...props}
        />
      </div>
      {footer}
    </label>
  );
}
