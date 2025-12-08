"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Event } from "./utils/event";
import Header from "../components/header";
import Footer from "../components/footer";
import EventCard from "./components/event-card";
import Grid from "../components/grid";
import { Home } from "lucide-react";
import eventService from "../services/event";

// Define a new type for our processed event
type ProcessedEvent = Event & {
  status: "Upcoming" | "Ongoing" | "Ended";
};

export default function EventsListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

          // Transform backend data to match Event type
          const transformedEvents = raw.map((evt) => {
            const title = String(evt["title"] ?? "");
            const description = String(evt["description"] ?? "");
            const date = String(
              evt["eventDate"] ?? evt["date"] ?? new Date().toISOString()
            );
            const endDate = evt["expiryDate"] ?? evt["endDate"] ?? undefined;
            const organizerRaw = evt["organizer"];
            const organizer =
              typeof organizerRaw === "string"
                ? { name: organizerRaw, avatarImageUrl: "/icpep logo.png" }
                : (organizerRaw as Record<string, unknown> | undefined)
                ? {
                    name: String(
                      (organizerRaw as Record<string, unknown>)["name"] ?? ""
                    ),
                    avatarImageUrl: String(
                      (organizerRaw as Record<string, unknown>)[
                        "avatarImageUrl"
                      ] ?? "/icpep logo.png"
                    ),
                  }
                : { name: "", avatarImageUrl: "/icpep logo.png" };

            const tags = Array.isArray(evt["tags"])
              ? (evt["tags"] as unknown[]).map((t) => String(t))
              : [];

            const normalizeDetails = (
              d: unknown
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
                ? [
                    {
                      title: "Overview",
                      items: [description],
                    },
                  ]
                : [];
            };

            const details = normalizeDetails(evt["details"]);

            const modeValue = String(evt["mode"] ?? "").toLowerCase();
            const mode = modeValue === "online" ? "Online" : "Onsite";

            const banner =
              evt["bannerImageUrl"] ?? evt["coverImage"] ?? evt["image"];

            const transformed: Event = {
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

            return transformed;
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

  const handleBackToHome = () => {
    router.push("/");
  };

  const now = new Date();

  const processedEvents: ProcessedEvent[] = events.map((event) => {
    const startDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    let status: ProcessedEvent["status"];
    if (now < startDate) {
      status = "Upcoming";
    } else if (now >= startDate && now <= endDate) {
      status = "Ongoing";
    } else {
      status = "Ended";
    }

    return { ...event, status };
  });

  const sortedEvents = processedEvents.sort((a, b) => {
    const statusOrder = { Upcoming: 1, Ongoing: 2, Ended: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }

    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return a.status === "Upcoming" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12">
          <div className="mb-8 flex justify-start">
            <button
              onClick={handleBackToHome}
              title="Back to Home"
              className="relative flex h-12 w-12 cursor-pointer items-center justify-center 
                         rounded-full border-2 border-primary1 text-primary1 
                         overflow-hidden transition-all duration-300 ease-in-out 
                         active:scale-95 before:absolute before:inset-0 
                         before:bg-gradient-to-r before:from-transparent 
                         before:via-white/40 before:to-transparent 
                         before:translate-x-[-100%] hover:before:translate-x-[100%] 
                         before:transition-transform before:duration-700"
            >
              <Home className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-16 text-center">
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
              part of the excitement, connect, learn, and grow.
            </p>
          </div>

          {isLoading ? (
            // Render a grid of skeleton cards to improve perceived performance
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 ease-in-out"
                >
                  <div className="relative h-48 flex-shrink-0 overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 animate-pulse bg-gray-200" />
                  </div>

                  <div className="flex flex-1 flex-col p-6 bg-white">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
                    <div className="h-6 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-full bg-gray-100 rounded mb-6 animate-pulse" />

                    <div className="mt-auto flex gap-2">
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="font-raleway text-lg text-red-500">{error}</p>
            </div>
          ) : sortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
              {sortedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-raleway text-lg text-gray-500">
                No events yet.
              </p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
