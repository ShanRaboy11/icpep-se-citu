"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Event } from "./utils/event";
import Header from "../components/header";
import Footer from "../components/footer";
import EventCard from "./components/event-card";
import Grid from "../components/grid";
import {
  Home,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  RotateCcw,
  Filter,
  LayoutGrid,
  CalendarClock,
  History,
} from "lucide-react";
import eventService from "../services/event";
import clsx from "clsx";

type ProcessedEvent = Event & {
  status: "Upcoming" | "Ongoing" | "Ended";
};

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

const CATEGORIES = [
  { name: "All", icon: <LayoutGrid size={16} /> },
  { name: "Upcoming", icon: <CalendarClock size={16} /> },
  { name: "Past", icon: <History size={16} /> },
];

export default function EventsListPage() {
  const router = useRouter();
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const listTopRef = useRef<HTMLDivElement>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [filterStep, setFilterStep] = useState<"year" | "month">("year");
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await eventService.getEvents({
          isPublished: true,
          sort: "-eventDate",
          limit: 100,
        });

        if (response.success && response.data) {
          const raw = Array.isArray(response.data)
            ? (response.data as Array<Record<string, unknown>>)
            : [];

          const toImageUrl = (url: unknown): string => {
            if (!url) return "/placeholder.svg";
            if (typeof url !== "string") return "/placeholder.svg";
            if (url.startsWith("http")) return url;
            const backendHost = (
              process.env.NEXT_PUBLIC_BACKEND_URL ||
              process.env.NEXT_PUBLIC_API_URL ||
              "http://localhost:5000"
            ).replace(/\/+$/, "");
            if (url.startsWith("/")) return `${backendHost}${url}`;
            return url;
          };

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
                ? { name: organizerRaw, avatarImageUrl: "/icpep logo.png" }
                : (organizerRaw as Record<string, unknown> | undefined)
                  ? {
                      name: String(
                        (organizerRaw as Record<string, unknown>)["name"] ?? "",
                      ),
                      avatarImageUrl: String(
                        (organizerRaw as Record<string, unknown>)[
                          "avatarImageUrl"
                        ] ?? "/icpep logo.png",
                      ),
                    }
                  : { name: "", avatarImageUrl: "/icpep logo.png" };

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
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDateFilterOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleYear = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  const toggleMonth = (monthIdx: number) => {
    setSelectedMonths((prev) =>
      prev.includes(monthIdx)
        ? prev.filter((m) => m !== monthIdx)
        : [...prev, monthIdx],
    );
  };

  const getGroupedRanges = (
    items: number[],
    getLabel: (val: number) => string,
  ) => {
    if (items.length === 0) return [];
    const sorted = [...items].sort((a, b) => a - b);
    const ranges = [];
    let start = sorted[0],
      end = sorted[0];
    for (let i = 1; i <= sorted.length; i++) {
      if (i < sorted.length && sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push({
          label:
            start === end
              ? getLabel(start)
              : `${getLabel(start)} - ${getLabel(end)}`,
          original: sorted.filter((n) => n >= start && n <= end),
        });
        if (i < sorted.length) {
          start = sorted[i];
          end = sorted[i];
        }
      }
    }
    return ranges;
  };

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
      if (
        searchQuery.trim() !== "" &&
        !event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      const date = new Date(event.date);
      if (
        selectedYears.length > 0 &&
        !selectedYears.includes(date.getFullYear())
      )
        return false;
      if (
        selectedMonths.length > 0 &&
        !selectedMonths.includes(date.getMonth())
      )
        return false;

      if (activeCategory === "Upcoming") {
        if (event.status !== "Upcoming" && event.status !== "Ongoing")
          return false;
      } else if (activeCategory === "Past") {
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
  }, [searchQuery, selectedYears, selectedMonths, activeCategory]);

  useEffect(() => {
    if (currentPage > 1 && listTopRef.current) {
      window.scrollTo({
        top: listTopRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="max-w-7xl mx-auto px-6 pt-38 pb-12 w-full grow">
            {/* back */}
            <div className="mb-8 flex justify-start">
              <button
                onClick={() => router.push("/")}
                title="Back to Home"
                className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-primary1 text-primary1 overflow-hidden transition-all duration-300 ease-in-out active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
              >
                <Home className="h-6 w-6" />
              </button>
            </div>

            {/* title */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
                <div className="h-2 w-2 rounded-full bg-primary1"></div>
                <span className="font-raleway text-sm font-semibold text-primary1">
                  Chapter Activities
                </span>
              </div>
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                Our Events
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                Explore our lineup of events and find your next opportunity to
                be part of the excitement, connect, learn, and grow.
              </p>
            </div>

            {/* search & filters */}
            <div className="mb-10 max-w-4xl mx-auto flex gap-4 items-center">
              <div className="relative grow">
                <div className="flex items-center w-full bg-white border-2 border-primary1/20 rounded-2xl px-5 py-3 transition-all duration-300 hover:border-primary1 focus-within:border-primary1">
                  <Search className="h-5 w-5 text-primary1 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search events"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent ml-3 outline-none font-rubik font-medium text-primary3 placeholder:text-gray-400 placeholder:font-normal"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-2 text-gray-400 hover:text-primary1 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* date filter */}
              <div className="relative" ref={dateDropdownRef}>
                <button
                  onClick={() => {
                    setIsDateFilterOpen(!isDateFilterOpen);
                    setFilterStep("year");
                    setIsCategoryFilterOpen(false);
                  }}
                  className={clsx(
                    "flex items-center justify-center h-[52px] w-[52px] bg-white border-2 rounded-2xl transition-all hover:border-primary1",
                    isDateFilterOpen ||
                      selectedYears.length > 0 ||
                      selectedMonths.length > 0
                      ? "border-primary1 bg-primary1/5 shadow-sm shadow-primary1/10"
                      : "border-primary1/20",
                  )}
                >
                  <Calendar className="h-5 w-5 text-primary1" />
                </button>

                {isDateFilterOpen && (
                  <div className="absolute top-[125%] right-0 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-50 p-5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        {filterStep === "month" && (
                          <button
                            onClick={() => setFilterStep("year")}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-primary1"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                        )}
                        <span className="font-rubik font-bold text-primary3 text-sm">
                          {filterStep === "year"
                            ? "Select Year"
                            : "Select Month"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedYears([]);
                          setSelectedMonths([]);
                        }}
                        className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded-full transition-colors group"
                      >
                        <RotateCcw className="h-3 w-3 text-red-500 group-hover:-rotate-45 transition-transform" />
                        <span className="font-raleway text-[9px] font-bold text-red-500 uppercase tracking-wider">
                          Clear
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(filterStep === "year" ? YEARS : SHORT_MONTHS).map(
                        (item, idx) => {
                          const isSelected =
                            filterStep === "year"
                              ? selectedYears.includes(item as number)
                              : selectedMonths.includes(idx);
                          return (
                            <button
                              key={item}
                              onClick={() =>
                                filterStep === "year"
                                  ? toggleYear(item as number)
                                  : toggleMonth(idx)
                              }
                              className={clsx(
                                "relative py-2.5 rounded-xl text-xs font-bold font-rubik transition-all duration-200 border-2 overflow-hidden",
                                isSelected
                                  ? "bg-primary1 text-white border-primary1 shadow-md shadow-primary1/30 scale-[0.96]"
                                  : "bg-white text-gray-500 border-gray-50 hover:border-primary1/30 hover:bg-primary1/5 hover:text-primary1",
                              )}
                            >
                              {item}
                              {isSelected && (
                                <span className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full" />
                              )}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <button
                      onClick={() =>
                        filterStep === "year"
                          ? setFilterStep("month")
                          : setIsDateFilterOpen(false)
                      }
                      className="w-full mt-5 py-2.5 bg-primary3 text-white rounded-xl font-rubik font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all shadow-lg shadow-primary3/10"
                    >
                      {filterStep === "year" ? (
                        <>
                          Next <ChevronRight className="h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          Apply <Check className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* category filter */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => {
                    setIsCategoryFilterOpen(!isCategoryFilterOpen);
                    setIsDateFilterOpen(false);
                  }}
                  className={clsx(
                    "flex items-center justify-center h-[52px] w-[52px] bg-white border-2 rounded-2xl transition-all hover:border-primary1",
                    isCategoryFilterOpen || activeCategory !== "All"
                      ? "border-primary1 bg-primary1/5 shadow-sm shadow-primary1/10"
                      : "border-primary1/20",
                  )}
                >
                  <Filter className="h-5 w-5 text-primary1" />
                </button>

                {isCategoryFilterOpen && (
                  <div className="absolute top-[125%] right-0 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-50 p-5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <span className="font-rubik font-bold text-primary3 text-sm">
                        Category
                      </span>
                      <button
                        onClick={() => setActiveCategory("All")}
                        className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded-full transition-colors group"
                      >
                        <RotateCcw className="h-3 w-3 text-red-500 group-hover:-rotate-45 transition-transform" />
                        <span className="font-raleway text-[9px] font-bold text-red-500 uppercase tracking-wider">
                          Reset
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => {
                            setActiveCategory(cat.name);
                            setIsCategoryFilterOpen(false);
                          }}
                          className={clsx(
                            "w-full py-2.5 px-4 rounded-xl text-sm transition-all duration-200 text-left flex items-center gap-3 font-rubik cursor-pointer transform-gpu backface-hidden",
                            activeCategory === cat.name
                              ? "bg-primary1 text-white shadow-md shadow-primary1/25 font-semibold"
                              : "text-gray-600 hover:bg-primary1/5 hover:text-primary1 hover:translate-x-1",
                          )}
                        >
                          <span
                            className={clsx(
                              activeCategory === cat.name
                                ? "text-white"
                                : "text-primary1",
                            )}
                          >
                            {cat.icon}
                          </span>
                          {cat.name}
                          {activeCategory === cat.name && (
                            <Check className="h-3.5 w-3.5 ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* filter pills */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="font-raleway text-sm text-gray-400">
                Showing{" "}
                <span className="font-bold text-primary3">
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredEvents.length,
                  )}
                </span>{" "}
                out of{" "}
                <span className="font-bold text-primary3">
                  {filteredEvents.length}
                </span>{" "}
                results
              </div>

              <div className="flex flex-wrap md:justify-end gap-2">
                {activeCategory !== "All" && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary1/10 text-primary1 rounded-full text-[10px] font-bold font-rubik border border-primary1/20">
                    Category: {activeCategory}
                    <button
                      onClick={() => setActiveCategory("All")}
                      className="hover:text-primary3 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {getGroupedRanges(selectedYears, (y) => y.toString()).map(
                  (range, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary1/10 text-primary1 rounded-full text-[10px] font-bold font-rubik border border-primary1/20"
                    >
                      {range.label}
                      <button
                        onClick={() =>
                          setSelectedYears((prev) =>
                            prev.filter((y) => !range.original.includes(y)),
                          )
                        }
                        className="hover:text-primary3 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ),
                )}
                {getGroupedRanges(selectedMonths, (m) => SHORT_MONTHS[m]).map(
                  (range, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary3/10 text-primary3 rounded-full text-[10px] font-bold font-rubik border border-primary3/20"
                    >
                      {range.label}
                      <button
                        onClick={() =>
                          setSelectedMonths((prev) =>
                            prev.filter((m) => !range.original.includes(m)),
                          )
                        }
                        className="hover:text-primary1 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div ref={listTopRef}>
              {isLoading ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-lg animate-pulse"
                    >
                      <div className="relative h-48 bg-gray-200" />
                      <div className="flex flex-1 flex-col p-6 bg-white">
                        <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
                        <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-full bg-gray-100 rounded mb-6" />
                        <div className="mt-auto flex gap-2">
                          <div className="h-8 w-24 bg-gray-200 rounded" />
                          <div className="h-8 w-32 bg-gray-200 rounded ml-auto" />
                        </div>
                      </div>
                    </div>
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

                  {/* pagination */}
                  {totalPages > 1 && (
                    <div className="mt-16 flex flex-col items-center gap-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-primary1/20 text-primary1 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary1 transition-all"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex gap-2">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                          ).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 rounded-xl text-sm font-bold font-rubik transition-all border-2 ${currentPage === pageNum ? "bg-primary1 text-white border-primary1" : "border-primary1/20 text-primary1 hover:border-primary1 hover:bg-primary1/5"}`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-primary1/20 text-primary1 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary1 transition-all"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
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

      {/* footer */}
      <div className="-mt-[35px] md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
}
