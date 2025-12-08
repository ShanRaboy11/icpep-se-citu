"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnnouncementCard } from "./components/announcement-card";
import Header from "../components/header";
import Footer from "../components/footer";
import { Home, Sparkles } from "lucide-react"; // Import Sparkles
import Grid from "../components/grid";
import announcementService from "../services/announcement";

// Interface matching the database model
interface Announcement {
  _id: string;
  title: string;
  description: string;
  content: string;
  type: "News" | "Meeting" | "Achievement" | string;
  imageUrl?: string | null;
  publishDate: string;
  author?: {
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  views?: number;
  isPublished: boolean;
}

export default function AnnouncementsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. NEW STATE: Edit Mode ---
  const [editMode, setEditMode] = useState(false);
  const toggleEdit = () => setEditMode((prev) => !prev);

  // Fetch announcements from the database
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch only published announcements
        const response = await announcementService.getAnnouncements({
          isPublished: true,
          limit: 100, // Fetch more announcements
          sort: "-publishDate",
        });

        if (response.success && response.data) {
          setAnnouncements(response.data as Announcement[]);
        }
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setError("Failed to load announcements. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Filter announcements by type
  const filteredAnnouncements = announcements
    .filter((announcement) => {
      if (activeTab === "All") {
        return true;
      }
      // Map tab names to database types
      const typeMap: Record<string, string> = {
        News: "News",
        Meeting: "Meeting",
        Achievement: "Achievement",
      };
      const dbType = typeMap[activeTab] || activeTab;
      return announcement.type.toLowerCase() === dbType.toLowerCase();
    })
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

  const handleAnnouncementClick = (announcement: Announcement) => {
    // Navigate to the detail page using the database ID
    router.push(`/announcements/${announcement._id}`);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const tabs = ["All", "News", "Meeting", "Achievement"];

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden select-none">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12 w-full flex-grow">
          {/* Back to Home Navigation */}
          <div className="mb-8 flex justify-start">
            <button
              onClick={handleBackToHome}
              title="Back to Home"
              className="relative flex h-12 w-12 cursor-pointer items-center justify-center 
                         rounded-full border-2 border-primary1 text-primary1 
                         overflow-hidden transition-all duration-300 ease-in-out 
                         active:scale-95 hover:shadow-md  before:absolute before:inset-0 
                         before:bg-gradient-to-r before:from-transparent 
                         before:via-white/40 before:to-transparent 
                         before:translate-x-[-100%] hover:before:translate-x-[100%] 
                         before:transition-transform before:duration-700"
            >
              <Home className="h-6 w-6" />
            </button>
          </div>

          {/* Title Section with Toggle */}
          <div className="mb-16 text-center relative">
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
              from ICpEP Student Edition R7 CIT-U Chapter.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-16 flex justify-center">
            <div className="flex space-x-1 rounded-xl bg-primary1/10 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative w-full rounded-lg px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-rubik font-semibold transition-colors duration-300 ease-in-out cursor-pointer
                    ${
                      activeTab === tab
                        ? "bg-white text-primary1 shadow"
                        : "text-primary1/60 hover:bg-white/60"
                    }
                  `}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-1/3 bg-primary1"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="space-y-12">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[25px] shadow-lg shadow-gray-300 overflow-hidden mb-10 max-w-4xl mx-auto h-auto md:h-80 transition-all duration-300 ease-in-out"
                >
                  <div className="md:flex h-full">
                    <div className="md:w-1/3 h-48 md:h-full bg-gray-100">
                      <div className="w-full h-full object-cover animate-pulse" />
                    </div>

                    <div className="md:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
                      <div>
                        <div className="mb-3 sm:mb-4">
                          <div className="inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-[10px] text-xs sm:text-sm bg-gray-200 w-28 h-6 animate-pulse" />
                        </div>

                        <div className="mb-2 sm:mb-3 h-6 bg-gray-200 rounded w-3/4 animate-pulse" />

                        <div className="font-raleway text-gray-700 text-sm sm:text-base mb-2 sm:mb-4 leading-relaxed">
                          <div className="h-4 bg-gray-100 rounded mb-2 w-full animate-pulse" />
                          <div className="h-4 bg-gray-100 rounded mb-2 w-5/6 animate-pulse" />
                          <div className="h-4 bg-gray-100 rounded mb-2 w-4/6 animate-pulse" />
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16">
              <p className="font-raleway text-lg text-red-500">{error}</p>
            </div>
          )}

          {/* Announcements List */}
          {!loading && !error && (
            <div className="pb-14">
              {filteredAnnouncements.length > 0 ? (
                <div className="space-y-12">
                  {filteredAnnouncements.map((announcement, index) => (
                    // --- 3. PASS PROPS ---
                    <AnnouncementCard
                      key={announcement._id}
                      id={announcement._id}
                      title={announcement.title}
                      description={announcement.description}
                      content={announcement.content}
                      type={
                        announcement.type as "News" | "Meeting" | "Achievement"
                      }
                      imageUrl={announcement.imageUrl || undefined}
                      date={announcement.publishDate}
                      onClick={() => handleAnnouncementClick(announcement)}
                      edit={editMode} // Pass edit state
                      index={index} // Pass index for stagger
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="font-raleway text-lg text-gray-500">
                    {activeTab === "All"
                      ? "No announcements yet."
                      : `No ${activeTab.toLowerCase()} announcements yet.`}
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="w-full flex justify-end mt-8">
            <button
              onClick={toggleEdit}
              className={`mt-10 group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-rubik font-semibold transition-all duration-300 ${
                editMode
                  ? "bg-primary1 text-white shadow-lg shadow-primary1/30 scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Sparkles
                size={18}
                className={`transition-transform duration-300 ${
                  editMode ? "animate-spin-slowmo" : ""
                }`}
              />
              <span>{editMode ? "Edit Mode: ON" : "Activate Edit"}</span>
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
