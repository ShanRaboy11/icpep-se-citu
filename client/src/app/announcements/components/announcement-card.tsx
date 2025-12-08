"use client";

import { getTypeColor, formatDate } from "../utils/announcements";
import { Pencil } from "lucide-react"; // Import Pencil

// Props for the card; imageUrl is optional because some announcements may not include one
interface AnnouncementCardProps {
  id?: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  type: "News" | "Meeting" | "Achievement" | string;
  imageUrl?: string | null;
  onClick?: () => void;
  // --- NEW PROPS ---
  edit?: boolean;
  index?: number;
}

export function AnnouncementCard({
  id,
  title,
  description,
  date,
  type,
  imageUrl,
  onClick,
  edit,
  index = 0,
}: AnnouncementCardProps) {
  // Logic: Animation Staggering
  const animationStyle = edit ? { animationDelay: `${index * 0.1}s` } : {};

  // Logic: Click Handler
  const handleClick = () => {
    // If edit mode is on, redirect to create page with ID
    if (edit && id) {
      window.location.href = `/announcements/create?id=${id}`;
      return;
    }
    // Otherwise, execute the normal onClick (view details)
    if (onClick) onClick();
  };

  return (
    <div
      style={animationStyle}
      onClick={handleClick}
      className={`bg-white rounded-[25px] shadow-lg shadow-gray-300
                 overflow-hidden mb-10 max-w-4xl mx-auto 
                 h-auto md:h-80 cursor-pointer
                 transition-all duration-300 ease-in-out
                 hover:shadow-2xl hover:shadow-primary1/40
                 hover:-translate-y-1 hover:scale-[1.02]
                 hover:ring-2 hover:ring-primary1/50
                 ${
                   edit
                     ? "cursor-pointer edit shadow-primary1/20"
                     : "cursor-pointer hover:shadow-2xl hover:shadow-primary1/40 hover:-translate-y-1 hover:scale-[1.02] hover:ring-2 hover:ring-primary1/50"
                 }`}
    >
      <div className="md:flex h-full relative">
        {/* --- EDIT OVERLAY (Full Card) --- */}
        <div
          className={`absolute inset-0 bg-primary1/10 backdrop-blur-[1px] flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out ${
            edit
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <div
            className={`bg-white text-primary1 p-4 rounded-full shadow-lg transform transition-transform duration-500 ${
              edit ? "scale-100" : "scale-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Pencil size={24} />
              <span className="font-rubik font-bold">Edit Announcement</span>
            </div>
          </div>
        </div>

        <div className="md:w-1/3 h-48 md:h-full relative">
          {/* show a fallback image when none provided */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl ?? "/gle.png"}
            alt={title}
            draggable="false"
            className="w-full h-full object-cover transition-transform duration-700"
          />
        </div>

        <div className="md:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="mb-3 sm:mb-4">
              <span
                className={`inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-[10px] text-xs sm:text-sm font-raleway font-medium transition-opacity duration-300 ${
                  edit ? "opacity-50" : "opacity-100"
                } ${getTypeColor(type)}`}
              >
                {type}
              </span>
            </div>

            <h3 className="mb-2 sm:mb-3 text-primary3 text-lg sm:text-xl font-rubik font-bold line-clamp-2">
              {title}
            </h3>

            <p className="font-raleway text-gray-700 text-sm sm:text-base mb-2 sm:mb-4 leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          <div className="mt-2">
            <p className="font-raleway text-primary1 font-medium text-sm sm:text-base">
              {formatDate(date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
