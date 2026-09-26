import { api } from './api-client';

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
    },
    
    getTestimonials: async () => {
        const response = await api.get('/testimonials');
        return response.data;
    },

    getAllTestimonials: async () => {
        const response = await api.get('/testimonials/admin');
        return response.data;
    },

    updateTestimonial: async (id: string, data: Partial<TestimonialData>) => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.role) formData.append('role', data.role);
        if (data.quote) formData.append('quote', data.quote);
        if (data.image) formData.append('image', data.image);
        if (data.year) formData.append('year', data.year);
        if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
        if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

        const response = await api.put(`/testimonials/${id}`, formData);
        return response.data;
    },

    deleteTestimonial: async (id: string) => {
        const response = await api.delete(`/testimonials/${id}`);
        return response.data;
    }
};

export default testimonialService;
