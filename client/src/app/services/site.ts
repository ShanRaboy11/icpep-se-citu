import { api } from "./api-client";
import type { SocialLink } from "@/app/utils/site";

export interface SiteSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  primerUrl?: string;
  contactEmail?: string;
  secondaryEmail?: string;
  socialLinks?: SocialLink[];
  joinPhotos?: string[];
  aboutPhotos?: string[];
}

export type PhotoSection = "join" | "about";

export interface ContactDetails {
  contactEmail: string;
  secondaryEmail: string;
  socialLinks: SocialLink[];
}

const siteService = {
  getSettings: async (): Promise<SiteSettings> => {
    const response = await api.get<{ success: boolean; data: SiteSettings }>(
      "/site/settings",
    );
    return response.data.data;
  },

  updateSettings: async (data: Partial<SiteSettings>) => {
    const response = await api.put<{ success: boolean; data: SiteSettings }>(
      "/site/settings",
      data,
    );
    return response.data.data;
  },

  updateContact: async (values: ContactDetails) => {
    const response = await api.put<{ success: boolean; data: ContactDetails }>(
      "/site/contact",
      values,
    );
    return response.data.data;
  },

  updatePrimer: async (input: { file?: File; url?: string; clear?: boolean }) => {
    const form = new FormData();
    if (input.file) form.append("file", input.file);
    if (input.url) form.append("url", input.url);
    if (input.clear) form.append("clear", "true");
    const response = await api.put<{ success: boolean; data: { primerUrl: string } }>(
      "/site/primer",
      form,
    );
    return response.data.data.primerUrl;
  },

  setPhoto: async (section: PhotoSection, slot: number, file: File) => {
    const form = new FormData();
    form.append("image", file);
    const response = await api.put<{ success: boolean; data: { photos: string[] } }>(
      `/site/photos/${section}/${slot}`,
      form,
    );
    return response.data.data.photos;
  },

  clearPhoto: async (section: PhotoSection, slot: number) => {
    const response = await api.delete<{ success: boolean; data: { photos: string[] } }>(
      `/site/photos/${section}/${slot}`,
    );
    return response.data.data.photos;
  },
};

export default siteService;
