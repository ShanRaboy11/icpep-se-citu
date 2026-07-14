"use client";

import type { FC } from "react";
import { UserCheck, Megaphone, CalendarCheck, Package, Bell, Circle } from "lucide-react";

interface NotificationCardProps {
  title: string;
  message: string;
  time: string;
  type: "membership" | "announcement" | "meeting" | "merch" | "default";
  isRead?: boolean;
  onClick?: () => void;
}

const typeStyles = {
  membership: {
    icon: <UserCheck className="h-4 w-4" />,
    color: "text-emerald-500 bg-emerald-50 border-emerald-100",
  },
  announcement: {
    icon: <Megaphone className="h-4 w-4" />,
    color: "text-purple-500 bg-purple-50 border-purple-100",
  },
  meeting: {
    icon: <CalendarCheck className="h-4 w-4" />,
    color: "text-[#006fa1] bg-cyan-50 border-cyan-100",
  },
  merch: {
    icon: <Package className="h-4 w-4" />,
    color: "text-amber-500 bg-amber-50 border-amber-100",
  },
  default: {
    icon: <Bell className="h-4 w-4" />,
    color: "text-slate-500 bg-slate-50 border-slate-100",
  },
};

export const NotificationCard: FC<NotificationCardProps> = ({
  title,
  message,
  time,
  type,
  isRead = false,
  onClick,
}) => {
  const styles = typeStyles[type] || typeStyles.default;

  return (
    <div
      onClick={onClick}
      className={`flex gap-3.5 p-3.5 rounded-2xl border transition-all duration-300 ${
        isRead ? "border-slate-100 bg-white/50" : "border-blue-100 bg-blue-50/20 hover:bg-blue-50/40"
      } ${onClick ? "cursor-pointer hover:shadow-sm" : ""}`}
    >
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${styles.color}`}>
        {styles.icon}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h6 className={`font-rubik text-xs font-bold text-slate-800 leading-snug truncate ${isRead ? "font-semibold text-slate-600" : ""}`}>
            {title}
          </h6>
          <span className="font-raleway text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
            {time}
          </span>
        </div>
        <p className="mt-0.5 font-raleway text-xs text-slate-500 leading-normal line-clamp-2">
          {message}
        </p>
      </div>

      {!isRead && (
        <div className="flex items-center flex-shrink-0 self-center">
          <Circle className="h-2 w-2 fill-primary1 text-primary1" />
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
