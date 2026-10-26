import { DEFAULT_CONTACT } from "./site";

const API_URL = (() => {
  const base = String(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
})();

export const fetchSiteContact = async () => {
  try {
    const response = await fetch(`${API_URL}/site/settings`, { next: { revalidate: 300 } });
    const body = await response.json();
    return { ...DEFAULT_CONTACT, ...(body?.data ?? {}) } as typeof DEFAULT_CONTACT;
  } catch {
    return DEFAULT_CONTACT;
  }
};
