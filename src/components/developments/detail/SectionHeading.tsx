interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <header className="mx-auto max-w-2xl px-4 text-center sm:px-6">
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
  );
}
