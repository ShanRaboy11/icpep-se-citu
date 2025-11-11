"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnnouncementDetails from "../components/details";
import DetailsSidebar from "../components/info";
import MeetingAttendanceCard from "../components/attendance-card";
import AttendanceModal from "../components/attendance-modal";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { ArrowLeft } from "lucide-react";
import AnnouncementMedia from "../components/media";
import announcementService from "../../services/announcement";

// Interface matching the database model
interface Announcement {
  _id: string;
  title: string;
  description: string;
  content: string;
  type: string;
  imageUrl?: string | null;
  publishDate: string;
  author?: {
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  views?: number;
  isPublished: boolean;
  time?: string;
  location?: string;
  organizer?: string;
  contact?: string;
  attendees?: string;
  agenda?: string[];
  awardees?: Array<{
    name: string;
    program?: string;
    year: string;
    award: string;
  }>;
  attachments?: Array<{
    name: string;
    url: string;
    fileType?: string;
  }>;
  priority?: string;
  expiryDate?: string;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date not available";
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return "Date not available";
  }
};

// Helper function to format time from 24h to 12h format
const formatTime = (timeString: string | undefined): string => {
  if (!timeString) return "Time not specified";
  
  try {
    // Handle time formats like "14:30" or "14:30:00"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const min = minutes || '00';
    
    if (isNaN(hour)) return timeString;
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${min} ${period}`;
  } catch {
    return timeString;
  }
};

export default function AnnouncementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [showFullAttendance, setShowFullAttendance] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch announcement from database
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await announcementService.getAnnouncementById(params.id);

        if (response.success && response.data) {
          setAnnouncement(response.data as Announcement);
        } else {
          setError("Announcement not found");
        }
      } catch (err) {
        console.error("Failed to fetch announcement:", err);
        setError("Failed to load announcement. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAnnouncement();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push("/announcements");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 pt-[9.5rem] pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="w-full h-64 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-6 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6" />
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="h-12 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-48 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error or not found state
  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex flex-grow flex-col items-center justify-center text-center px-4 pt-[9.5rem] pb-12">
          <h1 className="font-rubik text-4xl font-bold text-primary3 mb-4">
            {error || "Announcement Not Found"}
          </h1>
          <p className="font-raleway max-w-md text-gray-600 mb-8">
            {error
              ? "There was an error loading this announcement."
              : "Sorry, the announcement you are looking for does not exist."}
          </p>
          <button
            onClick={() => router.push("/announcements")}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary1 px-6 py-3 font-rubik font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-primary2"
          >
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Announcements</span>
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const title = announcement.title;
  const imageUrl = announcement.imageUrl || "/default-image.jpg";
  const galleryImageUrls: string[] = [];
  const isMeeting = announcement.type.toLowerCase() === "meeting";

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden font-sans">
      <div className="absolute top-[-10rem] left-[-15rem] w-[35rem] h-[35rem] bg-primary1/20 rounded-full filter blur-3xl opacity-90"></div>
      <div className="absolute top-1/4 right-[-18rem] w-[35rem] h-[35rem] bg-secondary2/20 rounded-full filter blur-3xl opacity-90"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 pt-[9.5rem] pb-12">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <AnnouncementMedia
                title={title}
                imageUrl={imageUrl}
                galleryImageUrls={galleryImageUrls}
              />
              <AnnouncementDetails announcement={announcement} />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <DetailsSidebar announcement={announcement as any} />

              {isMeeting && announcement.attendees && (
                <MeetingAttendanceCard
                  onViewFull={() => setShowFullAttendance(true)}
                />
              )}
            </div>
          </div>
        </main>

        <AttendanceModal
          isOpen={showFullAttendance}
          onClose={() => setShowFullAttendance(false)}
          announcement={announcement as any}
        />
        <Footer />
      </div>
    </div>
  );
}