"use client";

import { toImageUrl } from "../utils/image-url";
import { EventCardSkeleton } from "../components/feedback/skeleton-cards";
import { readCache, writeCache } from "../hooks/use-cached-fetch";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Event } from "../utils/events/event";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import EventCard from "../components/events/event-card";
import Grid from "../components/layout/grid";
import { Home, LayoutGrid, CalendarClock, History } from "lucide-react";
import eventService from "../services/event";
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
import { useDelayedFlag } from "@/app/components/feedback/skeleton";

type ProcessedEvent = Event & {
  status: "Upcoming" | "Ongoing" | "Ended";
};

const CATEGORIES = [
  { name: "All", icon: <LayoutGrid size={16} /> },
  { name: "Upcoming", icon: <CalendarClock size={16} /> },
  { name: "Past", icon: <History size={16} /> },
];

export default function EventsListPage() {
  const router = useRouter();
  const listTopRef = useRef<HTMLDivElement>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const showSkeleton = useDelayedFlag(isLoading);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ListFilterState>(INITIAL_FILTERS);

  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      const cached = readCache<Event[]>("events-list");
      if (cached) {
        setEvents(cached);
        setIsLoading(false);
      }
      try {
        if (!cached) setIsLoading(true);
        const response = await eventService.getEvents({
          isPublished: true,
          sort: "-eventDate",
          limit: 100,
        });

        if (response.success && response.data) {
          const raw = Array.isArray(response.data)
            ? (response.data as Array<Record<string, unknown>>)
            : [];

          const transformedEvents = raw.map((evt) => {
            const title = String(evt["title"] ?? "");
            const description = String(evt["description"] ?? "");
            const date = String(
              evt["eventDate"] ?? evt["date"] ?? new Date().toISOString(),
            );
            const endDate = evt["expiryDate"] ?? evt["endDate"] ?? undefined;
            const organizerRaw = evt["organizer"];
            const organizer =
              typeof organizerRaw === "string"
                ? { name: organizerRaw, avatarImageUrl: "/brand/icpep-logo.avif" }
                : (organizerRaw as Record<string, unknown> | undefined)
                  ? {
                      name: String(
                        (organizerRaw as Record<string, unknown>)["name"] ?? "",
                      ),
                      avatarImageUrl: String(
                        (organizerRaw as Record<string, unknown>)[
                          "avatarImageUrl"
                        ] ?? "/brand/icpep-logo.avif",
                      ),
                    }
                  : { name: "", avatarImageUrl: "/brand/icpep-logo.avif" };

            const tags = Array.isArray(evt["tags"])
              ? (evt["tags"] as unknown[]).map((t) => String(t))
              : [];

            const normalizeDetails = (
              d: unknown,
            ): { title: string; items: string[] }[] => {
              if (Array.isArray(d)) {
                return (d as Array<Record<string, unknown>>).map((item) => ({
                  title: String(item.title ?? ""),
                  items: Array.isArray(item.items)
                    ? (item.items as unknown[]).map((it) => String(it))
                    : typeof item.items === "string"
                      ? String(item.items)
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : [],
                }));
              }
              return description
                ? [{ title: "Overview", items: [description] }]
                : [];
            };

            const details = normalizeDetails(evt["details"]);
            const modeValue = String(evt["mode"] ?? "").toLowerCase();
            const mode = modeValue === "online" ? "Online" : "Onsite";
            const banner =
              evt["bannerImageUrl"] ?? evt["coverImage"] ?? evt["image"];

            return {
              id: String(evt["_id"] ?? evt["id"] ?? ""),
              title,
              date,
              endDate: endDate ? String(endDate) : undefined,
              mode: mode as "Online" | "Onsite",
              location: String(evt["location"] ?? "TBA"),
              organizer,
              tags,
              bannerImageUrl: toImageUrl(banner),
              description,
              details,
            };
          });

          setEvents(transformedEvents as Event[]);
          writeCache("events-list", transformedEvents);
        }
      } catch {
        if (!cached) setError("Failed to load events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const now = new Date();

  const filteredEvents = events
    .map((event) => {
      const startDate = new Date(event.date);
      const endDate = event.endDate ? new Date(event.endDate) : startDate;
      let status: ProcessedEvent["status"];
      if (now < startDate) status = "Upcoming";
      else if (now >= startDate && now <= endDate) status = "Ongoing";
      else status = "Ended";
      return { ...event, status };
    })
    .filter((event) => {
      const query = filters.query.trim().toLowerCase();
      if (
        query !== "" &&
        !event.title.toLowerCase().includes(query) &&
        !event.description.toLowerCase().includes(query)
      )
        return false;

      if (!matchesDateFilter(event.date, filters)) return false;

      if (filters.category === "Upcoming") {
        if (event.status !== "Upcoming" && event.status !== "Ongoing")
          return false;
      } else if (filters.category === "Past") {
        if (event.status !== "Ended") return false;
      }

      return true;
    })
    .sort((a, b) => {
      const statusOrder = { Upcoming: 1, Ongoing: 2, Ended: 3 };
      if (statusOrder[a.status] !== statusOrder[b.status])
        return statusOrder[a.status] - statusOrder[b.status];
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return a.status === "Upcoming" || a.status === "Ongoing"
        ? dateA - dateB
        : dateB - dateA;
    });

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    if (currentPage > 1 && listTopRef.current) {
      window.scrollTo({
        top: listTopRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
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
              badge="Chapter Activities"
              title="Our Events"
              subtitle={
                <>
                  Explore our lineup of events and find your next opportunity
                  to be part of the excitement, connect, learn, and grow.
                </>
              }
            />

            <ListFilterBar
              placeholder="Search events"
              categories={CATEGORIES}
              filters={filters}
              onChange={setFilters}
            />

            <ResultsBar
              shown={Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)}
              total={filteredEvents.length}
              filters={filters}
              onChange={setFilters}
            />

            <div ref={listTopRef}>
              {isLoading ? (
                <div
                  data-skeleton-hidden={showSkeleton ? undefined : ""}
                  className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch"
                >
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <EventCardSkeleton key={idx} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="font-raleway text-lg text-red-500">{error}</p>
                </div>
              ) : filteredEvents.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
                    {paginatedEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>

                  <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="font-raleway text-gray-500">
                    No events found matching your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
}
