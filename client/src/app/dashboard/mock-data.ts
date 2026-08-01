/**
 * Mock data for dashboards.
 * 
 * Future API integration endpoints:
 *   GET /api/dashboard          — summary stats
 *   GET /api/events/upcoming    — upcoming events list
 *   GET /api/announcements/latest — latest announcements
 *   GET /api/notifications      — user notifications
 *   GET /api/membership/me      — logged-in user membership info
 *   GET /api/meetings/me        — scheduled meetings for current user
 *   GET /api/merchandise/featured — featured merchandise items
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  imageUrl: string;
  status: "Upcoming" | "Registered" | "Ongoing" | "Full" | "Completed";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  publishDate: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "membership" | "event" | "announcement" | "merch" | "meeting";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "membership" | "announcement" | "meeting" | "merch" | "default";
  isRead: boolean;
}

export interface MerchandiseItem {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  availableSizes: string[];
}

export interface Meeting {
  id: string;
  title: string;
  with: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
}

// ─── Officer Dashboard Mock Data ──────────────────────────────────────────────

export const officerStats = [
  {
    id: "members",
    title: "Total Members",
    count: 248,
    subtitle: "Active registered members",
    color: "blue" as const,
  },
  {
    id: "events",
    title: "Upcoming Events",
    count: 5,
    subtitle: "Scheduled this semester",
    color: "cyan" as const,
  },
  {
    id: "announcements",
    title: "Announcements",
    count: 18,
    subtitle: "Published this month",
    color: "sky" as const,
  },
  {
    id: "merch",
    title: "Merch Items",
    count: 12,
    subtitle: "Available in store",
    color: "blue" as const,
  },
];

export const recentActivities: Activity[] = [
  {
    id: "1",
    title: "Membership Verified",
    description: "23-4149-813 · Gio Macatual's All-Access membership has been approved.",
    timestamp: "2 min ago",
    type: "membership",
  },
  {
    id: "2",
    title: "Event Created",
    description: "CITEen Seminar Series 2025 has been published and is now visible to all members.",
    timestamp: "1 hr ago",
    type: "event",
  },
  {
    id: "3",
    title: "Announcement Published",
    description: "Final exam schedule for 2nd Semester A.Y. 2025-2026 has been posted.",
    timestamp: "3 hrs ago",
    type: "announcement",
  },
  {
    id: "4",
    title: "Merchandise Updated",
    description: "Stock for ICpEP Hoodie (L, XL) updated — 20 units added.",
    timestamp: "Yesterday",
    type: "merch",
  },
  {
    id: "5",
    title: "Committee Meeting Scheduled",
    description: "Meeting with Juan Dela Cruz confirmed for July 16, 2026 at 2:00 PM.",
    timestamp: "Yesterday",
    type: "meeting",
  },
];

export const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "CITEen Seminar Series 2025",
    date: "July 20, 2026 · 9:00 AM",
    venue: "Main Auditorium, CIT-U",
    imageUrl: "/gle.png",
    status: "Upcoming",
  },
  {
    id: "2",
    title: "Robotics Workshop & Lab Tour",
    date: "July 28, 2026 · 1:00 PM",
    venue: "ECE Laboratory, 3rd Floor",
    imageUrl: "/gle.png",
    status: "Upcoming",
  },
  {
    id: "3",
    title: "ICpEP General Assembly 2026",
    date: "August 4, 2026 · 8:00 AM",
    venue: "College of Engineering Gym",
    imageUrl: "/gle.png",
    status: "Full",
  },
];

export const latestAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Final Exam Schedule – 2nd Semester A.Y. 2025-2026",
    content:
      "The final examination schedule for all Computer Engineering subjects has been released. Please review your assigned rooms and time slots carefully.",
    publishDate: "Jul 12, 2026",
  },
  {
    id: "2",
    title: "Deadline Reminder: National Membership Registration",
    content:
      "The deadline for national membership registration is on July 25, 2026. Members who have not submitted their payment receipts are advised to comply immediately.",
    publishDate: "Jul 10, 2026",
  },
  {
    id: "3",
    title: "Congrats to the ICpEP SE CIT-U Robotics Team!",
    content:
      "Our robotics team placed 2nd in the Regional Engineering Olympics. Join us in congratulating the team for their outstanding achievement!",
    publishDate: "Jul 7, 2026",
  },
];

export const officerNotifications: Notification[] = [
  {
    id: "1",
    title: "New Membership Application",
    message: "Juan Dela Cruz submitted a membership application and is awaiting verification.",
    time: "5 min ago",
    type: "membership",
    isRead: false,
  },
  {
    id: "2",
    title: "Announcement Published",
    message: "Final exam schedule has been successfully published to all members.",
    time: "1 hr ago",
    type: "announcement",
    isRead: false,
  },
  {
    id: "3",
    title: "Committee Meeting Tomorrow",
    message: "Reminder: You have a scheduled committee meeting with Maria Santos at 2:00 PM.",
    time: "3 hrs ago",
    type: "meeting",
    isRead: true,
  },
  {
    id: "4",
    title: "Merchandise Stock Updated",
    message: "ICpEP Hoodie (L, XL) stock has been updated to 20 units.",
    time: "Yesterday",
    type: "merch",
    isRead: true,
  },
];

// ─── Student Dashboard Mock Data ───────────────────────────────────────────────

export const studentEvents: Event[] = [
  {
    id: "1",
    title: "CITEen Seminar Series 2025",
    date: "July 20, 2026 · 9:00 AM",
    venue: "Main Auditorium, CIT-U",
    imageUrl: "/gle.png",
    status: "Registered",
  },
  {
    id: "2",
    title: "Robotics Workshop & Lab Tour",
    date: "July 28, 2026 · 1:00 PM",
    venue: "ECE Laboratory, 3rd Floor",
    imageUrl: "/gle.png",
    status: "Upcoming",
  },
  {
    id: "3",
    title: "ICpEP General Assembly 2026",
    date: "August 4, 2026 · 8:00 AM",
    venue: "College of Engineering Gym",
    imageUrl: "/gle.png",
    status: "Full",
  },
];

export const studentMeetings: Meeting[] = [
  {
    id: "1",
    title: "Consultation: Embedded Systems Project",
    with: "Engr. Roel P. Lauron",
    date: "July 16, 2026",
    time: "2:00 PM",
    status: "Confirmed",
  },
  {
    id: "2",
    title: "Project Review: IoT Integration",
    with: "Engr. Michael Brown",
    date: "July 22, 2026",
    time: "10:00 AM",
    status: "Pending",
  },
];

export const featuredMerch: MerchandiseItem[] = [
  {
    id: "1",
    name: "ICpEP SE CIT-U Chapter T-Shirt",
    price: "₱250",
    imageUrl: "/gle.png",
    availableSizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: "2",
    name: "ICpEP Hoodie – Navy Blue",
    price: "₱650",
    imageUrl: "/gle.png",
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "3",
    name: "Chapter Enamel Pin Set",
    price: "₱120",
    imageUrl: "/gle.png",
    availableSizes: [],
  },
  {
    id: "4",
    name: "Engineering Notebook – CIT-U Edition",
    price: "₱180",
    imageUrl: "/gle.png",
    availableSizes: [],
  },
];

export const studentNotifications: Notification[] = [
  {
    id: "1",
    title: "Membership Approved 🎉",
    message: "Your All-Access membership has been verified and activated. Welcome to ICpEP.SE CIT-U!",
    time: "Just now",
    type: "membership",
    isRead: false,
  },
  {
    id: "2",
    title: "New Event Posted",
    message: "Robotics Workshop & Lab Tour is now open for registration. Slots are limited!",
    time: "2 hrs ago",
    type: "announcement",
    isRead: false,
  },
  {
    id: "3",
    title: "Meeting Confirmed",
    message: "Your consultation with Engr. Roel P. Lauron is confirmed for July 16 at 2:00 PM.",
    time: "Yesterday",
    type: "meeting",
    isRead: true,
  },
];
