import axios, { AxiosError } from "axios";
import { reportApiError } from "../utils/api-error";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API_URL = (() => {
  const base = String(rawApiUrl).replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
})();

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Let the browser set Content-Type (with its multipart boundary) for FormData.
  if (config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;

    // 4xx answers are the caller's to handle; an unreachable or failing server isn't.
    if (!error.response && error.code !== "ERR_CANCELED") {
      reportApiError("Can't reach the server. Please check your connection and try again.");
    } else if (status && status >= 500) {
      reportApiError("Something went wrong on our end. Please try again.");
    }

    const isTokenError = error.response?.data?.message
      ?.toLowerCase()
      .includes("token");

    if (
      (status === 401 || status === 403) &&
      isTokenError &&
      typeof window !== "undefined"
    ) {
      ["authToken", "userRole", "userName", "userId"].forEach((key) =>
        localStorage.removeItem(key),
      );
    }

    return Promise.reject(error);
  },
);

// The server's own message for a failed request, or the fallback.
export const errorMessage = (error: unknown, fallback: string): string =>
  (axios.isAxiosError<{ message?: string }>(error) && error.response?.data?.message) ||
  fallback;
