"use client";

import { useRouter } from "next/navigation";
import { GlassCard } from "../../components/glass-card";
import FeaturedAnnouncementCard from "../components/featured-announcement";
import MiniAnnouncementCard from "../components/mini-announcement";
import announcementService from "@/app/services/announcement";
import { Announcement } from "../../announcements/utils/announcements";
import Button from "../../components/button";
import { Skeleton, SkeletonGate } from "@/app/components/skeleton";
import { useCachedFetch } from "@/app/utils/cached-fetch";

const fetchLatestAnnouncements = async (): Promise<Announcement[]> => {
  const response = await announcementService.getAnnouncements({
    isPublished: true,
    limit: 4,
    sort: "-publishDate",
  });
  if (!response.success || !Array.isArray(response.data)) return [];
  return response.data.map((item: any) => ({
    id: item.id || item._id,
    title: item.title,
    description: item.description || "",
    date: item.date || item.publishDate || new Date().toISOString(),
    type: item.type,
    imageUrl: item.imageUrl,
    time: item.time,
    location: item.location,
  }));
};

export function AnnouncementsSection() {
  const router = useRouter();
  const { data, loading } = useCachedFetch("home-announcements", fetchLatestAnnouncements);
  const announcements = data ?? [];

  return (
    <section className="dark-light-background relative overflow-hidden py-28 px-4 sm:px-6">
      <div className="relative z-10 mx-auto max-w-7xl transform -translate-y-8">
        <div className="flex flex-col items-center justify-between gap-4 text-center mb-12 sm:flex-row sm:text-left">
          <div>
            <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight">
              Latest Announcements
            </h2>
            <p className="font-raleway text-base sm:text-lg text-bodytext mt-2 max-w-lg">
              Be in the loop with the latest from our chapter.
            </p>
          </div>

          <div className="hidden sm:block">
            <Button
              variant="hero"
              onClick={() => router.push("/announcements")}
              className="w-55 px-8 py-3 sm:w-auto"
            >
              View All
            </Button>
          </div>
        </div>

        {loading ? (
          <SkeletonGate loading>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <GlassCard variant="roomy" key={i}>
                  <Skeleton className="h-64 w-full rounded-xl" />
                </GlassCard>
              ))}
            </div>
          </SkeletonGate>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-raleway text-lg">
              No announcements available at the moment.
            </p>
          </div>
        ) : announcements.length === 1 ? (
          <GlassCard variant="roomy">
            <FeaturedAnnouncementCard announcement={announcements[0]} />
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2">
            {announcements.map((announcement, index) => (
              <div
                key={announcement.id}
                className={
                  announcements.length % 2 === 1 && index === announcements.length - 1
                    ? "sm:col-span-2 sm:w-[calc(50%-1rem)] sm:justify-self-center"
                    : ""
                }
              >
                <GlassCard variant="roomy">
                  <MiniAnnouncementCard announcement={announcement} />
                </GlassCard>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center sm:hidden">
          <Button variant="hero" onClick={() => router.push("/announcements")}>
            View All
          </Button>
        </div>
      </div>
    </section>
  );
}
