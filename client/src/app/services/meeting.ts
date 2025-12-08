export type Meeting = {
  _id: string;
  title: string;
  agenda: string;
  departments: string[];
  selectedDates: string[];
  startTime: string;
  endTime: string;
  timeLimit?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const authHeader = () => {
  if (typeof window === "undefined") return {} as Record<string, string>;
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function createMeeting(payload: Omit<Meeting, "_id">) {
  const res = await fetch(`${API_BASE}/meetings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create meeting");
  return json.data as Meeting;
}

export async function getMeeting(id: string) {
  const res = await fetch(`${API_BASE}/meetings/${id}`, {
    headers: { ...authHeader() },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch meeting");
  return json.data as Meeting;
}

export async function listMeetings(params?: {
  upcoming?: boolean;
  me?: boolean;
  q?: string;
}) {
  const search = new URLSearchParams();
  if (params?.upcoming) search.set("upcoming", "true");
  if (params?.me) search.set("me", "true");
  if (params?.q) search.set("q", params.q);

  const res = await fetch(`${API_BASE}/meetings?${search.toString()}`, {
    headers: { ...authHeader() },
    cache: "no-store", // Ensure we don't cache old results
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.message || "Failed to list meetings");

  // FIX: Handle the { success: true, data: [...] } structure
  return json.data as Meeting[];
}

export async function updateMeeting(id: string, patch: Partial<Meeting>) {
  const res = await fetch(`${API_BASE}/meetings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(patch),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update meeting");
  return json.data as Meeting;
}

export async function deleteMeeting(id: string) {
  const res = await fetch(`${API_BASE}/meetings/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete meeting");
  return true;
}
