import { PLACEHOLDER_IMAGE } from "@/app/components/ui/fallback-image";

export const toImageUrl = (url: unknown): string => {
  if (!url || typeof url !== "string") return PLACEHOLDER_IMAGE;
  if (url.startsWith("http")) return url;
  const backendHost = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
  ).replace(/\/+$/, "");
  return url.startsWith("/") ? `${backendHost}${url}` : url;
};
