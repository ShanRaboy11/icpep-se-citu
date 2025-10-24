"use client";

import { useRouter } from "next/navigation";
import { Announcement, formatDate } from "../../announcements/utils/announcements";
import { Newspaper, Users, Trophy } from "lucide-react";

interface MiniCardProps {
  announcement: Announcement;
}

export default function MiniAnnouncementCard({ announcement }: MiniCardProps) {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "news":
        return <Newspaper size={24} />;
      case "meeting":
        return <Users size={24} />;
      case "achievement":
        return <Trophy size={24} />;
      default:
        return <Newspaper size={24} />;
    }
  };

  return (
    <div
      onClick={() => router.push(`/announcements/${announcement.id}`)}
      className="cursor-pointer h-full"
    >
      <div className="flex flex-col items-start text-left h-full">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary1/10 text-primary1">
          {getIcon(announcement.type)}
        </div>

        <div className="flex-grow">
          <h3 className="font-rubik text-xl font-bold text-primary3">
            {announcement.title}
          </h3>
          <p className="font-raleway text-sm text-primary1/80 mt-1 mb-2">
            {formatDate(announcement.date)}
          </p>
          <p className="font-raleway text-base text-bodytext line-clamp-2">
            {announcement.description}
          </p>
        </div>
      </div>
    </div>
  );
}
