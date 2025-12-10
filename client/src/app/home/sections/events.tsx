"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Event } from "@/app/events/utils/event";
import EventCard from "@/app/home/components/event-card";
import ParticleNetwork from "@/app/home/components/particle";
import eventService from "@/app/services/event";

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
            sort: 'eventDate',
            startDate: new Date().toISOString() 
        });
        
        if (response.success && Array.isArray(response.data)) {
             const mapped = response.data.map((item: any) => ({
                 id: item.id || item._id,
                 title: item.title,
                 status: "Upcoming",
                 date: item.eventDate || item.date || new Date().toISOString(),
                 endDate: item.endDate,
                 mode: item.mode || "Onsite",
                 location: item.location || "TBA",
                 organizer: {
                     name: item.organizer || "ICpEP.SE CIT-U",
                     avatarImageUrl: "/icpep logo.png"
                 },
                 tags: item.tags || [],
                 bannerImageUrl: item.coverImage || item.imageUrl || "/placeholder.png",
                 description: item.description || "",
                 content: item.content,
                 details: [],
                 galleryImageUrls: item.galleryImages || []
             }));
             setEvents(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
      return (
        <section className="light-dark-background relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
            <div className="relative z-10 w-full max-w-7xl mx-auto transform -translate-y-8 text-center">
                <p className="text-gray-500 font-raleway">Loading events...</p>
            </div>
        </section>
      );
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
            Upcoming Events
          </h1>
          <p className="relative font-raleway text-base sm:text-lg text-bodytext mt-2 max-w-lg mx-auto">
            Join the network and explore what’s next.
          </p>
        </div>

        {events.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-gray-500 font-raleway text-lg">No upcoming events scheduled.</p>
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
