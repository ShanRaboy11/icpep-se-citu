"use client";
import { events } from "./data/event";
import Header from "../components/header";
import Footer from "../components/footer";
import EventCard from "./event-card";
export default function EventsListPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 pt-38 pb-16">
        {/* Page Header */}
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
            Browse our upcoming and past events. Click on an event to see more
            details.
          </p>
        </div>
        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
