export interface Officer {
  title: string;
  name: string;
}

export interface Committee {
  name: string;
  color: string;
  members: Officer[];
}

export interface Awardee {
  name: string;
  program: string;
  year: string;
  award: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string; // This will now be one of 'News', 'Meeting', 'Achievement'
  imageUrl: string;
  fullDescription?: string;
  time?: string;
  location?: string;
  organizer?: string;
  contact?: string;
  attendees?: string;
  agenda?: string[];
  awardees?: Awardee[];
}
