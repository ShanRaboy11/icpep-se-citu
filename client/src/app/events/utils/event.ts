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
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Starts in 5 days
    // No endDate needed for a single-day event
    mode: "Online",
    location: "Google Meet",
    organizer: {
      name: "START DOST",
      avatarImageUrl: "/icpep logo.png", // Example path to a logo
    },
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
    date: "2024-08-15T13:00:00Z", // In the past
    mode: "Onsite",
    location: "CIT-U Main Auditorium",
    organizer: {
      name: "ICpEP.SE R7 CIT-U",
      avatarImageUrl: "/icpep logo.png", // Using your existing logo
    },
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
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Started 2 days ago
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 3 days
    mode: "Onsite",
    location: "CIT-U Campus Grounds",
    organizer: {
      name: "ICpEP.SE R7 CIT-U",
      avatarImageUrl: "/icpep logo.png", // Using your existing logo
    },
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
  {
    id: "4",
    title: "TechXplore 2025: Beyond Circuits and Code",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // Starts in 10 days
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 3-day event
    mode: "Onsite",
    location: "CIT-U Innovation Hall",
    organizer: {
      name: "ICpEP.SE R7 CIT-U",
      avatarImageUrl: "/icpep logo.png",
    },
    tags: ["Seminar", "TechTalks", "Networking"],
    bannerImageUrl:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=2069&auto=format&fit=crop",
    description:
      "A 3-day interactive series of seminars and networking sessions that dive into cutting-edge technologies shaping the future of engineering and computing.",
    details: [
      {
        title: "Event Highlights",
        items: [
          "Talks on Artificial Intelligence and Embedded Systems",
          "Panel Discussion with Industry Experts",
          "Student Innovation Booths",
        ],
      },
      {
        title: "What to Bring",
        items: ["Valid ID", "Notebook and Pen", "Laptop (optional)"],
      },
    ],
  },
  {
    id: "5",
    title: "CodeQuest 2025: The Intercampus Programming Battle",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    mode: "Online",
    location: "Discord Server + HackerRank",
    organizer: {
      name: "ICpEP.SE R7",
      avatarImageUrl: "/icpep logo.png",
    },
    tags: ["Competition", "Programming", "Team Event"],
    bannerImageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2069&auto=format&fit=crop",
    description:
      "An intercampus programming competition where participants race to solve algorithmic challenges and prove their coding prowess.",
    details: [
      {
        title: "Competition Rounds",
        items: [
          "Elimination Round – Online Coding Challenge",
          "Final Round – Live Problem Solving Battle",
        ],
      },
      {
        title: "Eligibility",
        items: [
          "Open to all ICpEP.SE members",
          "Teams of up to 3 participants",
        ],
      },
    ],
  },
];
