export interface Event {
  id: string;
  title: string;
  status: "Upcoming" | "Ended" | "Ongoing";
  date: string; // Use ISO 8601 format: 'YYYY-MM-DDTHH:mm:ss'
  mode: "Online" | "Onsite";
  location: string; // Can be a physical address or a platform name like "Google Meet"
  organizer: {
    name: string;
    avatarInitial: string;
  };
  tags: string[];
  bannerImageUrl: string;
  description: string;
  details: {
    title: string;
    items: string[];
  }[];
  galleryImageUrls?: string[];
}

// Sample data using the new structure
export const events: Event[] = [
  {
    id: "1",
    title: "Vibe Coding: OpenXAI Foundations Workshop",
    status: "Upcoming",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    mode: "Online",
    location: "Google Meet",
    organizer: { name: "START DOST", avatarInitial: "SD" },
    tags: ["AI", "Workshop", "No-Code", "Blockchain"],
    bannerImageUrl:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop",
    description:
      "A FREE two-part hands-on training for DOST Scholars that introduces the fundamentals of OpenXAI and its no-code framework.",
    details: [
      {
        title: "Topics Covered",
        items: [
          "No-code development approach",
          "Introduction to OpenXAI concepts",
          "Hands-on scenario demonstration",
          "Pathway to blockchain applications",
        ],
      },
      {
        title: "Requirements",
        items: [
          "Open to all DOST Scholars",
          "Development environment setup (instructions provided)",
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Annual General Assembly 2024",
    status: "Ended",
    date: "2024-08-15T13:00:00",
    mode: "Onsite",
    location: "CIT-U Main Auditorium",
    organizer: { name: "ICpEP.SE R7 CIT-U", avatarInitial: "I" },
    tags: ["Assembly", "Official", "Chapter Event"],
    bannerImageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop",
    description:
      "The annual gathering of all members to discuss the future of the chapter, present accomplishments, and elect new officers.",
    details: [
      {
        title: "Agenda",
        items: [
          "President's Report",
          "Financial Statement",
          "Election of 6th Administration Officers",
          "Open Forum",
        ],
      },
    ],
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&auto=format&fit=crop",
    ],
  },
  {
    id: "3",
    title: "ICpEP Week 2024: Innovation Festival",
    status: "Ongoing",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Started 2 days ago
    mode: "Onsite",
    location: "CIT-U Campus Grounds",
    organizer: { name: "ICpEP.SE R7 CIT-U", avatarInitial: "I" },
    tags: ["Chapter Week", "Competitions", "Seminars"],
    bannerImageUrl:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop",
    description:
      "A week-long celebration of technology and engineering with daily competitions, workshops, and fun activities.",
    details: [
      {
        title: "Daily Activities",
        items: ["Coding Challenges", "Hardware Exhibits", "Gaming Tournaments"],
      },
      {
        title: "Main Events",
        items: ["Hackathon on Day 3", "Keynote Speech on Day 5"],
      },
    ],
  },
];
