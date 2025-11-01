"use client";

import { useRouter } from "next/navigation";
import { GlassCard } from "../components/glass-card";
import FeaturedAnnouncementCard from "../components/featured-announcement";
import MiniAnnouncementCard from "../components/mini-announcement";
import { announcements } from "../../announcements/utils/announcements";

export function AnnouncementsSection() {
  const router = useRouter();

  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latestAnnouncement = sortedAnnouncements[0];
  const otherAnnouncements = sortedAnnouncements.slice(1, 4);

  return (
    <section className="dark-light-background relative overflow-hidden py-28 px-4 sm:px-6">
      <div className="relative z-10 mx-auto max-w-7xl transform -translate-y-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-4 text-center mb-12 sm:flex-row sm:text-left">
          <div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight">
              Latest Announcements
            </h1>
            <p className="font-raleway text-base sm:text-lg text-bodytext mt-2 max-w-lg">
              Be in the loop with the latest from our chapter.
            </p>
          </div>

          <div className="hidden sm:block">
            <button
              onClick={() => router.push("/announcements")}
              className="bg-primary1 hover:bg-primary2 text-white font-raleway font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer w-[220px] sm:w-auto"
            >
              View All
            </button>
          </div>
        </div>

        {/* Featured Announcement */}
        {latestAnnouncement && (
          <GlassCard>
            <FeaturedAnnouncementCard announcement={latestAnnouncement} />
          </GlassCard>
        )}

        {/* Grid of Smaller Cards */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr items-stretch content-stretch">
          {otherAnnouncements.map((announcement) => (
            <GlassCard key={announcement.id}>
              <MiniAnnouncementCard announcement={announcement} />
            </GlassCard>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center sm:hidden">
          <button
            onClick={() => router.push("/announcements")}
            className="bg-primary1 hover:bg-primary2 text-white font-raleway font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
          >
            View All
          </button>
        </div>
      </div>
    </section>
  );
}
