import axios from 'axios';

const _RAW_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = (() => {
    try {
        let base = String(_RAW_API).replace(/\/+$/, '');
        if (!base.endsWith('/api')) base = `${base}/api`;
        return base;
    } catch {
        return 'http://localhost:5000/api';
    }
})();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        if (config.headers && 'Content-Type' in config.headers) {
            const headers = config.headers as Record<string, unknown> | undefined;
            if (headers && Object.prototype.hasOwnProperty.call(headers, 'Content-Type')) {
                delete headers['Content-Type'];
            }
        }
    }
    return config;
});

export interface SponsorData {
    _id?: string;
    name: string;
    type: string;
    image?: File | string;
    isActive?: boolean;
    displayOrder?: number;
}

const sponsorService = {
    createSponsor: async (data: SponsorData) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('type', data.type);
            if (data.image instanceof File) {
                formData.append('image', data.image);
            }
            if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
            if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

            const response = await api.post('/sponsors', formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    getSponsors: async () => {
        try {
            const response = await api.get('/sponsors');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllSponsors: async () => {
        try {
            const response = await api.get('/sponsors/admin');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default sponsorService;
