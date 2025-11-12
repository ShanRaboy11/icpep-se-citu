// components/organizer-card.tsx
"use client";

import { useState } from "react";

interface Props {
  organizer?: {
    name?: string;
    avatarImageUrl?: string;
    [key: string]: any; // Allow for additional properties
  } | string; // organizer can be a string or object
}

export default function OrganizerCard({ organizer }: Props) {
  const [imgError, setImgError] = useState(false);
  
  // Handle case where organizer is not provided
  if (!organizer) {
    return null;
  }

  // Handle case where organizer is a string
  const organizerData = typeof organizer === 'string' 
    ? { name: organizer, avatarImageUrl: undefined }
    : organizer;

  const name = organizerData.name || "Event Organizer";
  const avatarUrl = organizerData.avatarImageUrl || "/placeholder-avatar.svg";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-5">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {!imgError ? (
            <img
              src={avatarUrl}
              alt={`${name} logo`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary1/10 text-primary1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-rubik font-bold text-base sm:text-lg text-primary3">
            {name}
          </h3>
          <p className="font-raleway text-sm text-bodytext">Event Organizer</p>
        </div>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => window.location.href = "mailto:icpep.seofficial2526@gmail.com"}
          className="w-full bg-transparent border border-primary1 text-primary1 
                     hover:bg-primary1 hover:text-white font-raleway font-semibold text-sm sm:text-base 
                     py-2 px-4 rounded-lg cursor-pointer relative overflow-hidden 
                     transition-all duration-300 ease-in-out active:scale-95 
                     before:absolute before:inset-0 before:bg-gradient-to-r 
                     before:from-transparent before:via-white/40 before:to-transparent 
                     before:translate-x-[-100%] hover:before:translate-x-[100%] 
                     before:transition-transform before:duration-700"
        >
          Contact Host
        </button>
        <button className="w-full bg-transparent border border-gray-400 text-gray-600 hover:bg-gray-100 font-raleway font-semibold text-sm sm:text-base py-2 px-4 rounded-lg transition-all cursor-pointer">
          Report Event
        </button>
      </div>
    </div>
  );
}