import { PLACEHOLDER_IMAGE } from "@/app/components/fallback-image";

export const DEFAULT_JOIN_PHOTOS = [PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE];

export const DEFAULT_ABOUT_PHOTOS = [PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE];

export const resolvePhotos = (custom: string[] | undefined, defaults: string[]) =>
  defaults.map((placeholder, i) => {
    const url = custom?.[i];
    return url && url.startsWith("https://res.cloudinary.com/") ? url : placeholder;
  });
