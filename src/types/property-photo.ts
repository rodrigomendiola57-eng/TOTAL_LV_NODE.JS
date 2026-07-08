export interface PropertyPhoto {
  id: number;
  url: string;
  order: number;
  is_cover: boolean;
  alt_text: string;
  created_at: string;
}

export interface PhotoDraft {
  clientId: string;
  kind: "existing" | "new";
  id?: number;
  file?: File;
  previewUrl: string;
  isCover: boolean;
}

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/heic",
  "image/heif",
  "image/avif",
  "image/svg+xml",
] as const;

export const ACCEPTED_IMAGE_EXTENSIONS =
  ".jpg,.jpeg,.jpe,.png,.webp,.gif,.bmp,.tif,.tiff,.heic,.heif,.avif,.svg";

export const MAX_PHOTO_SIZE_BYTES = 15 * 1024 * 1024;

export function createPhotoDraftFromFile(file: File, isCover = false): PhotoDraft {
  return {
    clientId: crypto.randomUUID(),
    kind: "new",
    file,
    previewUrl: URL.createObjectURL(file),
    isCover,
  };
}

export function createPhotoDraftFromApi(photo: PropertyPhoto): PhotoDraft {
  return {
    clientId: `existing-${photo.id}`,
    kind: "existing",
    id: photo.id,
    previewUrl: photo.url,
    isCover: photo.is_cover,
  };
}

export function revokePhotoDraftUrls(photos: PhotoDraft[]): void {
  for (const photo of photos) {
    if (photo.kind === "new") {
      URL.revokeObjectURL(photo.previewUrl);
    }
  }
}
