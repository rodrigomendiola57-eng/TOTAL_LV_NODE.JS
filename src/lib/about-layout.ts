/** Offset scroll para anclas bajo navbar móvil + sub-nav sticky. */
export const ABOUT_SECTION_SCROLL_MT =
  "scroll-mt-[calc(6.75rem+env(safe-area-inset-top,0px))] sm:scroll-mt-32";

/** Padding vertical más compacto para acercar secciones. */
export const ABOUT_SECTION_PY = "py-10 sm:py-14 lg:py-16";

/** Sin raya horizontal visible entre bloques (antes border-white/6). */
export const ABOUT_SECTION_BORDER = "border-b border-transparent";

export const ABOUT_SECTION_SHELL = `${ABOUT_SECTION_SCROLL_MT} ${ABOUT_SECTION_PY} ${ABOUT_SECTION_BORDER}`;

export const ABOUT_CONTAINER = "mx-auto max-w-6xl px-4 sm:px-6";
