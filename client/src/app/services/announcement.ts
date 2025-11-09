import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    // The app stores auth token under 'authToken' (see login page)
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🔵 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        hasAuth: !!token,
        contentType: config.headers['Content-Type'],
    });
    
    return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
        });
        return response;
    },
    (error: AxiosError) => {
        console.error('❌ API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
            message: error.message,
            data: error.response?.data,
            code: error.code,
        });
        return Promise.reject(error);
    }
);

export interface ApiError {
    message: string;
    errors?: string[];
}

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
     * Handle API errors
     */
    private handleError(error: unknown): never {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiError>;
            const errorMessage = axiosError.response?.data?.message || error.message;
            const statusCode = axiosError.response?.status;
            
            console.error('Service Error Details:', {
                status: statusCode,
                message: errorMessage,
                url: axiosError.config?.url,
                method: axiosError.config?.method,
                code: axiosError.code,
            });
            
            throw new Error(`${statusCode ? `[${statusCode}] ` : ''}${errorMessage}`);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unknown error occurred');
    }

    /**
     * Create a new announcement
     */
    async createAnnouncement(data: AnnouncementData, imageFile?: File): Promise<AnnouncementResponse> {
        try {
            console.log('📤 Creating announcement with data:', data);
            
            const formData = new FormData();

            // Append simple fields directly (don't stringify)
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('content', data.content);
            formData.append('type', data.type);
            formData.append('isPublished', String(data.isPublished));
            
            // Optional simple fields
            if (data.priority) formData.append('priority', data.priority);
            if (data.publishDate) formData.append('publishDate', data.publishDate);
            if (data.expiryDate) formData.append('expiryDate', data.expiryDate);
            if (data.time) formData.append('time', data.time);
            if (data.location) formData.append('location', data.location);
            if (data.organizer) formData.append('organizer', data.organizer);
            if (data.contact) formData.append('contact', data.contact);
            if (data.attendees) formData.append('attendees', data.attendees);

            // Complex fields - stringify arrays/objects
            if (data.targetAudience) {
                formData.append('targetAudience', JSON.stringify(data.targetAudience));
            }
            if (data.agenda) {
                formData.append('agenda', JSON.stringify(data.agenda));
            }
            if (data.awardees) {
                formData.append('awardees', JSON.stringify(data.awardees));
            }
            if (data.attachments) {
                formData.append('attachments', JSON.stringify(data.attachments));
            }

            // Append image if provided
            if (imageFile) {
                console.log('📷 Appending image file:', imageFile.name);
                formData.append('image', imageFile);
            }

            // Log FormData contents for debugging
            console.log('📋 FormData contents:');
            formData.forEach((value, key) => {
                if (value instanceof File) {
                    console.log(`  ${key}:`, `File(${value.name}, ${value.size} bytes)`);
                } else {
                    const displayValue = String(value).substring(0, 50);
                    console.log(`  ${key}:`, displayValue + (String(value).length > 50 ? '...' : ''));
                }
            });

            const response = await api.post('/announcements', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            this.handleError(error);
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
            this.handleError(error);
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
            this.handleError(error);
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

            // Append only provided fields
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
            this.handleError(error);
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
            this.handleError(error);
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
            this.handleError(error);
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
            this.handleError(error);
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
            this.handleError(error);
        }
    }
}

export default new AnnouncementService();