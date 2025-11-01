import { Bell, Calendar, Megaphone, BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export type NotificationType =
  | "notification"
  | "calendar"
  | "megaphone"
  | "member";

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

  const getIcon = () => {
    switch (item.type) {
      case "calendar":
        return <Calendar className="w-6 h-6 text-primary2" />;
      case "megaphone":
        return <Megaphone className="w-6 h-6 text-primary2" />;
      case "member":
        return <BadgeCheck className="w-6 h-6 text-primary2" />;
      default:
        return <Bell className="w-6 h-6 text-primary2" />;
    }
  };

  const handleClick = () => {
    onMarkRead(item.id);
    router.push(item.link);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-4 rounded-xl p-4  px-8 mb-3 text-left transition border
      ${
        item.read
          ? "bg-white border-gray-200"
          : "bg-primary1/10 border-primary1/30"
      }
      hover:bg-primary1/20`}
    >
      <div className="flex-shrink-0 mt-2">{getIcon()}</div>

      <div className="flex flex-col flex-1 ml-2">
        <p className="font-rubik text-gray-800">{item.message}</p>
        <span className="text-xs text-gray-500 font-raleway mt-1">
          {item.date}
        </span>
      </div>

      {!item.read && (
        <span className="w-2 h-2 rounded-full bg-primary3 mt-2"></span>
      )}
    </button>
  );
}
