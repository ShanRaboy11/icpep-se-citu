"use client";

import SectionHeading from "@/app/components/ui/section-heading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FallbackImage from "@/app/components/ui/fallback-image";
import { Skeleton } from "@/app/components/feedback/skeleton";
import ViewAllButton from "@/app/components/ui/view-all-button";
import { useCachedFetch } from "@/app/hooks/use-cached-fetch";
import announcementService from "@/app/services/announcement";
import { formatDate, getTypePill } from "../../utils/announcements/announcements";

interface Item {
  _id: string;
  title: string;
  type: string;
  imageUrl?: string | null;
  publishDate: string;
}

const fetchLatest = async (): Promise<Item[]> => {
  const response = await announcementService.getAnnouncements({
    isPublished: true,
    limit: 6,
    sort: "-publishDate",
  });
  return Array.isArray(response.data) ? (response.data as Item[]) : [];
};

export default function MoreAnnouncements({ currentId }: { currentId: string }) {
  const router = useRouter();
  const { data, loading } = useCachedFetch("announcements-latest", fetchLatest);
  const items = (data ?? []).filter((item) => item._id !== currentId).slice(0, 3);

  if (!loading && items.length === 0) return null;

  return (
    <div className="rounded-3xl border border-primary1/15 bg-white p-5 shadow-md sm:p-6">
      <SectionHeading as="h3" className="mb-5">More Updates</SectionHeading>

      <div className="space-y-3">
        {loading && items.length === 0
          ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
          : items.map((item) => (
              <Link
                key={item._id}
                href={`/announcements/${item._id}`}
                className="group flex items-center gap-4 rounded-2xl border border-transparent bg-buttonbg1/60 p-3 transition-all duration-300 hover:border-primary1/30 hover:bg-buttonbg1"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <FallbackImage
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 font-rubik text-[10px] font-semibold ring-1 ring-inset ${getTypePill(item.type)}`}
                  >
                    {item.type}
                  </span>
                  <p className="mt-1 line-clamp-2 font-rubik text-sm font-bold leading-snug text-primary3">
                    {item.title}
                  </p>
                  <p className="font-raleway text-xs text-gray-500">{formatDate(item.publishDate)}</p>
                </div>
              </Link>
            ))}
      </div>

      <div className="mt-5 flex justify-center">
        <ViewAllButton label="View all announcements" onClick={() => router.push("/announcements")} />
      </div>
    </div>
  );
}
