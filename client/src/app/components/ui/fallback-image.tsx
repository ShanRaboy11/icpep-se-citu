"use client";

import { useState, type SyntheticEvent } from "react";
import Image, { type ImageProps } from "next/image";

export const PLACEHOLDER_IMAGE = "/placeholders/placeholder.svg";

const ALLOWED_HOSTS = [
  "res.cloudinary.com",
  "images.unsplash.com",
  "upload.wikimedia.org",
  "i.pravatar.cc",
];

const canRender = (src: string) => {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && ALLOWED_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
};

type FallbackImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallback?: string;
};

export default function FallbackImage({
  src,
  fallback = PLACEHOLDER_IMAGE,
  onError,
  unoptimized,
  ...rest
}: FallbackImageProps) {
  const [failed, setFailed] = useState<string | null>(null);
  const useFallback = !src || failed === src || !canRender(src);
  const resolved = useFallback ? fallback : src;

  return (
    <Image
      {...rest}
      src={resolved}
      unoptimized={unoptimized || resolved.endsWith(".svg")}
      onError={(event) => {
        if (!useFallback) setFailed(src);
        onError?.(event);
      }}
    />
  );
}

export const swapToFallback = (
  event: SyntheticEvent<HTMLImageElement>,
  fallback: string = PLACEHOLDER_IMAGE,
) => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied) return;
  image.dataset.fallbackApplied = "true";
  image.src = fallback;
};
