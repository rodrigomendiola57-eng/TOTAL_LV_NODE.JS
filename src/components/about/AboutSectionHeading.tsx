interface AboutSectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function AboutSectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: AboutSectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <header className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div
        className={`mb-3 h-px w-10 bg-tl-gold/70 sm:mb-4 ${isCenter ? "mx-auto" : ""}`}
        aria-hidden
      />
      <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold sm:text-xs sm:tracking-[0.28em]">
        {eyebrow}
      </p>
      <h2 className="mt-2.5 font-outfit text-[clamp(1.5rem,5.5vw,2.75rem)] font-extralight leading-[1.08] tracking-[0.01em] text-tl-beige sm:mt-3">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 font-outfit text-sm font-light leading-relaxed tracking-[0.02em] text-tl-beige/70 sm:mt-4 sm:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
