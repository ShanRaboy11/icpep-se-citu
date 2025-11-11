"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Event } from "../utils/event";
import eventService from "../../services/event";
import Header from "../../components/header";
import Footer from "../../components/footer";
import EventHeader from "../components/header";
import EventInfo from "../components/info";
import OrganizerCard from "../components/organizer";
import EventBanner from "../components/banner";
import EventTags from "../components/tags";
import RsvpCard from "../components/rsvp";
import EventDetails from "../components/details";
import EventGallery from "../components/gallery";
import { ArrowLeft } from "lucide-react";

type ProcessedEvent = Event & {
  status: "Upcoming" | "Ongoing" | "Ended";
};

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const [rawEvent, setRawEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      try {
        const res = await eventService.getEventById(params.id);
        if (res && res.success && res.data) {
          const e = res.data as any;

          const toImageUrl = (url: any) => {
            if (!url) return "/placeholder.svg";
            if (typeof url !== "string") return "/placeholder.svg";
            if (url.startsWith("http")) return url;
            const backendHost = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
            if (url.startsWith("/")) return `${backendHost}${url}`;
            return url;
          };

          const details = Array.isArray(e.details)
            ? e.details
            : e.description
            ? [
                {
                  title: "Overview",
                  items: [String(e.description)],
                },
              ]
            : [];

          const organizer =
            typeof e.organizer === "string"
              ? { name: e.organizer, avatarImageUrl: "/icpep logo.png" }
              : e.organizer || { name: "", avatarImageUrl: "/icpep logo.png" };

          const mode = e.mode === "Online" || e.mode === "online" ? "Online" : "Onsite";

          const transformed: Event = {
            id: e._id || e.id,
            title: e.title || "",
            date: e.eventDate || e.date || new Date().toISOString(),
            endDate: e.expiryDate || e.endDate || undefined,
            mode,
            location: e.location || "TBA",
            organizer,
            tags: e.tags || [],
            bannerImageUrl: toImageUrl(e.bannerImageUrl || e.coverImage || e.image),
            description: e.description || "",
            details,
            galleryImageUrls: e.galleryImageUrls || [],
          };

          setRawEvent(transformed);
        } else {
          setFetchError(res?.message || "Event not found");
        }
      } catch (err) {
        console.error(err);
        setFetchError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [params.id]);

  let event: ProcessedEvent | undefined;

  if (rawEvent) {
    const now = new Date();
    const startDate = new Date(rawEvent.date);
    const endDate = rawEvent.endDate
      ? new Date(rawEvent.endDate)
      : new Date(startDate.getTime() + 24 * 60 * 60 * 1000 - 1);

    let status: ProcessedEvent["status"];
    if (now < startDate) {
      status = "Upcoming";
    } else if (now >= startDate && now <= endDate) {
      status = "Ongoing";
    } else {
      status = "Ended";
    }

    event = { ...rawEvent, status };
  }

  const handleBackToEvents = () => {
    router.push("/events");
  };

  if (loading) {
    // Skeleton layout for event detail while loading
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 pt-[9.5rem] pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start w-full">
            <div className="lg:col-span-2 lg:sticky lg:top-28 h-fit space-y-6 order-2 lg:order-1">
              <div className="rounded-xl bg-gray-100 w-full h-64 animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-100 rounded animate-pulse" />
            </div>

            <div className="lg:col-span-3 space-y-8 order-1 lg:order-2">
              <div className="h-8 w-1/3 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-100 rounded animate-pulse" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
              </div>

              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex flex-grow flex-col items-center justify-center text-center px-4 pt-[9.5rem] pb-12">
          <h1 className="font-rubik text-4xl font-bold text-primary3 mb-4">Error</h1>
          <p className="font-raleway max-w-md text-gray-600 mb-8">{fetchError}</p>
          <button
            onClick={() => router.push("/events")}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary1 px-6 py-3 font-rubik font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-primary2 hover:shadow-primary1/40 hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Events</span>
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex flex-grow flex-col items-center justify-center text-center px-4 pt-[9.5rem] pb-12">
          <h1 className="font-rubik text-4xl font-bold text-primary3 mb-4">
            Event Not Found
          </h1>
          <p className="font-raleway max-w-md text-gray-600 mb-8">
            Sorry, the event you are looking for does not exist.
          </p>
          <button
            onClick={() => router.push("/events")}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary1 px-6 py-3 font-rubik font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-primary2 hover:shadow-primary1/40 hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Events</span>
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden font-sans">
      <div className="absolute top-[-10rem] left-[-15rem] w-[35rem] h-[35rem] bg-primary1/20 rounded-full filter blur-3xl opacity-90"></div>
      <div className="absolute top-1/4 right-[-18rem] w-[35rem] h-[35rem] bg-secondary2/20 rounded-full filter blur-3xl opacity-90"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 pt-[9.5rem] pb-12">
          <div className="mb-8 flex justify-start">
            <button
              onClick={handleBackToEvents}
              title="Back to Events"
              className="relative flex h-12 w-12 cursor-pointer items-center justify-center 
                         rounded-full border-2 border-primary1 text-primary1 
                         overflow-hidden transition-all duration-300 ease-in-out 
                         active:scale-95 before:absolute before:inset-0 
                         before:bg-gradient-to-r before:from-transparent 
                         before:via-white/40 before:to-transparent 
                         before:translate-x-[-100%] hover:before:translate-x-[100%] 
                         before:transition-transform before:duration-700"
            >
              <ArrowLeft className="h-6 w-6 animate-nudge-left translate-x-[2px]" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2 lg:sticky lg:top-28 h-fit space-y-6 order-2 lg:order-1">
              <EventBanner
                imageUrl={event.bannerImageUrl}
                title={event.title}
              />
              <EventTags tags={event.tags || []} />
              <OrganizerCard organizer={event.organizer} />
            </div>

            <div className="lg:col-span-3 space-y-8 order-1 lg:order-2">
              <EventHeader status={event.status} title={event.title} />
              <EventInfo
                date={event.date}
                mode={event.mode}
                location={event.location}
              />
              <RsvpCard status={event.status} date={event.date} />
              <EventDetails
                title={event.title}
                description={event.description}
                details={event.details}
              />
              {event.status === "Ended" && event.galleryImageUrls && (
                <EventGallery imageUrls={event.galleryImageUrls} />
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
