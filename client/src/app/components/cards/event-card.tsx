"use client";

import Link from "next/link";
import { Event } from "@/app/events/utils/event";
import { CalendarPlus } from "lucide-react";

interface Props {
  event: Event;
  // onRSVP prop is no longer needed
}

export default function EventCard({ event }: Props) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // The handleRsvpClick function is no longer needed

  return (
    // The main card is the `group` that triggers the animation
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-primary1/40 hover:-translate-y-1">
      <Link
        href={`/events/${event.id}`}
        className="relative h-48 flex-shrink-0 overflow-hidden block"
      >
        <img
          src={event.bannerImageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* --- FIX: Changed <button> to a non-clickable <div> and removed click-related styles --- */}
        <div
          className="absolute top-3 right-3 z-10 flex h-9 items-center rounded-full bg-black/50 px-2.5 text-white backdrop-blur-sm transition-colors duration-300 ease-in-out group-hover:bg-primary1"
        >
          {/* Icon is always visible and perfectly centered */}
          <CalendarPlus size={20} className="flex-shrink-0" />

          {/* Text animates smoothly in both directions */}
          <span
            className="font-raleway whitespace-nowrap text-sm font-semibold opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs group-hover:ml-1.5 transition-[max-width,opacity,margin] duration-300 ease-in-out"
          >
            RSVP
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Link href={`/events/${event.id}`} className="flex-grow block">
          <p className="font-raleway text-sm font-medium text-primary1">
            {formattedDate}
          </p>
          <h3 className="font-rubik mt-2 text-xl font-bold text-primary3">
            {event.title}
          </h3>
          <p className="font-raleway mt-3 text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-buttonbg1 px-2 py-1 text-xs font-raleway font-semibold text-primary3"
              >
                {tag}
              </span>
            ))}
          </div>
        </Link>
      </div>
    </div>
  );
}