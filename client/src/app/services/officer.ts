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
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => Promise.reject(error)
);

export interface Officer {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: "council-officer" | "committee-officer";
  position?: string;
  department?: string;
  yearLevel?: number;
  profilePicture?: string;
  email?: string;
  studentNumber: string;
}

export interface UpdateOfficerData {
  role: "council-officer" | "committee-officer" | "student";
  position?: string;
  department?: string;
  yearLevel?: number;
  profilePicture?: string;
}

const officerService = {
  getOfficers: async () => {
    const response = await api.get<{ success: boolean; data: Officer[] }>(
      "/officers"
    );
    return response.data.data;
  },

  searchNonOfficers: async (query: string) => {
    const response = await api.get<{ success: boolean; data: Officer[] }>(
      `/officers/search?query=${query}`
    );
    return response.data.data;
  },

  updateOfficer: async (id: string, data: UpdateOfficerData) => {
    const response = await api.put<{ success: boolean; data: Officer }>(
      `/officers/${id}`,
      data
    );
    return response.data.data;
  },
};

export default officerService;
