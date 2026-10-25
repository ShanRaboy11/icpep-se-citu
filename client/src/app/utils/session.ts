const KEYS = ["userId", "userRole", "userName"] as const;

export interface SessionUser {
  _id: string;
  role: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

export const saveSession = (user: SessionUser) => {
  localStorage.setItem("userId", user._id);
  localStorage.setItem("userRole", user.role);
  localStorage.setItem("userName", user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim());
};

export const clearSession = () => {
  [...KEYS, "authToken"].forEach((key) => localStorage.removeItem(key));
};

export const getSessionRole = (): string | null => localStorage.getItem("userRole");

export const getSessionUserId = (): string | null => localStorage.getItem("userId");

export const hasSession = (): boolean => Boolean(getSessionRole());
