/** Tipografía del módulo contacto — alineada al navbar (Outfit extralight). */

export const contactEyebrow =
  "font-outfit text-[11px] font-extralight uppercase tracking-[0.2em] text-tl-gold sm:text-xs md:text-sm sm:tracking-[0.24em]";

export const contactTitle =
  "font-outfit text-[clamp(1.85rem,7vw,3.5rem)] font-extralight leading-[1.08] tracking-[0.015em] text-tl-beige md:text-[clamp(2.2rem,5vw,3.25rem)] xl:text-[clamp(2.35rem,4vw,3.75rem)]";

export const contactSubtitle =
  "font-outfit text-[clamp(1.25rem,4.5vw,1.85rem)] font-extralight leading-tight tracking-[0.02em] text-tl-beige md:text-[clamp(1.35rem,3vw,2rem)]";

export const contactBody =
  "font-outfit text-[0.9375rem] font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/78 sm:text-base md:text-[1.0625rem] xl:text-lg";

export const contactBodyMuted =
  "font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/58 sm:text-[0.9375rem] md:text-base";

export const contactLabel =
  "font-outfit text-xs font-extralight uppercase tracking-[0.14em] text-tl-beige/52 sm:text-sm";

export const contactValue =
  "font-outfit text-base font-extralight leading-snug tracking-[0.02em] text-tl-beige sm:text-lg md:text-xl";

export const contactHint =
  "font-outfit text-xs font-extralight leading-snug tracking-[0.02em] text-tl-beige/42 sm:text-sm md:text-base";

export const contactInputText =
  "font-outfit text-base font-extralight tracking-[0.02em] text-tl-beige sm:text-[1.0625rem] xl:text-lg";

export const contactButton =
  "font-outfit text-xs font-extralight uppercase tracking-[0.14em] sm:text-sm md:text-base md:tracking-[0.16em]";

export const contactChip =
  "font-outfit text-xs font-extralight tracking-[0.02em] sm:text-sm md:text-base";

/** Contenedor principal del módulo contacto. */
export const contactSectionShell =
  "relative z-[1] px-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-[calc(4.75rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-12 sm:pt-24 md:pb-16 xl:pb-20";

/** Grid principal: 1 columna hasta xl, 2 columnas en desktop ancho. */
export const contactMainGrid =
  "grid grid-cols-1 gap-8 md:gap-10 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:items-start xl:gap-12 2xl:gap-14";

/** Columna del formulario — primero en móvil/tablet, sticky solo en xl+. */
export const contactFormColumn =
  "order-1 pt-10 sm:pt-12 md:pt-14 xl:order-2 xl:sticky xl:top-[calc(6.75rem+env(safe-area-inset-top,0px))] xl:max-h-[calc(100dvh-8rem-env(safe-area-inset-top,0px))] xl:overflow-y-auto xl:overscroll-contain xl:pt-16";

/** Columna informativa — después del form en móvil/tablet. */
export const contactInfoColumn = "order-2 space-y-8 md:space-y-10 xl:order-1";
