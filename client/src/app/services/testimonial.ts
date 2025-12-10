import axios, { AxiosError } from 'axios';

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

export interface TestimonialData {
    name: string;
    role: string;
    quote: string;
    image?: File;
    year?: string;
    isActive?: boolean;
    displayOrder?: number;
}

const testimonialService = {
    createTestimonial: async (data: TestimonialData) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('role', data.role);
            formData.append('quote', data.quote);
            if (data.image) {
                formData.append('image', data.image);
            }
            if (data.year) formData.append('year', data.year);
            if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
            if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

            const response = await api.post('/testimonials', formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    getTestimonials: async () => {
        try {
            const response = await api.get('/testimonials');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllTestimonials: async () => {
        try {
            const response = await api.get('/testimonials/admin');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default testimonialService;
