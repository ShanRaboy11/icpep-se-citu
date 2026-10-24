import Link from "next/link";
import FallbackImage from "@/app/components/ui/fallback-image";
import { getTypePill, formatDate } from "../../utils/announcements/announcements";

interface AnnouncementCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "News" | "Meeting" | "Achievement" | string;
  imageUrl?: string | null;
}

export function AnnouncementCard({
  id,
  title,
  description,
  date,
  type,
  imageUrl,
}: AnnouncementCardProps) {
  return (
    <Link
      href={`/announcements/${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-primary1/40"
    >
      <div className="relative aspect-16/10 shrink-0 overflow-hidden bg-gray-100">
        <FallbackImage
          src={imageUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-rubik font-semibold ring-1 ring-inset ${getTypePill(type)}`}
        >
          {type}
        </span>
      </div>

      <div className="flex flex-1 flex-col bg-white p-6">
        <p className="font-raleway text-sm font-medium text-primary1">{formatDate(date)}</p>
        <h3 className="font-rubik mt-2 line-clamp-2 text-xl font-bold text-primary3">{title}</h3>
        <p className="font-raleway mt-3 line-clamp-3 text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}
