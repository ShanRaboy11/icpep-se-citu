import { api } from "./api-client";

export interface SiteSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
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
};

export default siteService;
