import axios, { AxiosError } from 'axios';
import { api } from './api-client';

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
        const axiosErr = err as AxiosError<unknown>;
        const data = axiosErr.response?.data as { message?: string } | undefined;
        throw new Error(data?.message ?? axiosErr.message ?? 'Failed to change password');
      }
      if (err instanceof Error) throw err;
      throw new Error('Failed to change password');
    }
  }
}

const authService = new AuthService();
export default authService;
