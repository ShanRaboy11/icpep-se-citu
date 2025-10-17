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
  _id: string;
  title: string;
  description: string; // Short description
  content: string; // Full description
  author: {
    _id: string;
    fullName: string;
  };
  type: 'Event' | 'Award' | 'Workshop' | 'Meeting' | 'Seminar' | 'Achievement' | 'General';
  priority: 'normal' | 'important' | 'urgent';
  targetAudience: ('all' | 'members' | 'officers' | 'faculty')[];
  isPublished: boolean;
  publishDate: string;
  expiryDate?: string;
  
  // Event/Meeting fields
  time?: string;
  location?: string;
  organizer?: string;
  contact?: string;
  attendees?: string;
  agenda?: string[];
  
  // Award fields
  awardees?: {
    name: string;
    program?: string;
    year: string;
    award: string;
  }[];
  
  // Media
  imageUrl?: string;
  attachments: {
    name: string;
    url: string;
    fileType: string;
  }[];
  
  views: number;
  createdAt: string;
  updatedAt: string;
  
  // Virtuals
  isExpired?: boolean;
  formattedDate?: string;
}