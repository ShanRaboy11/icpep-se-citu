"use client";

import { useDelayedFlag } from "../components/feedback/skeleton";
import { EventCardSkeleton } from "../components/feedback/skeleton-cards";
import { readCache, writeCache } from "../hooks/use-cached-fetch";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnnouncementCard } from "../components/announcements/announcement-card";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { Home, LayoutGrid, Megaphone, Trophy, Users } from "lucide-react";
import Grid from "../components/layout/grid";
import announcementService from "../services/announcement";
import BackButton from "../components/ui/back-button";
import PageHeader from "../components/ui/page-header";
import {
  INITIAL_FILTERS,
  ListFilterBar,
  Pagination,
  ResultsBar,
  matchesDateFilter,
  type ListFilterState,
} from "../components/list/list-filters";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  content: string;
  type: "News" | "Meeting" | "Achievement" | string;
  imageUrl?: string | null;
  publishDate: string;
}

const CATEGORIES = [
  { name: "All", icon: <LayoutGrid size={16} /> },
  { name: "News", icon: <Megaphone size={16} /> },
  { name: "Meeting", icon: <Users size={16} /> },
  { name: "Achievement", icon: <Trophy size={16} /> },
];

export default function AnnouncementsPage() {
  const router = useRouter();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const showSkeleton = useDelayedFlag(loading);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ListFilterState>(INITIAL_FILTERS);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const listTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const cached = readCache<Announcement[]>("announcements-list");
      if (cached) {
        setAnnouncements(cached);
        setLoading(false);
      }
      try {
        if (!cached) setLoading(true);
        const response = await announcementService.getAnnouncements({
          isPublished: true,
          limit: 100,
          sort: "-publishDate",
        });
        if (response.success && response.data) {
          setAnnouncements(response.data as Announcement[]);
          writeCache("announcements-list", response.data);
        }
      } catch {
        if (!cached) setError("Failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements
    .filter((ann) => {
      if (filters.category !== "All" && ann.type.toLowerCase() !== filters.category.toLowerCase()) return false;
      const query = filters.query.trim().toLowerCase();
      if (
        query !== "" &&
        !ann.title.toLowerCase().includes(query) &&
        !ann.description.toLowerCase().includes(query)
      )
        return false;
      return matchesDateFilter(ann.publishDate, filters);
    })
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);

  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (!listTopRef.current) return;
    if (currentPage === 1) return;

    const offset = window.innerWidth >= 768 ? 200 : 160;

    window.scrollTo({
      top: listTopRef.current.offsetTop - offset,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-pageblue">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="max-w-7xl mx-auto px-6 pt-38 pb-12 w-full grow">
            <div className="mb-8 flex justify-start">
              <BackButton
                onClick={() => router.push("/")}
                title="Back to Home"
                icon={Home}
              />
            </div>

            <PageHeader
              badge="Latest Updates"
              title="Announcements"
              subtitle={
                <>
                  Stay in the know with the latest news, meetings, and
                  achievements from ICpEP Student Edition R7 CIT-U Chapter.
                </>
              }
            />

            <ListFilterBar
              placeholder="Search announcements"
              categories={CATEGORIES}
              filters={filters}
              onChange={setFilters}
            />

            <ResultsBar
              shown={Math.min(currentPage * ITEMS_PER_PAGE, filteredAnnouncements.length)}
              total={filteredAnnouncements.length}
              filters={filters}
              onChange={setFilters}
            />

            {loading ? (
              <div
                data-skeleton-hidden={showSkeleton ? undefined : ""}
                className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="py-16 text-center">
                <p className="font-raleway text-lg text-red-500">{error}</p>
              </div>
            ) : (
              <div ref={listTopRef} className="pb-14">
                {filteredAnnouncements.length > 0 ? (
                  <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {paginatedAnnouncements.map((ann) => (
                      <AnnouncementCard
                        key={ann._id}
                        id={ann._id}
                        title={ann.title}
                        description={ann.description}
                        type={ann.type}
                        imageUrl={ann.imageUrl || undefined}
                        date={ann.publishDate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 font-raleway text-gray-500">
                    No announcements found matching your filters.
                  </div>
                )}
                <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
              </div>
            )}
          </div>
        </div>
      </main>
      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
}
