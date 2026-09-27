import { api, errorMessage } from "./api-client";

export type Meeting = {
  _id: string;
  title: string;
  agenda: string;
  departments: string[];
  selectedDates: string[];
  startTime: string;
  endTime: string;
  timeLimit?: string;
  meetingLink?: string;
};

export async function createMeeting(payload: Omit<Meeting, "_id">) {
  try {
    const res = await api.post("/meetings", payload);
    return res.data.data as Meeting;
  } catch (error) {
    throw new Error(errorMessage(error, "Failed to create meeting"));
  }
}

export async function getMeeting(id: string) {
  try {
    const res = await api.get(`/meetings/${id}`);
    return res.data.data as Meeting;
  } catch (error) {
    throw new Error(errorMessage(error, "Failed to fetch meeting"));
  }
}

export async function listMeetings(params?: {
  upcoming?: boolean;
  me?: boolean;
  q?: string;
}) {
  const query: Record<string, string> = {};
  if (params?.upcoming) query.upcoming = "true";
  if (params?.me) query.me = "true";
  if (params?.q) query.q = params.q;

  try {
    const res = await api.get("/meetings", { params: query });
    return res.data.data as Meeting[];
  } catch (error) {
    throw new Error(errorMessage(error, "Failed to list meetings"));
  }
}

export async function updateMeeting(id: string, patch: Partial<Meeting>) {
  try {
    const res = await api.patch(`/meetings/${id}`, patch);
    return res.data.data as Meeting;
  } catch (error) {
    throw new Error(errorMessage(error, "Failed to update meeting"));
  }
}

export async function deleteMeeting(id: string) {
  try {
    await api.delete(`/meetings/${id}`);
    return true;
  } catch (error) {
    throw new Error(errorMessage(error, "Failed to delete meeting"));
  }
}
