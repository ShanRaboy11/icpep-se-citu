"use client";

import React, { useState, useRef } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";
import Grid from "@/app/components/grid";
import { GlassCard } from "@/app/home/components/glass-card";

import { useRouter } from "next/navigation";

type Event = {
  id: number;
  title: string;
  date: Date;
  description: string;
  tags?: string[];
  image?: string;
};

export default function EventCalendarPage() {
  const router = useRouter();
  const upcomingEventsRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Dummy events
  const events: Event[] = [
    {
      id: 1,
      title: "Board Meeting",
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 10),
      description: "Monthly board meeting to discuss upcoming plans.",
      tags: ["Meeting", "Internal"],
      image: "/meeting.png",
    },
    {
      id: 2,
      title: "Workshop",
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 18),
      description: "Technical workshop for members.",
      tags: ["Workshop", "Technical"],
      image: "/meeting.png",
    },
    {
      id: 3,
      title: "Board Meeting",
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 24),
      description: "Monthly board meeting to discuss upcoming plans.",
      tags: ["Meeting", "Internal"],
      image: "/meeting.png",
    },
  ];

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
    setSelectedEvent(null);
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
    setSelectedEvent(null);
  };

  const daysInMonth = Array.from(
    { length: endOfMonth.getDate() },
    (_, i) =>
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
  );

  const eventsThisMonth = events.filter(
    (e) =>
      e.date.getMonth() === currentMonth.getMonth() &&
      e.date.getFullYear() === currentMonth.getFullYear()
  );
  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12 mb-10">
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
              <Home className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                Monthly Events
              </span>
            </div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              Event Calendar
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Stay up-to-date with our upcoming events! Click on a day to view
              event details, explore the month’s schedule, and plan your
              participation.
            </p>
          </div>

          {/* Calendar */}
          <GlassCard className="mb-6">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4 sm:p-5 ">
              <button
                onClick={prevMonth}
                className="px-3 py-2 bg-primary1 text-white rounded-lg hover:bg-primary2 transition flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-6" />
              </button>

              <h2 className="text-xl sm:text-3xl font-rubik text-primary3 font-bold">
                {currentMonth.toLocaleString("default", { month: "long" })}{" "}
                {currentMonth.getFullYear()}
              </h2>

              <button
                onClick={nextMonth}
                className="px-3 py-2 bg-primary1 text-white rounded-lg hover:bg-primary2 transition flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-6" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6 text-center sm:p-5">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="font-raleway font-semibold text-gray-600 pb-5 sm:text-lg"
                >
                  {d}
                </div>
              ))}

              {Array.from({ length: startOfMonth.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {daysInMonth.map((day) => {
                const dayEvents = eventsThisMonth.filter(
                  (e) => e.date.getDate() === day.getDate()
                );
                return (
                  <div
                    key={day.toDateString()}
                    className="border border-[#cdefff] min-h-[80px] flex flex-col items-center justify-start p-1 rounded-xl hover:bg-gray-50 cursor-pointer transition bg-white"
                  >
                    <span className="text-md sm:text-lg font-semibold font-raleway ">
                      {day.getDate()}
                    </span>
                    {dayEvents.map((ev) => (
                      <span
                        key={ev.id}
                        onClick={() => {
                          upcomingEventsRef.current?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                        className="mt-1 w-full bg-primary1 text-white text-s rounded px-1 truncate cursor-pointer hover:bg-primary2 font-raleway"
                        title={ev.title}
                      >
                        {ev.title}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Upcoming Events Horizontal Cards */}
          <div ref={upcomingEventsRef} className="mt-20">
            <h3 className="text-2xl sm:text-4xl font-semibold text-primary3 my-4 font-rubik">
              Upcoming Events This Month
            </h3>
            <div className="h-[3px] bg-primary1 w-24 sm:w-full mt-3 mx-auto rounded-full mb-5" />
            {eventsThisMonth.length === 0 ? (
              <p className="text-gray-500">No events this month.</p>
            ) : (
              <div className="flex flex-wrap gap-4 overflow-x-auto pb-2">
                {eventsThisMonth.map((ev) => (
                  <div
                    key={ev.id}
                    className="group border border-[#cdefff] flex-shrink-0 mb-3 w-full overflow-hidden sm:w-[400px] bg-white rounded-2xl transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-primary1/40 hover:-translate-y-1"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 w-full sm:w-48 h-40 sm:h-auto relative">
                        <img
                          src={ev.image || "/placeholder.jpg"}
                          alt={ev.title}
                          className="w-full h-full object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none transition-transform duration-300 group-hover:scale-103"
                        />
                      </div>
                      <div className="p-4 flex flex-col justify-between">
                        <p className="text-sm text-blue-400 font-raleway">
                          {ev.date.toLocaleDateString(undefined, {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <h4 className="text-lg sm:text-xl font-bold font-rubik text-primary3 mt-1">
                          {ev.title}
                        </h4>
                        <p className="text-gray-600 font-raleway text-sm sm:text-base mt-2 line-clamp-3">
                          {ev.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {ev.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full font-raleway"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
