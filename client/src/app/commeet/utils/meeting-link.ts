// Adds https:// when the user typed a bare link like "meet.google.com/abc".
export const normalizeMeetingLink = (value: string): string => {
  const link = value.trim();
  if (!link) return "";
  return /^https?:\/\//i.test(link) ? link : `https://${link}`;
};

// An empty link is valid (the field is optional).
export const isValidMeetingLink = (link: string): boolean => {
  if (!link) return true;
  try {
    const { protocol, hostname } = new URL(link);
    return (
      (protocol === "http:" || protocol === "https:") && hostname.includes(".")
    );
  } catch {
    return false;
  }
};

export const MEETING_LINK_ERROR =
  "Enter a valid link, e.g. https://meet.google.com/abc-defg-hij";
