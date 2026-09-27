import axios, { AxiosError } from 'axios';
import { api } from './api-client';

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
 

function normalizeType(rawType: string | undefined): "News" | "Meeting" | "Achievement" | string {
    if (!rawType) return "News";
    const t = rawType.toLowerCase();
    if (t === "general" || t === "news") return "News";
    if (t === "meeting") return "Meeting";
    if (t === "achievement" || t === "award") return "Achievement";
    // preserve unknown types
    return rawType;
}

 
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
    date?: string;
}

class AnnouncementService {
    /**
     * Handle API errors
     */
    private handleError(error: unknown): never {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiError>;
            // Friendly message for timeouts
            let errorMessage = axiosError.response?.data?.message || axiosError.message || 'An unknown error occurred';
            
            if (axiosError.code === 'ECONNABORTED' || (axiosError.message && axiosError.message.toLowerCase().includes('timeout'))) {
                errorMessage = 'Request timed out. The upload may be large or the network slow — try reducing image size or retrying.';
            }

            const statusCode = axiosError.response?.status;
            
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

            // Append image(s) if provided
            if (images) {
                const imgs = Array.isArray(images) ? images : [images];
                imgs.forEach((file) => formData.append('images', file));
            }

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