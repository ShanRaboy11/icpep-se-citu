"use client";

import Link from "next/link";
import { useState } from "react";
import FallbackImage from "@/app/components/ui/fallback-image";
import { Skeleton } from "@/app/components/feedback/skeleton";
import type { Event } from "../../utils/events/event";

interface Props {
  event: Event & { status?: "Upcoming" | "Ongoing" | "Ended" };
}

const STATUS_STYLES = {
  Upcoming: "bg-green-100 text-green-800 ring-green-600/20",
  Ongoing: "bg-blue-100 text-blue-800 ring-blue-600/20",
  Ended: "bg-red-100 text-red-800 ring-red-600/20",
};

export default function EventCard({ event }: Props) {
  const [loaded, setLoaded] = useState(false);

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-primary1/40"
    >
      <div className="relative aspect-16/10 shrink-0 overflow-hidden bg-gray-100">
        {!loaded && <Skeleton className="absolute inset-0 h-full w-full rounded-none" />}
        <FallbackImage
          src={event.bannerImageUrl}
          alt={event.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {event.status && (
          <span
            className={`absolute top-3 right-3 rounded-full px-3 py-1 font-rubik text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[event.status]}`}
          >
            {event.status}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col bg-white p-6">
        <div>
          <p className="font-raleway text-sm font-medium text-primary1">{formattedDate}</p>
          <h3 className="mt-2 font-rubik text-xl font-bold text-primary3">{event.title}</h3>
          <p className="mt-3 line-clamp-2 font-raleway text-sm text-gray-600">{event.description}</p>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-buttonbg1 px-2 py-1 font-raleway text-xs font-semibold text-primary3"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
