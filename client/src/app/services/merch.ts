import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface MerchItem {
  _id: string;
  name: string;
  description: string;
  orderLink: string;
  image?: string;
  prices: { category: string; price: number }[];
  isActive: boolean;
}

export interface CreateMerchData {
  name: string;
  description: string;
  orderLink: string;
  prices: { category: string; price: number }[];
  isActive?: boolean;
}

const merchService = {
  getAll: async (): Promise<MerchItem[]> => {
    const response = await axios.get(`${API_URL}/merch`);
    return response.data.data;
  },

  create: async (data: CreateMerchData, image?: File): Promise<MerchItem> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('orderLink', data.orderLink);
    formData.append('prices', JSON.stringify(data.prices));
    if (data.isActive !== undefined) {
      formData.append('isActive', String(data.isActive));
    }
    if (image) {
      formData.append('image', image);
    }

    const response = await axios.post(`${API_URL}/merch`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateMerchData>, image?: File): Promise<MerchItem> => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.orderLink) formData.append('orderLink', data.orderLink);
    if (data.prices) formData.append('prices', JSON.stringify(data.prices));
    if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
    if (image) {
      formData.append('image', image);
    }

    const response = await axios.put(`${API_URL}/merch/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/merch/${id}`);
  },
};

export default merchService;
