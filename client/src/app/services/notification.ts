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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Safe error logging
    const errorDetails = {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      data: error.response?.data,
    };
    
    // Log only if it's not a cancelled request
    if (error.code !== "ERR_CANCELED") {
      console.error("❌ API Error:", JSON.stringify(errorDetails, null, 2));
    }
    
    return Promise.reject(error);
  }
);

export interface Notification {
  _id: string;
  recipient: string;
  type: "announcement" | "event" | "membership" | "system" | "rsvp";
  title: string;
  message: string;
  relatedId?: string;
  relatedModel?: "Announcement" | "Event" | "Membership" | null;
  isRead: boolean;
  readAt?: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    // Friendly message for timeouts
    let errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An unknown error occurred";

    if (
      axiosError.code === "ECONNABORTED" ||
      (axiosError.message &&
        axiosError.message.toLowerCase().includes("timeout"))
    ) {
      errorMessage =
        "Request timed out. The network may be slow — please try again.";
    }

    const statusCode = axiosError.response?.status;

    throw new Error(`${statusCode ? `[${statusCode}] ` : ""}${errorMessage}`);
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error("An unknown error occurred");
};

export const notificationService = {
  getAll: async (page = 1, limit = 20, filter = "all") => {
    try {
      const response = await api.get<NotificationResponse>("/notifications", {
        params: { page, limit, filter },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put("/notifications/read-all");
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};
