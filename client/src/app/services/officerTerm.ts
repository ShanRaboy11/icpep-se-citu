import { api } from './api-client';

export interface OfficerTermData {
    _id?: string;
    name: string;
    position: string;
    role?: string;
    departmentType: 'executive' | 'committee';
    committeeName?: string;
    termYear: string;
    image?: File | string;
    isActive?: boolean;
    displayOrder?: number;
}

const officerTermService = {
    createOfficerTerm: async (data: OfficerTermData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('position', data.position);
        if (data.role) formData.append('role', data.role);
        formData.append('departmentType', data.departmentType);
        if (data.committeeName) formData.append('committeeName', data.committeeName);
        formData.append('termYear', data.termYear);
        if (data.image instanceof File) formData.append('image', data.image);
        if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
        if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

        const response = await api.post('/officer-terms', formData);
        return response.data;
    },

    getOfficerTerms: async (params?: { year?: string; departmentType?: string; committeeName?: string }) => {
        const response = await api.get('/officer-terms', { params });
        return response.data;
    },

    getYears: async () => {
        const response = await api.get('/officer-terms/years');
        return response.data;
    },

    getAllOfficerTerms: async () => {
        const response = await api.get('/officer-terms/admin');
        return response.data;
    },

    updateOfficerTerm: async (id: string, data: Partial<OfficerTermData>) => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.position) formData.append('position', data.position);
        if (data.role !== undefined) formData.append('role', data.role || '');
        if (data.departmentType) formData.append('departmentType', data.departmentType);
        if (data.committeeName !== undefined) formData.append('committeeName', data.committeeName || '');
        if (data.termYear) formData.append('termYear', data.termYear);
        if (data.image instanceof File) formData.append('image', data.image);
        if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
        if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

        const response = await api.put(`/officer-terms/${id}`, formData);
        return response.data;
    },

    deleteOfficerTerm: async (id: string) => {
        const response = await api.delete(`/officer-terms/${id}`);
        return response.data;
    },
};

export default officerTermService;
