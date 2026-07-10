import axios, { AxiosError } from "axios";

const _RAW_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = (() => {
  try {
    let base = String(_RAW_API).replace(/\/+$/, "");
    if (!base.endsWith("/api")) base = `${base}/api`;
    return base;
  } catch {
    return "http://localhost:5000/api";
  }
})();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// request interceptor: attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// response interceptor: handle expired tokens & logging
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const responseData = error.response?.data as any;

    // handle invalid/expired token (401 or 403)
    if (status === 401 || status === 403) {
      const isTokenError = responseData?.message
        ?.toLowerCase()
        .includes("token");

      if (isTokenError && typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
      }
    }

    const errorDetails = {
      status: status,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      data: responseData,
    };

    // fix: do not log console error for auth failures (401/403) to prevent console spam
    if (error.code !== "ERR_CANCELED" && status !== 401 && status !== 403) {
      console.error("❌ API Error:", JSON.stringify(errorDetails, null, 2));
    }

    return Promise.reject(error);
  },
);

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
