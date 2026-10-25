export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "News" | "Meeting" | "Achievement";
  imageUrl: string;
  galleryImageUrls?: string[];
  time?: string;
  location?: string;
  organizer?: string;
  attendees?: string;
  attendance?: { name: string; position: string }[];
  agenda?: string[];
  awardees?: {
    name: string;
    year: string;
    award: string;
  }[];
}

export const getTypePill = (type: string) => {
  switch (type.toLowerCase()) {
    case "news":
      return "bg-sky-100 text-sky-800 ring-sky-600/20";
    case "meeting":
      return "bg-indigo-100 text-indigo-800 ring-indigo-600/20";
    case "achievement":
      return "bg-teal-100 text-teal-800 ring-teal-600/20";
    default:
      return "bg-gray-100 text-gray-800 ring-gray-600/20";
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (time: string): string => {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])?$/);
  if (!match) return time;

  const [, rawHours, minutes, suffix] = match;
  const hours = parseInt(rawHours, 10);
  const period = suffix ? suffix.toUpperCase() : hours >= 12 ? "PM" : "AM";
  const displayHours = suffix ? hours : hours % 12 || 12;

  return `${displayHours}:${minutes} ${period}`;
};
