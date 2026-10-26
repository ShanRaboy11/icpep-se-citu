export interface Event {
  id: string;
  title: string;
  status?: "Upcoming" | "Ended" | "Ongoing";
  date: string; // This is now the START date
  endDate?: string; // Optional END date for multi-day events
  mode: "Online" | "Onsite";
  location: string;
  organizer: {
    name: string;
    avatarImageUrl: string;
  };
  tags?: string[];
  bannerImageUrl: string;
  description: string;
  content?: string;
  details: {
    title: string;
    items: string[];
  }[];
  galleryImageUrls?: string[];
  rsvpLink?: string;
  rsvpCount?: number;
  contact?: string;
}
