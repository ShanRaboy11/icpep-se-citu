"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { GlassCard } from "../components/glass-card";
import FeaturedAnnouncementCard from "../components/featured-announcement";
import MiniAnnouncementCard from "../components/mini-announcement";
import announcementService from "@/app/services/announcement";
import {
  Announcement,
  announcements as staticAnnouncements,
} from "../../announcements/utils/announcements";

// Shimmer animation style injected once
const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -800px 0; }
    100% { background-position: 800px 0; }
  }
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 0px,
      rgba(255,255,255,0.10) 40px,
      rgba(255,255,255,0.04) 80px
    );
    background-size: 800px 100%;
    animation: shimmer 1.6s infinite linear;
  }
`;

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton-shimmer rounded-lg bg-white/5 ${className}`} />
  );
}

function FeaturedAnnouncementSkeleton() {
  return (
    <GlassCard>
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Image placeholder */}
        <SkeletonBlock className="w-full lg:w-2/5 h-56 lg:h-72 rounded-xl flex-shrink-0" />

        {/* Text content */}
        <div className="flex flex-col justify-between flex-1 gap-4">
          <div className="flex flex-col gap-3">
            {/* Badge / type tag */}
            <SkeletonBlock className="w-24 h-6 rounded-full" />
            {/* Title */}
            <SkeletonBlock className="w-full h-8 rounded-md" />
            <SkeletonBlock className="w-4/5 h-8 rounded-md" />
            {/* Description lines */}
            <SkeletonBlock className="w-full h-4 rounded-md mt-2" />
            <SkeletonBlock className="w-full h-4 rounded-md" />
            <SkeletonBlock className="w-3/4 h-4 rounded-md" />
          </div>
          {/* Meta row: date + location */}
          <div className="flex items-center gap-4 mt-2">
            <SkeletonBlock className="w-32 h-4 rounded-md" />
            <SkeletonBlock className="w-28 h-4 rounded-md" />
          </div>
          {/* CTA button */}
          <SkeletonBlock className="w-36 h-10 rounded-full mt-2" />
        </div>
      </div>
    </GlassCard>
  );
}

function MiniAnnouncementSkeleton() {
  return (
    <GlassCard>
      <div className="flex flex-col gap-4 p-5">
        {/* Image placeholder */}
        <SkeletonBlock className="w-full h-40 rounded-xl" />
        {/* Badge */}
        <SkeletonBlock className="w-20 h-5 rounded-full" />
        {/* Title */}
        <SkeletonBlock className="w-full h-5 rounded-md" />
        <SkeletonBlock className="w-3/4 h-5 rounded-md" />
        {/* Description */}
        <SkeletonBlock className="w-full h-4 rounded-md" />
        <SkeletonBlock className="w-5/6 h-4 rounded-md" />
        {/* Date */}
        <SkeletonBlock className="w-28 h-4 rounded-md mt-1" />
      </div>
    </GlassCard>
  );
}

function AnnouncementsSkeleton() {
  return (
    <section className="dark-light-background relative overflow-hidden py-28 px-4 sm:px-6">
      <style>{shimmerStyle}</style>
      <div className="relative z-10 mx-auto max-w-7xl transform -translate-y-8">
        {/* Header skeleton */}
        <div className="flex flex-col items-center justify-between gap-4 mb-12 sm:flex-row">
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <SkeletonBlock className="w-72 h-10 rounded-md" />
            <SkeletonBlock className="w-56 h-5 rounded-md" />
          </div>
          <SkeletonBlock className="hidden sm:block w-28 h-11 rounded-full" />
        </div>

        {/* Featured card skeleton */}
        <FeaturedAnnouncementSkeleton />

        {/* Mini cards skeleton */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr items-stretch">
          <MiniAnnouncementSkeleton />
          <MiniAnnouncementSkeleton />
          <MiniAnnouncementSkeleton />
        </div>

        {/* Mobile button skeleton */}
        <div className="mt-8 flex justify-center sm:hidden">
          <SkeletonBlock className="w-28 h-11 rounded-full" />
        </div>
      </div>
    </section>
  );
}

export function AnnouncementsSection() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await announcementService.getAnnouncements({
          isPublished: true,
          limit: 4,
          sort: "-publishDate",
        });
        if (
          response.success &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const mapped = response.data.map((item: any) => ({
            id: item.id || item._id,
            title: item.title,
            description: item.description || "",
            date: item.date || item.publishDate || new Date().toISOString(),
            type: item.type,
            imageUrl: item.imageUrl || "/placeholder.png",
            time: item.time,
            location: item.location,
          }));
          setAnnouncements(mapped);
        } else {
          setAnnouncements(staticAnnouncements);
        }
      } catch (error) {
        console.error(
          "Failed to fetch announcements, using static data",
          error,
        );
        setAnnouncements(staticAnnouncements);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) {
    return <AnnouncementsSkeleton />;
  }

  const latestAnnouncement = announcements[0];
  const otherAnnouncements = announcements.slice(1, 4);

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

        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-raleway text-lg">
              No announcements available at the moment.
            </p>
          </div>
        ) : (
          <>
            {latestAnnouncement && (
              <GlassCard>
                <FeaturedAnnouncementCard announcement={latestAnnouncement} />
              </GlassCard>
            )}

            {otherAnnouncements.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr items-stretch content-stretch">
                {otherAnnouncements.map((announcement) => (
                  <GlassCard key={announcement.id}>
                    <MiniAnnouncementCard announcement={announcement} />
                  </GlassCard>
                ))}
              </div>
            )}
          </>
        )}

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
