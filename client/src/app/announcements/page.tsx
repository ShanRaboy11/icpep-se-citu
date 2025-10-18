"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnnouncementCard } from "./components/announcement-card";
import Header from "../components/header";
import Footer from "../components/footer";
import { ArrowLeft } from "lucide-react";
import Grid from "../components/grid";
import { Announcement, announcements } from "./utils/announcements";

export default function AnnouncementsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredAnnouncements = announcements
    .filter((announcement) => {
      if (activeTab === "All") {
        return true; // show all announcements
      }
      return announcement.type.toLowerCase() === activeTab.toLowerCase();
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAnnouncementClick = (announcement: Announcement) => {
    const encodedData = encodeURIComponent(JSON.stringify(announcement));
    router.push(`/announcements/${announcement.id}?data=${encodedData}`);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const tabs = ["All", "News", "Meeting", "Achievement"];

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

          {/* --- MODIFICATION: Themed "Inset" Tab Bar --- */}
          <div className="mb-16 flex justify-center">
            {/* The "track" now uses your theme's light blue background */}
            <div className="flex space-x-1 rounded-xl bg-primary1/10 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative w-full rounded-lg px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-rubik font-semibold transition-colors duration-300 ease-in-out cursor-pointer
                    ${
                      activeTab === tab
                        ? "bg-white text-primary1 shadow" // Active tab is white on the blue track
                        : "text-primary1/60 hover:bg-white/60" // Inactive tabs are faded blue
                    }
                  `}
                >
                  {tab}
                  {/* The underline remains the same */}
                  {activeTab === tab && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-1/3 bg-primary1"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Announcements List */}
          <div className="px-6 lg:px-12 xl:px-16 pb-14">
            <div className="space-y-12">
              {/* --- MODIFICATION 5: Map over the new `filteredAnnouncements` array --- */}
              {filteredAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  {...announcement}
                  imageUrl={announcement.imageUrl}
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
