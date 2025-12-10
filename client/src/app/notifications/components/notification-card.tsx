"use client";

import {
  Bell,
  Calendar,
  Megaphone,
  BadgeCheck,
  AlertCircle, // Imported for Action Required
} from "lucide-react";
import { useRouter } from "next/navigation";

export type NotificationType =
  | "notification"
  | "calendar"
  | "megaphone"
  | "member"
  | "action"; // Added new type

export interface NotificationItem {
  id: string;
  message: string;
  date: string;
  type: NotificationType;
  link: string;
  read: boolean;
}

interface NotificationCardProps {
  item: NotificationItem;
  onMarkRead: (id: string) => void;
}

export default function NotificationCard({
  item,
  onMarkRead,
}: NotificationCardProps) {
  const router = useRouter();

  // Helper to determine Icon styling
  const getIcon = () => {
    // Icons bigger (w-6 h-6)
    const iconClass = `w-6 h-6 ${
      item.read ? "text-gray-400" : "text-primary1"
    }`;

    switch (item.type) {
      case "calendar":
        return <Calendar className={iconClass} />;
      case "megaphone":
        return <Megaphone className={iconClass} />;
      case "member":
        return <BadgeCheck className={iconClass} />;
      case "action": // Action Required Case
        return <AlertCircle className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const handleClick = () => {
    onMarkRead(item.id);
    router.push(item.link);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group w-full flex items-center gap-4 rounded-2xl py-4 px-5 mb-2 text-left transition-all duration-200 border cursor-pointer
        ${
          item.read
            ? "bg-white border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"
            : "bg-primary1/10 border-primary1/20 hover:border-primary1/40 hover:bg-primary1/20"
        }
      `}
    >
      {/* Icon - Vertically Centered */}
      <div className="flex-shrink-0">{getIcon()}</div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <p
          className={`font-rubik text-sm sm:text-base leading-tight ${
            item.read
              ? "text-gray-600 font-normal"
              : "text-gray-900 font-medium"
          }`}
        >
          {item.message}
        </p>
        <span
          className={`text-xs font-raleway mt-1 ${
            item.read ? "text-gray-400" : "text-gray-500 font-semibold"
          }`}
        >
          {item.date}
        </span>
      </div>

      {/* Unread Indicator Dot - Vertically Centered */}
      {!item.read && (
        <span className="w-2.5 h-2.5 rounded-full bg-primary1 flex-shrink-0 animate-pulse"></span>
      )}
    </button>
  );
}
