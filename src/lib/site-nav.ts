/**
 * Navbar en modo overlay: ancho completo, semitransparente sobre el hero
 * hasta que el usuario hace scroll. El dashboard usa su propio layout sin navbar.
 */
export function shouldUseOverlayNavbar(pathname: string): boolean {
  return !pathname.startsWith("/dashboard");
}

export const NAVBAR_OVERLAY_CLASSES =
  "mt-0 w-full max-w-none rounded-none border-x-0 border-t-0 px-5 py-4 sm:px-8";

export const NAVBAR_FLOATING_CLASSES =
  "mt-4 w-[94%] max-w-7xl rounded-2xl px-6 py-4.5";

/** Padding superior para contenido bajo el navbar fijo en páginas con hero. */
export const HERO_CONTENT_OFFSET = "pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:pt-32";
