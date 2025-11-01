"use client";

import { useRouter } from "next/navigation";
import { events, Event } from "@/app/events/utils/event";
import EventCard from "@/app/components/cards/event-card";
import ParticleNetwork from "@/app/home/components/particle";

export function EventsSection() {
  const router = useRouter();
  const now = new Date();

  const latestUpcomingEvents = events
    .filter((event) => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
          {latestUpcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

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
