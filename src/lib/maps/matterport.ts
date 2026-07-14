/**
 * Utilidades Matterport: parseo de URL/ID y URL de embed Showcase.
 * Docs: https://support.matterport.com/s/article/Embed-a-Matterport-3D-Model
 */

/** Demo público citado en la documentación de Matterport Showcase. */
export const MATTERPORT_DEMO_MODEL_ID = "Zh14WDtkjdC";

const MATTERPORT_ID_RE = /^[A-Za-z0-9_-]{11,25}$/;

export function parseMatterportId(value: string): string | null {
  const text = value.trim();
  if (!text) return null;

  if (MATTERPORT_ID_RE.test(text)) return text;

  try {
    const withProtocol = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    const url = new URL(withProtocol);
    const fromQuery = url.searchParams.get("m");
    if (fromQuery && MATTERPORT_ID_RE.test(fromQuery)) return fromQuery;

    const pathMatch = url.pathname.match(/\/show\/([A-Za-z0-9_-]{11,25})/);
    if (pathMatch?.[1]) return pathMatch[1];
  } catch {
    // fall through
  }

  const loose = text.match(/[?&]m=([A-Za-z0-9_-]{11,25})/);
  return loose?.[1] ?? null;
}

export function buildMatterportEmbedUrl(
  modelId: string,
  options?: {
    play?: boolean;
    disableWheelZoom?: boolean;
    /** Móvil: forzar que el showcase se quede en el iframe (nt=0). */
    stayInFrame?: boolean;
    /** Móvil: entrar directo al recorrido interactivo (qs=1), sin intro. */
    quickStart?: boolean;
  },
): string {
  const params = new URLSearchParams({ m: modelId });
  if (options?.play !== false) params.set("play", "1");
  if (options?.disableWheelZoom !== false) params.set("wh", "0");
  // Matterport: nt=1 abre en pestaña nueva en móvil (comportamiento nativo);
  // nt=0 fuerza que el showcase se quede dentro del iframe.
  if (options?.stayInFrame) params.set("nt", "0");
  // qs=1: saltar la órbita de introducción y quedar interactivo de inmediato,
  // clave en móvil para que el primer toque ya mueva el recorrido.
  if (options?.quickStart) params.set("qs", "1");
  return `https://my.matterport.com/show/?${params.toString()}`;
}

export function buildMatterportShareUrl(modelId: string): string {
  return `https://my.matterport.com/show/?m=${modelId}`;
}
