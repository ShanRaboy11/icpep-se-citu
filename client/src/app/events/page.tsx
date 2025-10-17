"use client";

import { useRouter } from "next/navigation";
import { events } from "./utils/event";
import Header from "../components/header";
import Footer from "../components/footer";
import EventCard from "./event-card";
import Grid from "../components/grid";
import { ArrowLeft } from "lucide-react";

export default function EventsListPage() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  // --- MODIFICATION: Added custom sorting logic ---
  const sortedEvents = [...events].sort((a, b) => {
    // 1. Define the order of the statuses
    const statusOrder = { Upcoming: 1, Ongoing: 2, Ended: 3 };

    const statusA = statusOrder[a.status];
    const statusB = statusOrder[b.status];

    // 2. If statuses are different, sort by status order
    if (statusA !== statusB) {
      return statusA - statusB;
    }

    // 3. If statuses are the same, sort by date
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    // For "Upcoming" events, show the soonest first (ascending date)
    if (a.status === "Upcoming") {
      return dateA - dateB;
    }

    // For "Ongoing" and "Ended" events, show the most recent first (descending date)
    return dateB - dateA;
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
