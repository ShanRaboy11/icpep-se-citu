import type { MetadataRoute } from "next";
import { SITE_URL } from "./utils/site";

// Logged-in-only tooling: real content, no reason for a crawler to index it.
const DISALLOWED = [
  "/dashboard",
  "/dashboard/*",
  "/users",
  "/create",
  "/create/*",
  "/commeet",
  "/commeet/*",
  "/profile",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: DISALLOWED,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
