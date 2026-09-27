import { api } from './api-client';

export interface FacultyData {
    _id?: string;
    name: string;
    position: string;
    image?: File | string;
    isActive?: boolean;
    displayOrder?: number;
}

const facultyService = {
    createFaculty: async (data: FacultyData) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('position', data.position);
            if (data.image instanceof File) {
                formData.append('image', data.image);
            }
            if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
            if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

            const response = await api.post('/faculty', formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFaculty: async () => {
        try {
            const response = await api.get('/faculty');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllFaculty: async () => {
        try {
            const response = await api.get('/faculty/admin');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateFaculty: async (id: string, data: Partial<FacultyData>) => {
        try {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.position) formData.append('position', data.position);
            if (data.image instanceof File) {
                formData.append('image', data.image);
            }
            if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
            if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

            const response = await api.put(`/faculty/${id}`, formData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteFaculty: async (id: string) => {
        try {
            const response = await api.delete(`/faculty/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default facultyService;
