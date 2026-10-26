"use client";

import siteService from "@/app/services/site";
import { useCachedFetch } from "./use-cached-fetch";
import { DEFAULT_CONTACT } from "../utils/site";

export function useSiteContact() {
  const { data } = useCachedFetch("site-settings", () => siteService.getSettings());
  return {
    contactEmail: data?.contactEmail || DEFAULT_CONTACT.contactEmail,
    secondaryEmail: data?.secondaryEmail || "",
    socialLinks: data?.socialLinks ?? DEFAULT_CONTACT.socialLinks,
  };
}
