const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const authHeader = () => {
  if (typeof window === "undefined") return {} as Record<string, string>;
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export type AvailabilityDoc = {
  meeting: string;
  user: string;
  slots: string[];
};

export async function getMyAvailability(meetingId: string) {
  const res = await fetch(`${API_BASE}/availability/${meetingId}/me`, {
    headers: { ...authHeader() },
  });
  const json = await res.json();
  if (!res.ok)
    throw new Error(json.message || "Failed to fetch my availability");
  return json.data as AvailabilityDoc;
}

export async function saveMyAvailability(meetingId: string, slots: string[]) {
  const res = await fetch(`${API_BASE}/availability/${meetingId}/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ slots }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to save availability");
  return json.data as AvailabilityDoc;
}

export async function getAvailability(meetingId: string) {
  const res = await fetch(`${API_BASE}/availability/${meetingId}`, {
    headers: { ...authHeader() },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch availability");
  return json.data as Array<{ user: any; slots: string[] }>;
}

export async function getAvailabilitySummary(meetingId: string) {
  const res = await fetch(`${API_BASE}/availability/${meetingId}/summary`, {
    headers: { ...authHeader() },
  });
  const json = await res.json();
  if (!res.ok)
    throw new Error(json.message || "Failed to fetch availability summary");
  return json.data as {
    selectedDates: string[];
    startTime: string;
    endTime: string;
    counts: Record<string, number>;
  };
}
