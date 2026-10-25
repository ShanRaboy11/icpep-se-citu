"use client";

import type { FC } from "react";
import { User, Calendar, Megaphone, Bell } from "lucide-react";

export type ActivityType = "membership" | "event" | "announcement" | "merch" | "meeting";

interface ActivityCardProps {
  title: string;
  description: string;
  timestamp: string;
  type: ActivityType;
  isRead?: boolean;
  onClick?: () => void;
}

// Bare, colored icons with no background badge — matches the header's real
// notification dropdown exactly, rather than inventing a separate look here.
const activityIcons: Partial<Record<ActivityType, React.ReactNode>> = {
  announcement: <Megaphone className="w-6 h-6 text-orange-500" />,
  event: <Calendar className="w-6 h-6 text-blue-500" />,
  membership: <User className="w-6 h-6 text-green-500" />,
};

export const ActivityCard: FC<ActivityCardProps> = ({
  title,
  description,
  timestamp,
  type,
  isRead = true,
  onClick,
}) => {
  const icon = activityIcons[type] || <Bell className="w-6 h-6 text-primary1" />;

  return (
    <div
      onClick={onClick}
      className={`flex gap-4 py-3 px-2 transition-colors duration-200 ${
        onClick ? "cursor-pointer" : ""
      } ${!isRead ? "bg-blue-50/30" : "hover:bg-gray-50/80"}`}
    >
      <div className="shrink-0 flex items-center">{icon}</div>

      <div className="grow min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-2">
          <h5
            className={`font-rubik text-sm truncate ${
              !isRead ? "font-bold text-slate-900" : "font-medium text-gray-500"
            }`}
          >
            {title}
          </h5>
          <span className="font-raleway text-xs text-gray-400 whitespace-nowrap">
            {timestamp}
          </span>
        </div>
        <p className="mt-1 font-raleway text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {!isRead && (
        <div className="shrink-0 flex items-start pt-1.5">
          <div className="w-2 h-2 bg-primary1 rounded-full" />
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
