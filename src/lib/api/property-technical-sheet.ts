import { resolveMediaUrl } from "@/lib/media-url";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { staticExportFetchInit } from "@/lib/static-export";

export interface TechnicalSheetInfo {
  url: string | null;
  filename: string | null;
}

export async function getTechnicalSheet(
  propertyId: number,
): Promise<TechnicalSheetInfo> {
  const response = await fetch(
    `${getApiBaseUrl()}/properties/${propertyId}/technical-sheet/`,
    staticExportFetchInit({
      method: "GET",
      headers: { Accept: "application/json" },
    }),
  );

  if (!response.ok) {
    throw new Error(`No se pudo cargar la ficha técnica (${response.status}).`);
  }

  const data = (await response.json()) as TechnicalSheetInfo;
  return {
    ...data,
    url: resolveMediaUrl(data.url) ?? data.url,
  };
}

/**
 * URL pública del backend Django para uploads directos.
 * Evita pasar por el proxy Next.js en Vercel, que tiene un límite
 * de ~4.5 MB en funciones serverless (FUNCTION_PAYLOAD_TOO_LARGE).
 */
const DJANGO_UPLOAD_ORIGIN =
  process.env.NEXT_PUBLIC_DJANGO_UPLOAD_ORIGIN?.replace(/\/$/, "") ??
  "https://total-living.onrender.com";

export async function uploadTechnicalSheet(
  propertyId: number,
  file: File,
): Promise<TechnicalSheetInfo> {
  // 1. Obtener token de autenticación de la cookie httpOnly
  //    (no accesible desde JS, se lee vía API route liviana).
  const tokenRes = await fetch("/api/upload-token");
  if (!tokenRes.ok) {
    throw new Error(
      `No se pudo autenticar para subir la ficha técnica (${tokenRes.status}).`,
    );
  }
  const { token } = (await tokenRes.json()) as { token: string };

  // 2. Subir directamente al backend Django (Render), evitando
  //    el proxy de Vercel y su límite de 4.5 MB.
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${DJANGO_UPLOAD_ORIGIN}/api/properties/${propertyId}/technical-sheet/`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`No se pudo subir la ficha técnica (${response.status}). ${detail}`);
  }

  const data = (await response.json()) as TechnicalSheetInfo;
  return {
    ...data,
    url: resolveMediaUrl(data.url) ?? data.url,
  };
}




export async function deleteTechnicalSheet(propertyId: number): Promise<void> {
  const response = await fetch(
    `${getApiBaseUrl()}/properties/${propertyId}/technical-sheet/`,
    {
      method: "DELETE",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`No se pudo eliminar la ficha técnica (${response.status}). ${detail}`);
  }
}

export async function syncTechnicalSheet(
  propertyId: number,
  file: File | null,
  shouldDelete: boolean,
): Promise<void> {
  if (shouldDelete) {
    await deleteTechnicalSheet(propertyId);
  }

  if (file) {
    await uploadTechnicalSheet(propertyId, file);
  }
}
