"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

// --- Helper Components ---
const EventTag = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-buttonbg1 text-primary3 font-raleway font-semibold px-3 py-1 rounded-full text-sm">
    {children}
  </span>
);

const InfoDetailRow = ({
  icon,
  line1,
  line2,
}: {
  icon: React.ReactNode;
  line1: string;
  line2: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-buttonbg1 rounded-lg flex items-center justify-center text-primary1 text-2xl flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="font-raleway font-semibold text-primary3 leading-tight">
        {line1}
      </p>
      <p className="font-raleway text-bodytext leading-tight">{line2}</p>
    </div>
  </div>
);

const CountdownPill = ({ days, hours }: { days: number; hours: number }) => (
  <div className="bg-green-100 text-green-800 font-raleway font-semibold px-4 py-2 rounded-full text-sm text-center whitespace-nowrap">
    Starting in {days}d {hours}h
  </div>
);

export default function EventPage() {
  // --- IMPORTANT: To see the "post-event" layout, change `false` to `true` here ---
  const [isEventOver, setIsEventOver] = useState(true);
  // ---------------------------------------------------------------------------------

  const [hasRsvpd, setHasRsvpd] = useState(false);

  // --- Event Configuration ---
  const eventMode = "Online"; // Change to "Onsite" to see the pin icon and a different location
  const isOnline = eventMode === "Online";
  const eventLocation = isOnline ? "Google Meet" : "123 Tech Avenue, Innovation City";


  // Set event date (example)
  const eventDate = new Date(
    Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
  ); // 5 days, 3 hours from now

  const calculateTimeLeft = () => {
    const difference = +eventDate - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  });

  // Example formatting based on current date + offset
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eventPhotos = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578899952109-a7a5529a5a5b?w=500&auto=format&fit=crop",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden font-sans">
      {/* Background Blushes */}
      <div className="absolute top-[-10rem] left-[-15rem] w-[35rem] h-[35rem] bg-primary1/20 rounded-full filter blur-3xl opacity-90 animate-blob-1"></div>
      <div className="absolute top-1/4 right-[-18rem] w-[35rem] h-[35rem] bg-secondary2/20 rounded-full filter blur-3xl opacity-90 animate-blob-2"></div>
      <div className="absolute bottom-[-15rem] left-1/4 w-[35rem] h-[35rem] bg-primary3/15 rounded-full filter blur-3xl opacity-80 animate-blob-3"></div>
      <div className="absolute bottom-[-5rem] right-[-5rem] w-[25rem] h-[25rem] bg-secondary3/15 rounded-full filter blur-3xl opacity-80 animate-blob-4"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* --- Left Column (Narrower & STICKY) --- */}
            <div className="lg:col-span-2 lg:sticky lg:top-8 h-fit space-y-6 order-2 lg:order-1">
              <div className="aspect-square w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop"
                  alt="Event Banner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <EventTag>AI</EventTag>
                <EventTag>Workshop</EventTag>
                <EventTag>No-Code</EventTag>
                <EventTag>Blockchain</EventTag>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-primary1 rounded-full flex items-center justify-center text-white font-rubik text-2xl font-bold flex-shrink-0">
                    SD
                  </div>
                  <div>
                    <h3 className="font-rubik font-bold text-lg text-primary3">
                      START DOST
                    </h3>
                    <p className="font-raleway text-sm text-bodytext">
                      Event Organizer
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-transparent border border-primary1 text-primary1 hover:bg-primary1 hover:text-white font-raleway font-semibold py-2 px-4 rounded-lg transition-all cursor-pointer">
                    Contact Host
                  </button>
                  <button className="w-full bg-transparent border border-gray-400 text-gray-600 hover:bg-gray-100 font-raleway font-semibold py-2 px-4 rounded-lg transition-all cursor-pointer">
                    Report Event
                  </button>
                </div>
              </div>
            </div>

            {/* --- Right Column (Wider & SCROLLABLE) --- */}
            <div className="lg:col-span-3 space-y-8 order-1 lg:order-2">
              {/* Event Title & Deets (No Container) */}
              <div>
                <div
                  className={`font-raleway font-semibold text-sm inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full ${
                    isEventOver
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isEventOver ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></div>
                  {isEventOver ? "Event Ended" : "Registration Open"}
                </div>
                <h1 className="font-rubik text-4xl font-bold text-primary3 mb-8 leading-tight">
                  Vibe Coding: OpenXAI Foundations Workshop
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoDetailRow
                    icon="📅"
                    line1={formattedDate}
                    line2="7:00 PM - 10:00 PM PST"
                  />
                  <InfoDetailRow
                    icon={isOnline ? "💻" : "📍"}
                    line1={eventMode}
                    line2={eventLocation}
                  />
                </div>
              </div>

              {/* Call to Action (RSVP Card) */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg transition-all duration-300">
                {isEventOver ? (
                  <div className="text-center">
                    <h2 className="font-rubik font-bold text-2xl text-primary3">
                      Registration Closed
                    </h2>
                    <p className="font-raleway text-bodytext mt-2">
                      This event is not currently taking registrations. Stay
                      tuned for the next one!
                    </p>
                  </div>
                ) : hasRsvpd ? (
                  <div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src="https://i.pravatar.cc/150?img=32"
                          alt="User"
                          className="w-14 h-14 rounded-full border-2 border-green-500 p-0.5"
                        />
                        <div>
                          <h2 className="font-rubik font-bold text-2xl text-green-700 leading-none">
                            You're In!
                          </h2>
                        </div>
                      </div>
                      <CountdownPill
                        days={timeLeft.days}
                        hours={timeLeft.hours}
                      />
                    </div>
                    <p className="font-raleway text-sm text-gray-500 mt-6 text-center border-t border-gray-100 pt-4">
                      No longer able to attend? Notify the host by{" "}
                      <button
                        onClick={() => setHasRsvpd(false)}
                        className="text-primary1 font-medium underline hover:text-primary2 transition-colors cursor-pointer"
                      >
                        cancelling your registration
                      </button>
                      .
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="font-raleway text-lg text-bodytext mb-6">
                      Welcome! To join the event, please register below.
                    </p>
                    <button
                      onClick={() => setHasRsvpd(true)}
                      className="w-full bg-primary1 hover:bg-primary2 text-white font-raleway font-bold py-4 rounded-xl transition-all text-xl shadow-lg hover:shadow-primary1/40 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      RSVP Now
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm font-raleway text-gray-600">
                      <div className="flex -space-x-2">
                        <img
                          className="w-6 h-6 rounded-full border-2 border-white"
                          src="https://i.pravatar.cc/100?img=1"
                          alt=""
                        />
                        <img
                          className="w-6 h-6 rounded-full border-2 border-white"
                          src="https://i.pravatar.cc/100?img=2"
                          alt=""
                        />
                        <img
                          className="w-6 h-6 rounded-full border-2 border-white"
                          src="https://i.pravatar.cc/100?img=3"
                          alt=""
                        />
                      </div>
                      <p>
                        <span className="font-bold text-primary3">105</span>{" "}
                        people have already registered
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Full Details */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                <h2 className="font-rubik text-2xl font-bold text-primary3 mb-4 pb-2 border-b border-gray-100">
                  Details
                </h2>
                <div className="prose prose-lg max-w-none font-raleway text-bodytext">
                  <p>
                    The{" "}
                    <strong>Vibe Coding: OpenXAI Foundations Workshop</strong>{" "}
                    is a <strong>FREE</strong> two-part hands-on training for
                    DOST Scholars. It introduces the fundamentals of OpenXAI and
                    its no-code framework.
                  </p>
                  <p className="mt-4 font-semibold">Topics Covered:</p>
                  <ul className="mt-0">
                    <li>No-code development approach</li>
                    <li>Introduction to OpenXAI concepts</li>
                    <li>Hands-on scenario demonstration</li>
                    <li>Pathway to blockchain applications</li>
                  </ul>
                  <p className="mt-4 font-semibold">Requirements:</p>
                  <ul className="mt-0">
                    <li>Open to all DOST Scholars</li>
                    <li>
                      Development environment setup (instructions provided upon
                      registration)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Gallery */}
              {isEventOver && (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                  <h2 className="font-rubik text-2xl font-bold text-primary3 mb-4 pb-2 border-b border-gray-100">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {eventPhotos.slice(0, 2).map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <img
                          src={photo}
                          alt={`Event photo ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                    {eventPhotos.length > 2 && (
                      <div className="aspect-square rounded-xl overflow-hidden relative shadow-sm cursor-pointer group">
                        <img
                          src={eventPhotos[2]}
                          alt="More photos"
                          className="w-full h-full object-cover filter blur-sm group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                          <span className="font-rubik text-white text-2xl font-bold">
                            +{eventPhotos.length - 2}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}