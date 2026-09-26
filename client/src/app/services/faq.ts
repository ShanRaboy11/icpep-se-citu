import { api } from './api-client';

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
