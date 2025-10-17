"use client";

import { useRouter } from "next/navigation";
import { AnnouncementCard } from "./components/announcement-card";
import Header from "../components/header";
import Footer from "../components/footer";
import { ArrowLeft } from "lucide-react";
import Grid from "../components/grid";
import { Announcement, announcements } from "./utils/announcements";

export default function AnnouncementsPage() {
  const router = useRouter();

  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAnnouncementClick = (announcement: Announcement) => {
    const encodedData = encodeURIComponent(JSON.stringify(announcement));
    router.push(`/announcements/${announcement.id}?data=${encodedData}`);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        {/* --- MODIFICATION: Updated max-width and padding to match EventsListPage --- */}
        <main className="max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12 w-full flex-grow">
          {/* Back to Home Navigation */}
          <div className="mb-8 flex justify-start">
            <button
              onClick={handleBackToHome}
              title="Back to Home"
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

          {/* Title Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                Latest Updates
              </span>
            </div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              Announcements
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Stay in the know with the latest news, meetings, and achievements
              from ICpEP.SE R7 CIT-U Chapter.
            </p>
          </div>

          {/* Announcements List - now maps over the full, sorted list */}
          <div className="px-6 lg:px-12 xl:px-16 pb-14">
            <div className="space-y-12">
              {sortedAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  {...announcement}
                  imageUrl={announcement.imageUrl} // Use dynamic image URL
                  onClick={() => handleAnnouncementClick(announcement)}
                />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
