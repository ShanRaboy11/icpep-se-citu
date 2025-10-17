// src/data/announcements.ts

// Define the interface for a single announcement
export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  imageUrl: string;
  fullDescription?: string;
  time?: string;
  location?: string;
  organizer?: string;
  contact?: string;
  attendees?: string;
  agenda?: string[];
  awardees?: {
    name: string;
    program: string;
    year: string;
    award: string;
  }[];
}

// Export the array of mock announcement data
export const announcements: Announcement[] = [
  {
    id: "1",
    title: "Annual Innovation Conference 2024",
    description: "Join us for our biggest innovation conference of the year...",
    fullDescription: "Join us for our biggest innovation conference of the year...",
    date: "2024-12-15",
    time: "9:00 AM - 6:00 PM",
    location: "Grand Convention Center, Main Auditorium",
    organizer: "Innovation Department",
    contact: "innovation@organization.com",
    attendees: "500+ attendees",
    type: "Event",
    imageUrl: "/meeting.png",
    agenda: [
      "9:00 AM - Registration & Welcome Coffee",
      "10:00 AM - Keynote: Future of AI in Business",
      "11:30 AM - Panel: Digital Transformation Strategies",
      "1:00 PM - Networking Lunch",
      "2:30 PM - Workshop: Implementing Innovation Frameworks",
      "4:00 PM - Startup Pitch Competition",
      "5:30 PM - Closing Remarks & Awards",
    ],
  },
  {
    id: "2",
    title: "Excellence Awards Ceremony",
    description: "Celebrating outstanding achievements...",
    fullDescription: "Join us for our annual Excellence Awards Ceremony...",
    date: "2024-11-28",
    time: "7:00 PM - 10:00 PM",
    location: "Ballroom, Executive Hotel",
    organizer: "ICpEP SE CIT-U Chapter",
    contact: "awards@icpep-cituc.org",
    attendees: "200+ members and guests",
    type: "Achievement",
    imageUrl: "/meeting.png",
    awardees: [
      { name: "Maria Santos", program: "", year: "4th Year", award: "Outstanding Academic Excellence" },
      { name: "John Rafael Cruz", program: "", year: "3rd Year", award: "Leadership Excellence Award" },
      // ... more awardees
    ],
  },
  {
    id: "3",
    title: "Digital Transformation Workshop",
    description: "Learn about the latest digital tools...",
    fullDescription: "Learn about the latest digital tools...",
    date: "2024-11-20",
    time: "1:00 PM - 5:00 PM",
    location: "Training Center, Room 301",
    organizer: "Digital Innovation Team",
    contact: "training@organization.com",
    attendees: "30 participants",
    type: "Event",
    imageUrl: "/meeting.png",
    agenda: [
      "1:00 PM - Welcome & Digital Transformation Overview",
      // ... more agenda items
    ],
  },
  {
    id: "4",
    title: "Quarterly Chapter Board Meeting",
    description: "Comprehensive review of chapter activities...",
    fullDescription: "Join us for our quarterly chapter board meeting...",
    date: "2024-11-15",
    time: "10:00 AM - 3:00 PM",
    location: "CIT-U Conference Room A",
    organizer: "Chapter Board",
    contact: "board@icpep-cituc.org",
    attendees: "Board members & committee heads",
    type: "Meeting",
    imageUrl: "/meeting.png",
    agenda: [
      "Chapter Performance Review",
      // ... more agenda items
    ],
  },
  {
    id: "5",
    title: "Leadership Development Seminar",
    description: "Enhance your leadership skills...",
    fullDescription: "Enhance your leadership skills...",
    date: "2024-11-08",
    time: "9:00 AM - 4:00 PM",
    location: "Learning & Development Center",
    organizer: "Human Resources Department",
    contact: "leadership@organization.com",
    attendees: "50 managers and leaders",
    type: "Event",
    imageUrl: "/meeting.png",
    agenda: [
      "9:00 AM - Modern Leadership Principles",
      // ... more agenda items
    ],
  },
  {
    id: "6",
    title: "Team Achievement Recognition",
    description: "Celebrating the remarkable success...",
    fullDescription: "We are proud to celebrate the remarkable success...",
    date: "2024-10-30",
    time: "3:00 PM - 4:00 PM",
    location: "Development Team Office",
    organizer: "CTO Office",
    contact: "recognition@organization.com",
    attendees: "Development team & management",
    type: "Achievement",
    imageUrl: "/meeting.png",
  },
];