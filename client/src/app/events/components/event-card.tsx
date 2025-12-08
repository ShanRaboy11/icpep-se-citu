"use client";

import Link from "next/link";
import { useState } from "react";
import { Event } from "../utils/event";
import { Pencil } from "lucide-react"; // Import Pencil

interface Props {
  event: Event & { status?: "Upcoming" | "Ongoing" | "Ended" };
  edit?: boolean; // New Prop
  index?: number; // New Prop for staggering animation
}

export default function EventCard({ event, edit, index = 0 }: Props) {
  const defaultImg =
    event.bannerImageUrl ??
    (event as unknown as { image?: string }).image ??
    "/placeholder.svg";
  const [imgSrc, setImgSrc] = useState<string>(defaultImg);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset loaded state if image source changes
  if (imgSrc !== defaultImg && imgLoaded) {
    setImgLoaded(false);
    setImgSrc(defaultImg);
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getStatusStyles = (status?: "Upcoming" | "Ongoing" | "Ended") => {
    switch (status) {
      case "Upcoming":
        return "bg-green-100 text-green-800 ring-green-600/20";
      case "Ongoing":
        return "bg-blue-100 text-blue-800 ring-blue-600/20";
      case "Ended":
        return "bg-red-100 text-red-800 ring-red-600/20";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Logic: Destination URL
  // If editing, go to create page with ID. If not, go to details.
  const href = edit ? `/events/create?id=${event.id}` : `/events/${event.id}`;

  // Logic: Animation Staggering
  const animationStyle = edit ? { animationDelay: `${index * 0.1}s` } : {};

  return (
    <Link
      href={`/events/${event.id}`}
      onClick={(e) => {
        // If we want to block navigation for some reason we can,
        // but usually for edit we want to go through.
        if (edit) return;
      }}
      draggable="false"
      style={animationStyle}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg 
        transition-all duration-500 ease-in-out select-none
        ${
          edit
            ? "cursor-pointer edit shadow-primary1/20"
            : "hover:shadow-primary1/40 hover:-translate-y-1 cursor-pointer"
        }
      `}
    >
      <div className="relative h-48 flex-shrink-0 overflow-hidden bg-gray-100">
        {/* --- EDIT OVERLAY (Fades In) --- */}
        <div
          className={`absolute inset-0 bg-primary1/40 backdrop-blur-[2px] flex items-center justify-center z-20 transition-opacity duration-500 ease-in-out ${
            edit
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <div
            className={`bg-white text-primary1 p-3 rounded-full shadow-lg transform transition-transform duration-500 ${
              edit ? "scale-100" : "scale-50"
            }`}
          >
            <Pencil size={24} />
          </div>
        </div>

        {/* Image skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="h-full w-full animate-pulse bg-gray-200" />
          </div>
        )}

        <img
          src={imgSrc}
          alt={event.title}
          draggable="false"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setImgSrc("/placeholder.svg");
            setImgLoaded(true);
          }}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            imgLoaded && (edit || !edit) ? "group-hover:scale-105" : ""
          } ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Status Badge - Fades out in Edit Mode */}
        {event.status && (
          <span
            className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-rubik font-semibold ring-1 ring-inset transition-opacity duration-300 ${getStatusStyles(
              event.status
            )} ${edit ? "opacity-0" : "opacity-100"}`}
          >
            {event.status}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 bg-white relative">
        {/* Edit Text Overlay */}
        <div
          className={`absolute inset-0 bg-white/90 z-10 flex items-center justify-center transition-opacity duration-300 ${
            edit ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <span className="font-rubik font-bold text-primary1 text-lg">
            Edit Event Details
          </span>
        </div>

        <div>
          <p className="font-raleway text-sm font-medium text-primary1">
            {formattedDate}
          </p>
          <h3 className="font-rubik mt-2 text-xl font-bold text-primary3">
            {event.title}
          </h3>
          <p className="font-raleway mt-3 text-sm text-gray-600 line-clamp-2">
            {event.description}
          </p>
        </div>

        {event.tags && event.tags.length > 0 && (
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
        )}
      </div>
    </Link>
  );
}
