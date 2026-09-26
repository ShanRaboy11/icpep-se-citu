import type { MetadataRoute } from "next";
import { SITE_URL } from "./utils/site";
import { departments } from "./officers/utils/officers";

const API_URL = (() => {
  const base = String(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
})();

// Public marketing pages that always exist, regardless of what's in the
// database. Auth-gated tooling (dashboard, users, create, commeet, profile)
// is intentionally left out — see robots.ts.
const STATIC_ROUTES: Array<{ path: string; priority: number }> = [
  { path: "/home", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/events", priority: 0.8 },
  { path: "/officers", priority: 0.7 },
  { path: "/announcements", priority: 0.7 },
  { path: "/merch", priority: 0.5 },
  { path: "/membership", priority: 0.6 },
  { path: "/contact", priority: 0.5 },
];

// Best-effort: the sitemap should still build (with just the static routes)
// if the API is unreachable, e.g. during a build with no backend running.
async function fetchIds(path: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items = Array.isArray(json?.data) ? json.data : [];
    return items.map((item: { _id?: string }) => item._id).filter(Boolean) as string[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [eventIds, announcementIds] = await Promise.all([
    fetchIds("/events?isPublished=true&limit=200"),
    fetchIds("/announcements?isPublished=true&limit=200"),
  ]);

  const now = new Date();

  return [
    ...STATIC_ROUTES.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      priority,
    })),
    ...Object.keys(departments).map((slug) => ({
      url: `${SITE_URL}/officers/${slug}`,
      lastModified: now,
      priority: 0.5,
    })),
    ...eventIds.map((id) => ({
      url: `${SITE_URL}/events/${id}`,
      lastModified: now,
      priority: 0.6,
    })),
    ...announcementIds.map((id) => ({
      url: `${SITE_URL}/announcements/${id}`,
      lastModified: now,
      priority: 0.6,
    })),
  ];
}
