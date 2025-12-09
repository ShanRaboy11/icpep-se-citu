import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Partner {
  _id: string;
  name: string;
  logo: string;
  type: 'sponsor' | 'partner';
  description?: string; // Used for Tier (Platinum, Gold, etc.)
  website?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerData {
  name: string;
  type: string;
  description?: string;
  website?: string;
  logo: File;
}

export interface UpdatePartnerData {
  name?: string;
  type?: string;
  description?: string;
  website?: string;
  logo?: File;
  isActive?: boolean;
  displayOrder?: number;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const partnerService = {
  getAll: async (type?: string) => {
    const response = await axios.get<Partner[]>(`${API_URL}/partners`, {
      params: { type },
    });
    return response.data;
  },

  create: async (data: CreatePartnerData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('type', data.type);
    if (data.description) formData.append('description', data.description);
    if (data.website) formData.append('website', data.website);
    formData.append('logo', data.logo);

    const response = await axios.post<Partner>(`${API_URL}/partners`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: UpdatePartnerData) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.type) formData.append('type', data.type);
    if (data.description) formData.append('description', data.description);
    if (data.website) formData.append('website', data.website);
    if (data.logo) formData.append('logo', data.logo);
    if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
    if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

    const response = await axios.put<Partner>(`${API_URL}/partners/${id}`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/partners/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default partnerService;
