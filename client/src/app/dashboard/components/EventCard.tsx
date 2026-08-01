"use client";

import type { FC } from "react";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  venue: string;
  imageUrl: string;
  status: "Upcoming" | "Registered" | "Ongoing" | "Full" | "Completed";
  onClick?: () => void;
}

const statusBadges = {
  Upcoming: "bg-blue-50 text-[#003599] border-blue-200",
  Registered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Ongoing: "bg-amber-50 text-amber-700 border-amber-200",
  Full: "bg-rose-50 text-rose-700 border-rose-200",
  Completed: "bg-gray-50 text-gray-700 border-gray-200",
};

export const EventCard: FC<EventCardProps> = ({
  title,
  date,
  venue,
  imageUrl,
  status,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 group cursor-pointer"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // fallback if image not found
            (e.target as HTMLImageElement).src = "/gle.png";
          }}
        />
        <div className="absolute top-4 right-4">
          <span
            className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold font-raleway backdrop-blur-md shadow-sm ${statusBadges[status]}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h4 className="font-rubik text-base font-bold text-slate-800 tracking-tight leading-snug mb-3 group-hover:text-primary1 transition-colors duration-300">
          {title}
        </h4>

        <div className="space-y-2 mt-auto font-raleway text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#0073AD] flex-shrink-0" />
            <span className="truncate">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#0073AD] flex-shrink-0" />
            <span className="truncate">{venue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
