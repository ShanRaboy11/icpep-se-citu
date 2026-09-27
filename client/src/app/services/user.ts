import { api } from './api-client';

export interface CurrentUser {
  id: string;
  firstName?: string;
  lastName?: string;
  studentNumber?: string;
  email?: string;
  yearLevel?: string | number;
  role?: string;
  position?: string;
  department?: string;
  membership?: 'both' | 'local' | 'regional' | string;
  avatar?: string;
  profilePicture?: string;
  councilPosition?: string;
  committeeDepartment?: string;
  committeeTitle?: string;
  membershipStatus?: {
    isMember: boolean;
    membershipType: 'local' | 'regional' | 'both' | null;
    validUntil?: string;
  };
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
        councilPosition: u.councilPosition,
        committeeTitle: u.committeeTitle,
        committeeDepartment: u.committeeDepartment,
        department: u.department,
      }));
    } catch (err) {
      throw err;
    }
  }

  async getStats(): Promise<{
    success: boolean;
    data?: {
      total: number;
      active: number;
      inactive: number;
      members: number;
      nonMembers: number;
    };
  }> {
    try {
      const res = await api.get('/users/stats');
      return res.data;
    } catch (err) {
      throw err;
    }
  }
}

const userService = new UserService();
export default userService;
