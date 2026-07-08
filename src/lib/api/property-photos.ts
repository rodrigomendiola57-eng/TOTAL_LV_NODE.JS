import type { PhotoDraft, PropertyPhoto } from "@/types/property-photo";
import { staticExportFetchInit } from "@/lib/static-export";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export async function getPropertyPhotos(propertyId: number): Promise<PropertyPhoto[]> {
  try {
    const response = await fetch(
      `${API_URL}/properties/${propertyId}/photos/`,
      staticExportFetchInit({
        method: "GET",
        headers: { Accept: "application/json" },
      }),
    );

    if (!response.ok) {
      if (process.env.GITHUB_PAGES === "true") return [];
      throw new Error(`No se pudieron cargar las fotos (${response.status}).`);
    }

    return (await response.json()) as PropertyPhoto[];
  } catch {
    if (process.env.GITHUB_PAGES === "true") return [];
    throw new Error("No se pudieron cargar las fotos.");
  }
}

export async function uploadPropertyPhotos(
  propertyId: number,
  files: File[],
): Promise<PropertyPhoto[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }

  const response = await fetch(`${API_URL}/properties/${propertyId}/photos/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`No se pudieron subir las fotos (${response.status}). ${detail}`);
  }

  const data = (await response.json()) as { created: PropertyPhoto[] };
  return data.created ?? [];
}

export async function deletePropertyPhoto(
  propertyId: number,
  photoId: number,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/properties/${propertyId}/photos/${photoId}/`,
    {
      method: "DELETE",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`No se pudo eliminar la foto (${response.status}). ${detail}`);
  }
}

export async function reorderPropertyPhotos(
  propertyId: number,
  photos: Array<{ id: number; order: number }>,
  coverId: number | null,
): Promise<PropertyPhoto[]> {
  const response = await fetch(
    `${API_URL}/properties/${propertyId}/photos/reorder/`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        photos,
        cover_id: coverId,
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`No se pudo reordenar las fotos (${response.status}). ${detail}`);
  }

  return (await response.json()) as PropertyPhoto[];
}

export async function syncPropertyPhotos(
  propertyId: number,
  photos: PhotoDraft[],
  deletedPhotoIds: number[],
): Promise<void> {
  for (const photoId of deletedPhotoIds) {
    await deletePropertyPhoto(propertyId, photoId);
  }

  const newPhotos = photos.filter((photo) => photo.kind === "new" && photo.file);
  const uploadedByClientId = new Map<string, number>();

  if (newPhotos.length > 0) {
    const uploaded = await uploadPropertyPhotos(
      propertyId,
      newPhotos.map((photo) => photo.file as File),
    );

    newPhotos.forEach((photo, index) => {
      const uploadedPhoto = uploaded[index];
      if (uploadedPhoto) {
        uploadedByClientId.set(photo.clientId, uploadedPhoto.id);
      }
    });
  }

  const coverDraft = photos.find((photo) => photo.isCover) ?? photos[0];
  const coverId = coverDraft
    ? coverDraft.kind === "existing"
      ? coverDraft.id ?? null
      : uploadedByClientId.get(coverDraft.clientId) ?? null
    : null;

  const orderPayload = photos
    .map((photo, index) => {
      const id =
        photo.kind === "existing"
          ? photo.id
          : uploadedByClientId.get(photo.clientId);
      if (!id) return null;
      return { id, order: index };
    })
    .filter((item): item is { id: number; order: number } => item !== null);

  if (orderPayload.length > 0) {
    await reorderPropertyPhotos(propertyId, orderPayload, coverId);
  }
}
