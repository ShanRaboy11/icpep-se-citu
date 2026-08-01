"use client";

import type { FC } from "react";
import { UserCheck, CalendarPlus, Megaphone, ShoppingBag, CalendarClock, HelpCircle } from "lucide-react";

export type ActivityType = "membership" | "event" | "announcement" | "merch" | "meeting";

interface ActivityCardProps {
  title: string;
  description: string;
  timestamp: string;
  type: ActivityType;
}

const activityStyles = {
  membership: {
    icon: <UserCheck className="h-5 w-5" />,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  event: {
    icon: <CalendarPlus className="h-5 w-5" />,
    color: "bg-blue-50 text-[#003599] border-blue-100",
  },
  announcement: {
    icon: <Megaphone className="h-5 w-5" />,
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  merch: {
    icon: <ShoppingBag className="h-5 w-5" />,
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  meeting: {
    icon: <CalendarClock className="h-5 w-5" />,
    color: "bg-cyan-50 text-[#006fa1] border-cyan-100",
  },
};

export const ActivityCard: FC<ActivityCardProps> = ({
  title,
  description,
  timestamp,
  type,
}) => {
  const style = activityStyles[type] || {
    icon: <HelpCircle className="h-5 w-5" />,
    color: "bg-gray-50 text-gray-600 border-gray-100",
  };

  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-white/50 hover:bg-white shadow-xs transition-all duration-300">
      <div className={`h-10 w-10 flex-shrink-0 rounded-xl border flex items-center justify-center ${style.color}`}>
        {style.icon}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h5 className="font-rubik text-sm font-semibold text-slate-800 truncate">
            {title}
          </h5>
          <span className="font-raleway text-xs text-slate-400 whitespace-nowrap">
            {timestamp}
          </span>
        </div>
        <p className="mt-1 font-raleway text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ActivityCard;
