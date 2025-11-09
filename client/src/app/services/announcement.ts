import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface AnnouncementResponse {
    success: boolean;
    message?: string;
    data?: unknown;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface AnnouncementData {
    title: string;
    description: string;
    content: string;
    type: 'Event' | 'Award' | 'Workshop' | 'Meeting' | 'Seminar' | 'Achievement' | 'General';
    priority?: 'normal' | 'important' | 'urgent';
    targetAudience?: string[];
    isPublished?: boolean;
    publishDate?: string;
    expiryDate?: string;
    time?: string;
    location?: string;
    organizer?: string;
    contact?: string;
    attendees?: string;
    agenda?: string[];
    awardees?: Array<{
        name: string;
        program?: string;
        year: string;
        award: string;
    }>;
    attachments?: Array<{
        name: string;
        url: string;
        fileType?: string;
    }>;
}

class AnnouncementService {
    /**
     * Create a new announcement
     */
    async createAnnouncement(data: AnnouncementData, imageFile?: File): Promise<AnnouncementResponse> {
        try {
            const formData = new FormData();

            // Append all fields
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value) || typeof value === 'object') {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            // Append image if provided
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await api.post('/announcements', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unknown error occurred');
        }
    }

    /**
     * Get all announcements with filters
     */
    async getAnnouncements(params?: {
        type?: string;
        isPublished?: boolean;
        targetAudience?: string;
        priority?: string;
        page?: number;
        limit?: number;
        sort?: string;
    }): Promise<AnnouncementResponse> {
        try {
            const response = await api.get('/announcements', { params });
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unknown error occurred');
        }
    }

    /**
     * Get single announcement by ID
     */
    async getAnnouncementById(id: string): Promise<AnnouncementResponse> {
        try {
            const response = await api.get(`/announcements/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unknown error occurred');
        }
    }

    /**
     * Update an announcement
     */
    async updateAnnouncement(
        id: string,
        data: Partial<AnnouncementData>,
        imageFile?: File
    ): Promise<AnnouncementResponse> {
        try {
            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value) || typeof value === 'object') {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await api.patch(`/announcements/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unknown error occurred');
        }
    }

    /**
     * Delete an announcement
     */
    async deleteAnnouncement(id: string): Promise<AnnouncementResponse> {
        try {
            const response = await api.delete(`/announcements/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unknown error occurred');
        }
    }

    /**
     * Toggle publish status
     */
    async togglePublishStatus(id: string): Promise<AnnouncementResponse> {
        try {
            const response = await api.patch(`/announcements/${id}/publish`);
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unknown error occurred');
        }
    }

    /**
     * Get announcements by type
     */
    async getAnnouncementsByType(
        type: string,
        params?: { page?: number; limit?: number }
    ): Promise<AnnouncementResponse> {
        try {
            const response = await api.get(`/announcements/type/${type}`, { params });
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unknown error occurred');
        }
    }

    /**
     * Get user's own announcements
     */
    async getMyAnnouncements(params?: {
        page?: number;
        limit?: number;
        status?: 'published' | 'draft';
    }): Promise<AnnouncementResponse> {
        try {
            const response = await api.get('/announcements/my/announcements', { params });
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unknown error occurred');
        }
    }
}

export default new AnnouncementService();