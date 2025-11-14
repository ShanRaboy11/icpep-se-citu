import axios, { AxiosError } from 'axios';

// Normalize API base URL: allow providing host (e.g. https://my-backend.render.com)
// or a full URL that already includes `/api`. If the env var is set to a
// hostname without `/api`, append `/api` so requests target the server routes.
const _RAW_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = (() => {
    try {
        let base = String(_RAW_API).replace(/\/+$/, '');
        if (!base.endsWith('/api')) base = `${base}/api`;

        // In browser, warn if the API base appears to point at the same host
        // but the env var wasn't explicitly provided (common misconfiguration).
        if (typeof window !== 'undefined') {
            try {
                const baseHost = new URL(base).host;
                const windowHost = window.location.host;
                if (baseHost === windowHost && !process.env.NEXT_PUBLIC_API_URL) {
                    console.warn(
                        '⚠️ WARNING: API base defaults to same origin. In production set `NEXT_PUBLIC_API_URL` to your backend (including protocol), e.g. https://my-backend.example.com'
                    );
                }
            } catch {
                // ignore URL parsing errors
            }
        }

        return base;
    } catch {
        return 'http://localhost:5000/api';
    }
})();

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
    
    // If sending FormData, allow browser/axios to set the Content-Type (including boundary)
    if (config.data instanceof FormData) {
        if (config.headers && 'Content-Type' in config.headers) {
            const headers = config.headers as Record<string, unknown> | undefined;
            if (headers && Object.prototype.hasOwnProperty.call(headers, 'Content-Type')) {
                delete headers['Content-Type'];
            }
        }
    }

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

// Normalize backend announcement objects to a stable client-facing shape
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ClientAnnouncement {
    id: string;
    title: string;
    description?: string;
    content?: string;
    type: "News" | "Meeting" | "Achievement" | string;
    imageUrl?: string | null;
    date?: string;
    publishDate?: string;
    author?: any;
    [key: string]: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function normalizeType(rawType: string | undefined): "News" | "Meeting" | "Achievement" | string {
    if (!rawType) return "News";
    const t = rawType.toLowerCase();
    if (t === "general" || t === "news") return "News";
    if (t === "meeting") return "Meeting";
    if (t === "achievement" || t === "award") return "Achievement";
    // preserve unknown types
    return rawType;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAnnouncement(raw: any): ClientAnnouncement {
    const id = raw._id ?? raw.id ?? String((raw.id ?? raw._id) ?? "");
    const title = raw.title ?? raw.name ?? "Untitled";
    const description = raw.description ?? raw.summary ?? raw.excerpt ?? "";
    const content = raw.content ?? raw.body ?? "";
    const type = normalizeType(raw.type ?? raw.category ?? raw.tag);
    const imageUrl = raw.imageUrl ?? raw.image ?? raw.image_url ?? null;
    // Prefer explicit publishDate for when it was posted; keep user's provided `date` separate.
    const publishDate = raw.publishDate ?? raw.publish_date ?? raw.createdAt ?? raw.created_at ?? undefined;
    const date = raw.date ?? raw.dateString ?? publishDate;

    return {
        id,
        title,
        description,
        content,
        type,
        imageUrl,
        publishDate,
        date,
        author: raw.author,
        ...raw,
    } as ClientAnnouncement;
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
    date?: string;
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
    async createAnnouncement(data: AnnouncementData, images?: File[] | File): Promise<AnnouncementResponse> {
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
            if (data.date) formData.append('date', data.date);
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

            // Append image(s) if provided
            if (images) {
                const imgs = Array.isArray(images) ? images : [images];
                console.log(`📷 Appending ${imgs.length} image(s)`);
                imgs.forEach((file) => formData.append('images', file));
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

            const response = await api.post('/announcements', formData);

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
            const payload: AnnouncementResponse = response.data;

            // Normalize data shape if present
            if (payload && payload.data) {
                if (Array.isArray(payload.data)) {
                    payload.data = payload.data.map((item) => normalizeAnnouncement(item));
                } else if (typeof payload.data === 'object' && payload.data !== null) {
                    payload.data = normalizeAnnouncement(payload.data as Record<string, unknown>);
                }
            }

            return payload;
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
            const payload: AnnouncementResponse = response.data;
            if (payload && payload.data && typeof payload.data === 'object') {
                payload.data = normalizeAnnouncement(payload.data as Record<string, unknown>);
            }
            return payload;
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
        images?: File[] | File
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

            if (images) {
                const imgs = Array.isArray(images) ? images : [images];
                imgs.forEach((file) => formData.append('images', file));
            }

            const response = await api.patch(`/announcements/${id}`, formData);

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

const announcementServiceInstance = new AnnouncementService();
export default announcementServiceInstance;