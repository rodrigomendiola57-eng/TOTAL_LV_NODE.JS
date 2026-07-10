import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PropertyDetailSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** En desktop ocupa todo el ancho de la columna (sin límite max-w-4xl). */
  wide?: boolean;
}

export function PropertyDetailSection({
  title,
  subtitle,
  children,
  wide = false,
}: PropertyDetailSectionProps) {
  return (
    <section className="space-y-7 sm:space-y-8">
      <header className="mx-auto max-w-2xl text-center">
        <h2 className="font-outfit text-[clamp(1.55rem,3vw,2rem)] font-extralight leading-tight tracking-[0.02em] text-tl-beige">
          {title}
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-2.5 max-w-xl font-outfit text-[clamp(0.9rem,1.8vw,1.05rem)] font-extralight uppercase tracking-[0.2em] text-tl-gold">
            {subtitle}
          </p>
        ) : null}
        <div
          className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-tl-gold/40 to-transparent"
          aria-hidden="true"
        />
      </header>

      <div
        className={cn(
          "mx-auto w-full max-w-4xl",
          wide && "lg:max-w-none",
        )}
      >
        {children}
      </div>
    </section>
  );
}
