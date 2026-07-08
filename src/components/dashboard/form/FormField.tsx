import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, hint, error, className, children }: FormFieldProps) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block font-outfit font-light text-[11px] uppercase tracking-[0.14em] text-tl-beige/60">
        {label}
      </span>
      {hint ? (
        <span className="mb-2 block font-outfit font-light text-[10px] leading-relaxed text-tl-beige/40">
          {hint}
        </span>
      ) : null}
      {children}
      {error ? (
        <span className="mt-1.5 block font-outfit font-light text-xs text-red-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export const formInputClass =
  "w-full rounded-xl border border-tl-gold/20 bg-[#0a0a0a] px-4 py-3 font-outfit font-light text-sm text-tl-beige shadow-[inset_0_1px_0_rgba(242,236,224,0.03)] outline-none transition-all placeholder:text-tl-beige/30 focus:border-tl-gold/55 focus:shadow-[0_0_0_3px_rgba(214,181,133,0.12)] disabled:cursor-not-allowed disabled:opacity-50";

export function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-tl-gold/12 bg-gradient-to-b from-tl-black/50 to-[#0a0a0a]/80 p-5 sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        {icon ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-tl-gold/20 bg-tl-gold/5 text-tl-gold">
            {icon}
          </span>
        ) : null}
        <div>
          <h3 className="font-cormorant text-2xl font-light text-tl-beige">{title}</h3>
          {description ? (
            <p className="mt-1 font-outfit font-light text-xs leading-relaxed text-tl-beige/55">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}
