"use client";

// These imports are now the single source of truth
import { Announcement } from "../types";
import { getTypeColor, formatDate } from "../utils";

interface DetailHeaderProps {
  announcement: Announcement;
  onBack?: () => void; // Kept as optional for flexibility
}

export default function DetailHeader({
  announcement,
}: DetailHeaderProps) {
  // All the local, dummy functions and types have been removed.
  // This component now correctly uses the imported code.

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <span
          className={`inline-block px-4 py-1.5 rounded-lg text-sm font-raleway font-semibold text-white ${getTypeColor(
            announcement.type
          )}`}
        >
          {announcement.type}
        </span>
      </div>

      <h1 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 mb-3">
        {announcement.title}
      </h1>

      <p className="font-raleway text-primary1 font-medium text-lg">
        {formatDate(announcement.date)}
      </p>
    </div>
  );
}
