import axios, { AxiosError } from 'axios';

// Reuse the same API normalization pattern used elsewhere in services
const _RAW_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = (() => {
  try {
    let base = String(_RAW_API).replace(/\/+$/, '');
    if (!base.endsWith('/api')) base = `${base}/api`;
    return base;
  } catch {
    return 'http://localhost:5000/api';
  }
})();

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    const headers = config.headers as Record<string, unknown> | undefined;
    if (headers && Object.prototype.hasOwnProperty.call(headers, 'Content-Type')) {
      delete headers['Content-Type'];
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => Promise.reject(error)
);

export interface CurrentUser {
  id: string;
  firstName?: string;
  lastName?: string;
  studentNumber?: string;
  email?: string;
  yearLevel?: string | number;
  role?: string;
  councilRole?: string;
  committeeRole?: string;
  membership?: 'both' | 'local' | 'regional' | string;
  avatar?: string;
}

class UserService {
  async getCurrentUser(): Promise<{ success: boolean; data?: CurrentUser; message?: string }> {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(id: string, payload: Partial<CurrentUser> & { password?: string }): Promise<{ success: boolean; data?: CurrentUser; message?: string }> {
    try {
      const res = await api.put(`/users/${id}`, payload);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async listUsers(params?: { role?: string; isActive?: boolean; page?: number; limit?: number }): Promise<CurrentUser[]> {
    try {
      const search = new URLSearchParams();
      if (params?.role) search.set('role', params.role);
      if (typeof params?.isActive === 'boolean') search.set('isActive', String(params.isActive));
      if (params?.page) search.set('page', String(params.page));
      if (params?.limit) search.set('limit', String(params.limit));
      const res = await api.get(`/users${search.toString() ? `?${search.toString()}` : ''}`);
      const payload = res.data as { success: boolean; data: any[] };
      return (payload.data || []).map((u) => ({
        id: u._id,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        email: u.email,
        yearLevel: u.yearLevel,
        studentNumber: u.studentNumber,
      }));
    } catch (err) {
      throw err;
    }
  }
}

const userService = new UserService();
export default userService;
