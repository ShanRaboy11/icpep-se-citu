"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Event } from "@/app/events/utils/event";
import EventCard from "@/app/home/components/event-card";
import ParticleNetwork from "@/app/home/components/particle";
import eventService from "@/app/services/event";

// Shimmer animation style
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

function EventCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex flex-col">
      {/* Banner image placeholder */}
      <SkeletonBlock className="w-full h-48 rounded-none" />

      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Status badge + mode badge row */}
        <div className="flex items-center gap-2">
          <SkeletonBlock className="w-20 h-5 rounded-full" />
          <SkeletonBlock className="w-16 h-5 rounded-full" />
        </div>

        {/* Title */}
        <SkeletonBlock className="w-full h-6 rounded-md" />
        <SkeletonBlock className="w-3/4 h-6 rounded-md" />

        {/* Date row */}
        <div className="flex items-center gap-2 mt-1">
          <SkeletonBlock className="w-4 h-4 rounded-sm" />
          <SkeletonBlock className="w-36 h-4 rounded-md" />
        </div>

        {/* Location row */}
        <div className="flex items-center gap-2">
          <SkeletonBlock className="w-4 h-4 rounded-sm" />
          <SkeletonBlock className="w-28 h-4 rounded-md" />
        </div>

        {/* Tags row */}
        <div className="flex items-center gap-2 mt-1">
          <SkeletonBlock className="w-14 h-5 rounded-full" />
          <SkeletonBlock className="w-18 h-5 rounded-full" />
          <SkeletonBlock className="w-12 h-5 rounded-full" />
        </div>

        {/* Organizer row at bottom */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
          <SkeletonBlock className="w-8 h-8 rounded-full flex-shrink-0" />
          <SkeletonBlock className="w-32 h-4 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function EventsSkeleton() {
  return (
    <section className="light-dark-background relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
      <style>{shimmerStyle}</style>

      <div className="relative z-10 w-full max-w-7xl mx-auto transform -translate-y-8">
        {/* Header skeleton */}
        <div className="mb-12 md:mb-16 flex flex-col items-center gap-3">
          <SkeletonBlock className="w-56 h-10 rounded-md" />
          <SkeletonBlock className="w-72 h-5 rounded-md" />
        </div>

        {/* 3-column card skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>

        {/* CTA button skeleton */}
        <div className="mt-16 flex justify-center">
          <SkeletonBlock className="w-40 h-11 rounded-full" />
        </div>
      </div>
    </section>
  );
}

export function EventsSection() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getEvents({
          isPublished: true,
          limit: 3,
          sort: "-eventDate",
        });

        if (
          response.success &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const mapped: Event[] = response.data.map((item: any) => {
            const now = new Date();
            const startDate = new Date(item.eventDate || item.date);
            const endDate = item.endDate ? new Date(item.endDate) : startDate;

            let status: "Upcoming" | "Ongoing" | "Ended" = "Ended";
            if (now < startDate) {
              status = "Upcoming";
            } else if (now >= startDate && now <= endDate) {
              status = "Ongoing";
            }

            return {
              id: item.id || item._id,
              title: item.title,
              status: status,
              date: item.eventDate || item.date || new Date().toISOString(),
              endDate: item.endDate,
              mode: (item.mode === "Online" ? "Online" : "Onsite") as
                | "Online"
                | "Onsite",
              location: item.location || "TBA",
              organizer: {
                name:
                  typeof item.organizer === "string"
                    ? item.organizer
                    : item.organizer?.name || "ICpEP.SE CIT-U",
                avatarImageUrl: "/icpep logo.png",
              },
              tags: item.tags || [],
              bannerImageUrl:
                item.coverImage || item.imageUrl || "/placeholder.png",
              description: item.description || "",
              content: item.content,
              details: [],
              galleryImageUrls: item.galleryImages || [],
            };
          });
          setEvents(mapped);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <EventsSkeleton />;
  }

  return (
    <section className="light-dark-background relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
      <div className="absolute inset-0 flex items-center justify-center top-[60px] hidden sm:flex">
        <ParticleNetwork className="[mask-image:radial-gradient(ellipse_45%_50%_at_50%_55%,transparent_35%,white_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto transform -translate-y-8">
        <div className="mb-12 md:mb-16 text-center relative">
          <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[220px] h-[130px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_70%)] pointer-events-none" />
          <h1 className="relative font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight">
            Latest Events
          </h1>
          <p className="relative font-raleway text-base sm:text-lg text-bodytext mt-2 max-w-lg mx-auto">
            Stay updated with our past and upcoming activities.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-raleway text-lg">
              No events found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <button
            onClick={() => router.push("/events")}
            className="bg-primary1 hover:bg-primary2 text-white font-raleway font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
          >
            Discover More
          </button>
        </div>
      </div>
    </section>
  );
}
