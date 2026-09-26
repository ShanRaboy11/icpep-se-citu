import { api } from './api-client';

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
    },

    updateSponsor: async (id: string, data: SponsorData) => {
        try {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.type) formData.append('type', data.type);
            if (data.image instanceof File) {
                formData.append('image', data.image);
            }
            if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
            if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

            const response = await api.put(`/sponsors/${id}`, formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteSponsor: async (id: string) => {
        try {
            const response = await api.delete(`/sponsors/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default sponsorService;
