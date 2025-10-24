"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Announcement,
  formatDate,
} from "../../announcements/utils/announcements";
import { ArrowRight } from "lucide-react";

interface FeaturedCardProps {
  announcement: Announcement;
}

export default function FeaturedAnnouncementCard({
  announcement,
}: FeaturedCardProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
      <div className="text-left">
        <p className="font-raleway text-primary1 font-medium mb-3">
          {formatDate(announcement.date)}
        </p>

        <h2 className="font-rubik text-3xl font-bold text-primary3 leading-tight mb-2">
          {announcement.title}
        </h2>

        <p className="font-raleway text-lg text-bodytext max-w-lg mb-8 line-clamp-3">
          {announcement.description}
        </p>

        <button
          onClick={() => router.push(`/announcements/${announcement.id}`)}
          className="group mt-8 inline-flex items-center gap-2 font-rubik font-semibold text-primary1 transition-colors duration-300 hover:text-secondary2 cursor-pointer"
        >
          <span>Read More</span>
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </button>
      </div>
      <div className="relative h-80 w-full overflow-hidden rounded-2xl group">
        <Image
          src={announcement.imageUrl}
          alt={announcement.title}
          layout="fill"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );
}
