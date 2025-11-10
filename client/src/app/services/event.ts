import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
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
            message: error.message,
            data: error.response?.data,
        });
        return Promise.reject(error);
    }
);

export interface ApiError {
    message: string;
    errors?: string[];
}

export interface EventResponse {
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

export interface EventData {
    title: string;
    description: string;
    content: string;
    tags?: string[];
    priority?: 'normal' | 'important' | 'urgent';
    targetAudience?: string[];
    isPublished?: boolean;
    publishDate?: string;
    expiryDate?: string;
    eventDate: string;
    time?: string;
    location?: string;
    organizer?: string;
    contact?: string;
    rsvpLink?: string;
    admissions?: Array<{
        category: string;
        price: string;
    }>;
    registrationRequired?: boolean;
    registrationStart?: string;
    registrationEnd?: string;
}

class EventService {
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
     * Create a new event
     */
    async createEvent(data: EventData, coverImage?: File): Promise<EventResponse> {
        try {
            console.log('📤 Creating event with data:', data);
            
            const formData = new FormData();

            // Append simple fields directly
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('content', data.content);
            formData.append('eventDate', data.eventDate);
            formData.append('isPublished', String(data.isPublished));
            
            // Optional simple fields
            if (data.priority) formData.append('priority', data.priority);
            if (data.publishDate) formData.append('publishDate', data.publishDate);
            if (data.expiryDate) formData.append('expiryDate', data.expiryDate);
            if (data.time) formData.append('time', data.time);
            if (data.location) formData.append('location', data.location);
            if (data.organizer) formData.append('organizer', data.organizer);
            if (data.contact) formData.append('contact', data.contact);
            if (data.rsvpLink) formData.append('rsvpLink', data.rsvpLink);
            if (data.registrationRequired !== undefined) {
                formData.append('registrationRequired', String(data.registrationRequired));
            }
            if (data.registrationStart) formData.append('registrationStart', data.registrationStart);
            if (data.registrationEnd) formData.append('registrationEnd', data.registrationEnd);

            // Complex fields - stringify arrays/objects
            if (data.tags) {
                formData.append('tags', JSON.stringify(data.tags));
            }
            if (data.targetAudience) {
                formData.append('targetAudience', JSON.stringify(data.targetAudience));
            }
            if (data.admissions) {
                formData.append('admissions', JSON.stringify(data.admissions));
            }

            // Append cover image if provided
            if (coverImage) {
                console.log('📷 Appending cover image:', coverImage.name);
                formData.append('coverImage', coverImage);
            }

            const response = await api.post('/events', formData, {
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
     * Get all events with filters
     */
    async getEvents(params?: {
        tags?: string;
        isPublished?: boolean;
        targetAudience?: string;
        priority?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
        sort?: string;
    }): Promise<EventResponse> {
        try {
            const response = await api.get('/events', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get single event by ID
     */
    async getEventById(id: string): Promise<EventResponse> {
        try {
            const response = await api.get(`/events/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Update an event
     */
    async updateEvent(
        id: string,
        data: Partial<EventData>,
        coverImage?: File
    ): Promise<EventResponse> {
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

            if (coverImage) {
                formData.append('coverImage', coverImage);
            }

            const response = await api.patch(`/events/${id}`, formData, {
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
     * Delete an event
     */
    async deleteEvent(id: string): Promise<EventResponse> {
        try {
            const response = await api.delete(`/events/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Toggle publish status
     */
    async togglePublishStatus(id: string): Promise<EventResponse> {
        try {
            const response = await api.patch(`/events/${id}/publish`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get events by tag
     */
    async getEventsByTag(
        tag: string,
        params?: { page?: number; limit?: number }
    ): Promise<EventResponse> {
        try {
            const response = await api.get(`/events/tag/${tag}`, { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Get user's own events
     */
    async getMyEvents(params?: {
        page?: number;
        limit?: number;
        status?: 'published' | 'draft';
    }): Promise<EventResponse> {
        try {
            const response = await api.get('/events/my/events', { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }
}

const eventServiceInstance = new EventService();
export default eventServiceInstance;