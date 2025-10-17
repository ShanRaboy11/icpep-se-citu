"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DetailHeader from "../components/detail_header";
import HeroImage from "../components/hero_image";
import AboutSection from "../components/about_section";
import DetailsSidebar from "../components/detail_sidebar";
import MeetingAttendanceCard from "../components/attendance_card";
import ActionCard from "../components/action_card";
import AttendanceModal from "../components/attendance_modal";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { ArrowLeft } from "lucide-react";

// Temporary: Get announcements from the list page
// Later this will be fetched from your database using the ID
const announcements = [
  {
    id: "1",
    title: "Annual Innovation Conference 2024",
    description:
      "Join us for our biggest innovation conference of the year featuring keynote speakers from leading tech companies, interactive workshops, and networking opportunities. Discover the latest trends in technology and connect with industry leaders.",
    fullDescription:
      "Join us for our biggest innovation conference of the year featuring keynote speakers from leading tech companies, interactive workshops, and networking opportunities. Discover the latest trends in technology, artificial intelligence, digital transformation, and sustainable business practices. This two-day event will bring together industry leaders, entrepreneurs, and innovators to share insights, collaborate on solutions, and shape the future of technology. Network with like-minded professionals, attend hands-on workshops, and gain valuable knowledge that will drive your organization forward.",
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
    description:
      "Celebrating outstanding achievements and recognizing exceptional performance across all departments. Join us as we honor our top performers and their contributions to organizational success.",
    fullDescription:
      "Join us for our annual Excellence Awards Ceremony, where we celebrate the outstanding achievements and exceptional performance of our CPE students and faculty members. This prestigious event recognizes individuals who have demonstrated excellence, innovation, and dedication throughout the year.",
    date: "2024-11-28",
    time: "7:00 PM - 10:00 PM",
    location: "Ballroom, Executive Hotel",
    organizer: "ICpEP SE CIT-U Chapter",
    contact: "awards@icpep-cituc.org",
    attendees: "200+ members and guests",
    type: "Award",
    imageUrl: "/meeting.png",
    awardees: [
      {
        name: "Maria Santos",
        program: "",
        year: "4th Year",
        award: "Outstanding Academic Excellence",
      },
      {
        name: "John Rafael Cruz",
        program: "",
        year: "3rd Year",
        award: "Leadership Excellence Award",
      },
      {
        name: "Sarah Mae Rodriguez",
        program: "",
        year: "4th Year",
        award: "Innovation and Research Award",
      },
      {
        name: "Miguel Angelo Fernandez",
        program: "",
        year: "2nd Year",
        award: "Community Service Excellence",
      },
    ],
  },
  {
    id: "3",
    title: "Digital Transformation Workshop",
    description:
      "Learn about the latest digital tools and strategies that can transform your workflow. This hands-on workshop will cover automation, AI integration, and digital best practices for modern organizations.",
    fullDescription:
      "Learn about the latest digital tools and strategies that can transform your workflow in this comprehensive hands-on workshop. Discover how to leverage automation, artificial intelligence, and digital best practices to streamline processes, increase efficiency, and drive innovation within your department. Our expert facilitators will guide you through practical exercises, real-world case studies, and interactive demonstrations. You will leave with actionable insights and a roadmap for implementing digital transformation initiatives in your work.",
    date: "2024-11-20",
    time: "1:00 PM - 5:00 PM",
    location: "Training Center, Room 301",
    organizer: "Digital Innovation Team",
    contact: "training@organization.com",
    attendees: "30 participants",
    type: "Workshop",
    imageUrl: "/meeting.png",
    agenda: [
      "1:00 PM - Welcome & Digital Transformation Overview",
      "1:30 PM - Automation Tools & Implementation",
      "2:30 PM - Break",
      "2:45 PM - AI Integration Workshop",
      "3:45 PM - Hands-on Practice Session",
      "4:30 PM - Action Planning & Next Steps",
      "5:00 PM - Q&A and Wrap-up",
    ],
  },
  {
    id: "4",
    title: "Quarterly Chapter Board Meeting",
    description:
      "Comprehensive review of chapter activities, upcoming initiatives, and planning for next quarter. All board members and committee heads are invited to participate in this important strategic session.",
    fullDescription:
      "Join us for our quarterly chapter board meeting where we will conduct a comprehensive review of our chapter activities and performance. This strategic session will cover membership growth, event outcomes, financial status, and upcoming initiatives for the next quarter. We will discuss chapter priorities, resource allocation, and goal setting to ensure continued success of ICpEP SE CIT-U Chapter.",
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
      "Membership Growth & Engagement",
      "Financial Status & Budget Planning",
      "Working Lunch & Networking",
      "Strategic Initiatives Planning",
      "Committee Updates & Reports",
      "Action Items & Next Steps",
    ],
  },
  {
    id: "5",
    title: "Leadership Development Seminar",
    description:
      "Enhance your leadership skills with expert trainers and interactive sessions. This seminar focuses on modern leadership techniques, team building, and effective communication strategies for managers.",
    fullDescription:
      "Enhance your leadership skills with expert trainers and interactive sessions in this comprehensive seminar designed for current and aspiring leaders. This full-day program focuses on modern leadership techniques, emotional intelligence, team building, and effective communication strategies. Learn how to motivate teams, manage change, resolve conflicts, and create a positive work environment. The seminar includes case studies, group exercises, and practical tools you can immediately apply in your role.",
    date: "2024-11-08",
    time: "9:00 AM - 4:00 PM",
    location: "Learning & Development Center",
    organizer: "Human Resources Department",
    contact: "leadership@organization.com",
    attendees: "50 managers and leaders",
    type: "Seminar",
    imageUrl: "/meeting.png",
    agenda: [
      "9:00 AM - Modern Leadership Principles",
      "10:30 AM - Emotional Intelligence in Leadership",
      "12:00 PM - Lunch Break",
      "1:00 PM - Team Building Strategies",
      "2:30 PM - Effective Communication Techniques",
      "3:30 PM - Leadership Action Planning",
    ],
  },
  {
    id: "6",
    title: "Team Achievement Recognition",
    description:
      "Celebrating the remarkable success of our development team for achieving a 25% increase in project delivery efficiency and maintaining 99.9% system uptime throughout the quarter.",
    fullDescription:
      "We are proud to celebrate the remarkable success of our development team for their outstanding achievements this quarter. The team has demonstrated exceptional performance by achieving a 25% increase in project delivery efficiency while maintaining an impressive 99.9% system uptime. This achievement reflects their dedication, technical expertise, and commitment to excellence. Their innovative approaches to problem-solving and collaborative teamwork have set new standards for our organization.",
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

export default function AnnouncementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [showFullAttendance, setShowFullAttendance] = useState(false);
  const router = useRouter();

  // Find the announcement by ID - later this will be a database fetch
  const announcement = announcements.find((a) => a.id === params.id);

  // Handle not found
  if (!announcement) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        {/* --- MODIFICATION: Added main wrapper with padding and font styles --- */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[9.5rem] pb-16 text-center">
          <h1 className="font-rubik text-3xl font-bold text-gray-900 mb-4">
            Announcement Not Found
          </h1>
          <p className="font-raleway text-gray-600 mb-8">{`The announcement you're looking for doesn't exist.`}</p>
          <button
            onClick={() => router.push("/announcements")}
            className="font-rubik bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Back to Announcements
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBack = () => {
    router.push("/announcements");
  };

  const isMeeting = announcement.type.toLowerCase() === "meeting";
  const isEvent = ["event", "seminar", "workshop"].includes(
    announcement.type.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[9.5rem] pb-16">
        <div className="mb-8 flex justify-start">
          <button
            onClick={handleBack}
            title="Back to Announcements"
            className="relative flex h-12 w-12 cursor-pointer items-center justify-center 
                       rounded-full border-2 border-primary1 text-primary1 
                       overflow-hidden transition-all duration-300 ease-in-out 
                       active:scale-95 before:absolute before:inset-0 
                       before:bg-gradient-to-r before:from-transparent 
                       before:via-white/40 before:to-transparent 
                       before:translate-x-[-100%] hover:before:translate-x-[100%] 
                       before:transition-transform before:duration-700"
          >
            <ArrowLeft className="h-6 w-6 animate-nudge-left translate-x-[2px]" />
          </button>
        </div>
        
        <DetailHeader announcement={announcement} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <HeroImage
              imageUrl={announcement.imageUrl}
              title={announcement.title}
            />
            <AboutSection announcement={announcement} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <DetailsSidebar announcement={announcement} />

            {isMeeting && (
              <MeetingAttendanceCard
                onViewFull={() => setShowFullAttendance(true)}
              />
            )}

            {isEvent && <ActionCard announcement={announcement} />}
          </div>
        </div>
      </main>

      <AttendanceModal
        isOpen={showFullAttendance}
        onClose={() => setShowFullAttendance(false)}
      />
      <Footer />
    </div>
  );
}
