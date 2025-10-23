"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AnnouncementDetails from "../components/details";
import DetailsSidebar from "../components/info";
import MeetingAttendanceCard from "../components/attendance-card";
import AttendanceModal from "../components/attendance-modal";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { ArrowLeft } from "lucide-react";
import AnnouncementMedia from "../components/media";
import { announcements } from "../utils/announcements";

export default function AnnouncementDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [showFullAttendance, setShowFullAttendance] = useState(false);
  const router = useRouter();

  // Find the announcement by ID - later this will be a database fetch
  const announcement = announcements.find((a) => a.id === params.id);

  // Optional chaining and default fallback to avoid undefined errors
  const title = announcement?.title || "No title available";
  const imageUrl = announcement?.imageUrl || "/default-image.jpg"; // Default fallback image
  const galleryImageUrls = announcement?.galleryImageUrls || []; // Fallback to empty array
  const isMeeting = announcement?.type.toLowerCase() === "meeting"; // Use optional chaining

  if (!announcement) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex flex-grow flex-col items-center justify-center text-center px-4 pt-[9.5rem] pb-12">
          <h1 className="font-rubik text-4xl font-bold text-primary3 mb-4">
            Announcement Not Found
          </h1>
          <p className="font-raleway max-w-md text-gray-600 mb-8">
            Sorry, the announcement you are looking for does not exist.
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

  const handleBack = () => {
    router.push("/announcements");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden font-sans">
      <div className="absolute top-[-10rem] left-[-15rem] w-[35rem] h-[35rem] bg-primary1/20 rounded-full filter blur-3xl opacity-90"></div>
      <div className="absolute top-1/4 right-[-18rem] w-[35rem] h-[35rem] bg-secondary2/20 rounded-full filter blur-3xl opacity-90"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-6xl mx-auto px-6 pt-[9.5rem] pb-12">
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
              <DetailsSidebar announcement={announcement} />

              {isMeeting && (
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
          announcement={announcement}
        />
        <Footer />
      </div>
    </div>
  );
}
