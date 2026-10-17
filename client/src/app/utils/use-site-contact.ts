"use client";

import siteService from "@/app/services/site";
import { useCachedFetch } from "./cached-fetch";
import { DEFAULT_CONTACT } from "./site";

export function useSiteContact() {
  const { data } = useCachedFetch("site-settings", () => siteService.getSettings());
  return {
    contactEmail: data?.contactEmail || DEFAULT_CONTACT.contactEmail,
    secondaryEmail: data?.secondaryEmail || "",
    facebookUrl: data?.facebookUrl || DEFAULT_CONTACT.facebookUrl,
    tiktokUrl: data?.tiktokUrl || DEFAULT_CONTACT.tiktokUrl,
    instagramUrl: data?.instagramUrl || "",
    xUrl: data?.xUrl || "",
    youtubeUrl: data?.youtubeUrl || "",
    linkedinUrl: data?.linkedinUrl || "",
  };
}
