import { api, errorMessage } from "./api-client";

export type AvailabilityDoc = {
  meeting: string;
  user: string;
  slots: string[];
};

export async function getMyAvailability(meetingId: string) {
  try {
    const res = await api.get(`/availability/${meetingId}/me`);
    return res.data.data as AvailabilityDoc;
  } catch (error) {
    throw new Error(errorMessage(error, "Failed to fetch my availability"));
  }
}

export async function saveMyAvailability(meetingId: string, slots: string[]) {
  try {
    const res = await api.patch(`/availability/${meetingId}/me`, { slots });
    return res.data.data as AvailabilityDoc;
  } catch (error) {
    throw new Error(errorMessage(error, "Failed to save availability"));
  }
}

export async function getAvailability(meetingId: string) {
  try {
    const res = await api.get(`/availability/${meetingId}`);
    return res.data.data as Array<{ user: any; slots: string[] }>;
  } catch (error) {
    throw new Error(errorMessage(error, "Failed to fetch availability"));
  }
}
