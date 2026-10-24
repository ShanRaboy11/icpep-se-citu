"use client";

import { EventCardSkeleton } from "@/app/components/feedback/skeleton-cards";
import { useRouter } from "next/navigation";
import { Event } from "@/app/utils/events/event";
import EventCard from "@/app/components/events/event-card";
import eventService from "@/app/services/event";
import Button from "@/app/components/ui/button";
import { SkeletonGate } from "@/app/components/feedback/skeleton";
import { useCachedFetch } from "@/app/hooks/use-cached-fetch";

const fetchFeaturedEvents = async (): Promise<Event[]> => {
  const response = await eventService.getEvents({
    isPublished: true,
    limit: 3,
    sort: "-eventDate",
  });
  if (!response.success || !Array.isArray(response.data)) return [];
  return response.data.map((item: any) => ({
    id: item.id || item._id,
    title: item.title,
    status: new Date(item.eventDate) > new Date() ? "Upcoming" : "Ended",
    date: item.eventDate || item.date || new Date().toISOString(),
    endDate: item.endDate,
    mode: (item.mode === "Online" ? "Online" : "Onsite") as "Online" | "Onsite",
    location: item.location || "TBA",
    organizer: {
      name:
        typeof item.organizer === "string"
          ? item.organizer
          : item.organizer?.name || "ICpEP.SE CIT-U",
      avatarImageUrl: "/brand/icpep-logo.avif",
    },
    tags: item.tags || [],
    bannerImageUrl: item.coverImage || item.imageUrl || "/placeholders/placeholder.svg",
    description: item.description || "",
    content: item.content,
    details: [],
    galleryImageUrls: item.galleryImages || [],
  }));
};

const CARD_WIDTH = "w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)]";

export function EventsSection() {
  const router = useRouter();
  const { data, loading } = useCachedFetch("home-events", fetchFeaturedEvents);
  const events = data ?? [];

  return (
    <section className="light-dark-background relative flex items-center justify-center overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
      <div className="relative z-10 w-full max-w-7xl mx-auto transform -translate-y-8">
        <div className="mb-12 md:mb-16 text-center relative">
          <h2 className="relative font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight">
            Featured Events
          </h2>
          <p className="relative font-raleway text-base sm:text-lg text-bodytext mt-2 max-w-lg mx-auto">
            Stay updated with our past and upcoming activities.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-stretch gap-8">
          {loading ? (
            <SkeletonGate loading>
              {[1, 2, 3].map((i) => (
                <EventCardSkeleton key={i} className={CARD_WIDTH} />
              ))}
            </SkeletonGate>
          ) : events.length === 0 ? (
            <div className="w-full text-center py-10">
              <p className="text-gray-500 font-raleway text-lg">
                No events available at the moment.
              </p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className={`${CARD_WIDTH} flex`}>
                <EventCard event={event} />
              </div>
            ))
          )}
        </div>

        <div
          className={`flex justify-center ${
            !loading && events.length === 0 ? "mt-10" : "mt-16"
          }`}
        >
          <Button variant="hero" onClick={() => router.push("/events")}>
            Discover More
          </Button>
        </div>
      </div>
    </section>
  );
}
