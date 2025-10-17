"use client";

import { useRouter } from "next/navigation";
import { events, Event } from "./utils/event"; // Import the base Event type
import Header from "../components/header";
import Footer from "../components/footer";
import EventCard from "./event-card";
import Grid from "../components/grid";
import { ArrowLeft } from "lucide-react";

// Define a new type for our processed event
type ProcessedEvent = Event & {
  status: "Upcoming" | "Ongoing" | "Ended";
};

export default function EventsListPage() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  // --- MODIFICATION: Dynamic status calculation and sorting ---
  const now = new Date();

  // 1. Map over raw events to add the dynamic status
  const processedEvents: ProcessedEvent[] = events.map((event) => {
    const startDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    let status: ProcessedEvent["status"];
    if (now < startDate) {
      status = "Upcoming";
    } else if (now >= startDate && now <= endDate) {
      status = "Ongoing";
    } else {
      status = "Ended";
    }

    return { ...event, status };
  });

  // 2. Sort the processed events
  const sortedEvents = processedEvents.sort((a, b) => {
    const statusOrder = { Upcoming: 1, Ongoing: 2, Ended: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }

    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return a.status === "Upcoming" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12">
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

          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                Chapter Activities
              </span>
            </div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              Our Events
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Explore our lineup of events and find your next opportunity to
              part of the excitement, connect, learn, and grow.
            </p>
          </div>

          {/* --- MODIFICATION: Map over the new `sortedEvents` array --- */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {/* Map over the new `sortedEvents` array */}
            {sortedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
