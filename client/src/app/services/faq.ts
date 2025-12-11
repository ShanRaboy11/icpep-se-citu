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
    return config;
});

export interface FAQData {
    _id?: string;
    question: string;
    answer: string;
    category?: string;
    isActive?: boolean;
    displayOrder?: number;
}

const faqService = {
    createFAQ: async (data: FAQData) => {
        try {
            const response = await api.post('/faqs', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    getFAQs: async () => {
        try {
            const response = await api.get('/faqs');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllFAQs: async () => {
        try {
            const response = await api.get('/faqs/admin');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateFAQ: async (id: string, data: FAQData) => {
        try {
            const response = await api.put(`/faqs/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteFAQ: async (id: string) => {
        try {
            const response = await api.delete(`/faqs/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default faqService;
