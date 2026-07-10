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

export async function uploadTechnicalSheet(
  propertyId: number,
  file: File,
): Promise<TechnicalSheetInfo> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${getApiBaseUrl()}/properties/${propertyId}/technical-sheet/`,
    {
      method: "POST",
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
