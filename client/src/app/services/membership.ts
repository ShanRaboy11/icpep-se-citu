import { api } from "./api-client";

export interface MembershipTierData {
  _id?: string;
  planLabel: string;
  title: string;
  price: string;
  description: string;
  benefits: string[];
  accentColor: "primary" | "steel" | "sky";
  isHighlighted?: boolean;
  isActive?: boolean;
  displayOrder?: number;
}

export interface MembershipSettingsData {
  isOpen: boolean;
  registrationUrl: string;
}

const membershipService = {
  // Tiers
  getTiers: async () => {
    const response = await api.get("/membership/tiers");
    return response.data;
  },
  getAllTiers: async () => {
    const response = await api.get("/membership/tiers/admin");
    return response.data;
  },
  createTier: async (data: MembershipTierData) => {
    const response = await api.post("/membership/tiers", data);
    return response.data;
  },
  updateTier: async (id: string, data: Partial<MembershipTierData>) => {
    const response = await api.put(`/membership/tiers/${id}`, data);
    return response.data;
  },
  deleteTier: async (id: string) => {
    const response = await api.delete(`/membership/tiers/${id}`);
    return response.data;
  },

  // Settings (singleton)
  getSettings: async () => {
    const response = await api.get("/membership/settings");
    return response.data;
  },
  updateSettings: async (data: Partial<MembershipSettingsData>) => {
    const response = await api.put("/membership/settings", data);
    return response.data;
  },
};

export default membershipService;
