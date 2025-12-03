import axios, { AxiosError } from 'axios';

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
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

class AuthService {
  async changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordResponse> {
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<any>;
        throw new Error(axiosErr.response?.data?.message || axiosErr.message || 'Failed to change password');
      }
      throw err as Error;
    }
  }
}

const authService = new AuthService();
export default authService;
