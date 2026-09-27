import axios, { AxiosError } from "axios";
import { api } from "./api-client";

export interface NotificationResponse {
  success: boolean;
  data: any[];
  pagination: any;
  unreadCount: number;
}

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;

    if (
      axiosError.response?.status === 403 ||
      axiosError.response?.status === 401
    ) {
      throw new Error("expired_session");
    }

    // fixed eslint warning: used const instead of let
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An unknown error occurred";

    throw new Error(errorMessage);
  }

  if (error instanceof Error) throw error;
  throw new Error("An unknown error occurred");
};

export const notificationService = {
  getAll: async (page = 1, limit = 20) => {
    try {
      const response = await api.get<NotificationResponse>("/notifications", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put("/notifications/read-all");
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};
