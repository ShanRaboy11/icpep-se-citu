export interface ApiList<T> {
  success: boolean;
  data: T[];
  message?: string;
}

export interface FacultyRecord {
  _id: string;
  name: string;
  position: string;
  image?: string;
  gender?: string | null;
}

export interface AdvisorRecord {
  _id: string;
  name: string;
  position: string;
  yearRange: string;
  image?: string;
  gender?: string | null;
}

export interface SponsorRecord {
  _id: string;
  name: string;
  type?: string;
  image?: string;
}

export interface TestimonialRecord {
  _id: string;
  name: string;
  role: string;
  quote: string;
  image?: string;
}

export interface OfficerTermRecord {
  _id: string;
  name: string;
  position: string;
  role?: string;
  image?: string;
  gender?: string | null;
  termYear?: string;
  departmentType?: string;
  committeeName?: string;
  displayOrder?: number;
}

// Announcements and events share the fields the home page and dashboards read.
export interface FeedItemRecord {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  type?: string;
  imageUrl?: string;
  coverImage?: string;
  publishDate?: string;
  date?: string;
  eventDate?: string;
  endDate?: string;
  time?: string;
  location?: string;
  mode?: string;
  tags?: string[];
  content?: string;
  galleryImages?: string[];
  organizer?: string | { name?: string };
}

export interface EventRecord extends FeedItemRecord {
  eventDate: string;
}

export interface AnnouncementRecord extends FeedItemRecord {
  id: string;
  type: "News" | "Meeting" | "Achievement";
}
