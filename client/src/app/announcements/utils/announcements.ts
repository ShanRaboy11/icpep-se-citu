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
  agenda?: string[];
  awardees?: {
    name: string;
    year: string;
    award: string;
  }[];
}

export const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "news":
      return "bg-sky-500 text-white"; // Bright blue for general news
    case "meeting":
      return "bg-indigo-600 text-white"; // Deeper blue for formal meetings
    case "achievement":
      return "bg-teal-500 text-white"; // Blue-green for positive achievements
    default:
      return "bg-slate-500 text-white";
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

export const announcements: Announcement[] = [
  {
    id: "1",
    title: "ICpEP.SE Website Officially Launched",
    description:
      "We are thrilled to announce the official launch of the new ICpEP.SE R7 CIT-U Chapter website, designed to be the central hub for all chapter activities, announcements, and resources.",
    date: "2024-10-20",
    type: "News",
    imageUrl: "/gle.png",
  },
  {
    id: "2",
    title: "Excellence Awards Ceremony Results",
    description:
      "Celebrating the outstanding achievements of our CPE students and faculty members at the annual Excellence Awards Ceremony. Congratulations to all awardees for their dedication and hard work.",
    date: "2024-11-28",
    time: "6:00 PM",
    location: "Convention Center",
    type: "Achievement",
    imageUrl: "/gle.png",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format=fit=crop",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&auto=format=fit=crop",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop",
    ],
    organizer: "ICpEP.SE CIT-U Chapter",
    awardees: [
      {
        name: "Maria Santos",
        year: "4th Year",
        award: "Outstanding Academic Excellence",
      },
      {
        name: "John Rafael Cruz",
        year: "3rd Year",
        award: "Leadership Excellence Award",
      },
    ],
  },
  {
    id: "3",
    title: "Quarterly Chapter Board Meeting",
    description:
      "A comprehensive review of Q3 chapter activities and strategic planning for the upcoming quarter. All board members and committee heads are invited.",
    date: "2024-11-15",
    time: "2:00 PM",
    location: "CIT-U Conference Room",
    type: "Meeting",
    imageUrl: "/meeting.png",
    agenda: [
      "Chapter Performance Review",
      "Financial Status & Budget Planning",
      "Strategic Initiatives Planning",
    ],
  },
];
