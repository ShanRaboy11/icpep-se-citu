import { api } from './api-client';
import type { ApiList, AdvisorRecord } from './types';

export interface AdvisorData {
    _id?: string;
    faculty?: string | null;
    name?: string;
    position: string;
    yearRange: string;
    isCurrent?: boolean;
    isActive?: boolean;
    displayOrder?: number;
}

const advisorService = {
    createAdvisor: async (data: AdvisorData) => {
        const response = await api.post('/advisors', data);
        return response.data;
    },

    getAdvisors: async (current?: boolean) => {
        try {
            const response = await api.get<ApiList<AdvisorRecord>>('/advisors', {
                params: current ? { current: true } : undefined,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllAdvisors: async () => {
        try {
            const response = await api.get('/advisors/admin');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateAdvisor: async (id: string, data: Partial<AdvisorData>) => {
        const response = await api.put(`/advisors/${id}`, data);
        return response.data;
    },

    deleteAdvisor: async (id: string) => {
        try {
            const response = await api.delete(`/advisors/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default advisorService;
