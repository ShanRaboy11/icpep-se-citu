// ============= components/sections/AnnouncementsSection.jsx =============
"use client";

import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import AnnounceCardBig from "@/app/components/cards/announcecardbig";
import AnnounceCardSmall from "@/app/components/cards/announcecardsmall";

export function AnnouncementsSection() {
  const router = useRouter();

  const smallAnnouncements = [
    {
      category: "Seminar",
      title: "Acquaintance Party",
      date: "September 10, 2025",
      description: "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.",
      image: "/gle.png"
    },
    {
      category: "Achievement",
      title: "Acquaintance Party",
      date: "September 10, 2025",
      description: "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.",
      image: "/gle.png"
    },
    {
      category: "Event",
      title: "Acquaintance Party",
      date: "September 10, 2025",
      description: "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.",
      image: "/gle.png"
    }
  ];

  const handleViewAll = () => {
    router.push("/announcements");
  };

  return (
    <div className="relative w-full py-12 px-4 sm:px-8 md:px-40 text-black rounded-t-3xl mt-30 overflow-hidden bg-primary1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-10 mb-15">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-black">
          LATEST ANNOUNCEMENTS
        </h2>
        <Button
          variant="outline"
          className="mt-4 sm:mt-0 px-5 py-2 text-white border-2 border-white hover:bg-buttonbg1 transition-all"
          onClick={handleViewAll}
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8 items-start sm:-ml-15 mb-15">
        <AnnounceCardBig
          category="Event"
          title="Acquaintance Party"
          date="September 10, 2025"
          description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
          image="/gle.png"
        />

        <div className="flex flex-col gap-2 lg:-ml-15 md:ml-0">
          {smallAnnouncements.map((announcement, index) => (
            <AnnounceCardSmall key={index} {...announcement} />
          ))}
        </div>
      </div>
    </div>
  );
}