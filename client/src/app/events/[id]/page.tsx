"use client";

import Button from "../../components/ui/button";
import { toImageUrl } from "../../utils/image-url";
import GradientCard from "../../components/ui/gradient-card";
import { DetailCardSkeleton } from "../../components/feedback/skeleton-cards";
import { Skeleton, useDelayedFlag } from "../../components/feedback/skeleton";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Event } from "../../utils/events/event";
import eventService from "../../services/event";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import Grid from "../../components/layout/grid";
import EventHeader from "../../components/events/header";
import EventInfo from "../../components/events/info";
import OrganizerCard from "../../components/events/organizer";
import EventBanner from "../../components/events/banner";
import EventTags from "../../components/events/tags";
import RsvpCard from "../../components/events/rsvp";
import EventDetails from "../../components/events/details";
import EventGallery from "../../components/events/gallery";
import { ChevronLeft } from "lucide-react";
import BackButton from "../../components/ui/back-button";

type ProcessedEvent = Event & {
  status: "Upcoming" | "Ongoing" | "Ended";
};

interface RawEvent {
  _id?: string;
  id?: string;
  title?: string;
  eventDate?: string;
  date?: string;
  expiryDate?: string;
  endDate?: string;
  mode?: string;
  location?: string;
  organizer?: string | { name?: string; avatarImageUrl?: string };
  tags?: string[];
  bannerImageUrl?: string;
  coverImage?: string;
  image?: string;
  description?: string;
  details?: unknown[];
  galleryImages?: string[];
  rsvpLink?: string;
  rsvpCount?: number;
  contact?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [rawEvent, setRawEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const showSkeleton = useDelayedFlag(loading);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      try {
        const res = await eventService.getEventById(id);
        if (res && res.success && res.data) {
          const e = res.data as RawEvent;

          const detailsArr: { title: string; items: string[] }[] = [];
          if (Array.isArray(e.details)) {
            for (const d of e.details) {
              if (d && typeof d === "object") {
                const obj = d as Record<string, unknown>;
                const title =
                  typeof obj.title === "string"
                    ? obj.title
                    : String(obj.title ?? "");
                const itemsRaw = obj.items;
                const items: string[] = Array.isArray(itemsRaw)
                  ? itemsRaw.map((it) => String(it))
                  : [];
                if (title || items.length > 0)
                  detailsArr.push({ title, items });
              }
            }
          } else if (e.description) {
            detailsArr.push({
              title: "Overview",
              items: [String(e.description)],
            });
          }

          const organizer =
            typeof e.organizer === "string"
              ? { name: e.organizer, avatarImageUrl: "/brand/icpep-logo.avif" }
              : e.organizer && typeof e.organizer === "object"
                ? {
                    name: (e.organizer as Record<string, unknown>).name
                      ? String((e.organizer as Record<string, unknown>).name)
                      : "",
                    avatarImageUrl: (e.organizer as Record<string, unknown>)
                      .avatarImageUrl
                      ? String(
                          (e.organizer as Record<string, unknown>)
                            .avatarImageUrl,
                        )
                      : "/brand/icpep-logo.avif",
                  }
                : { name: "", avatarImageUrl: "/brand/icpep-logo.avif" };

          const mode =
            typeof e.mode === "string" && e.mode.toLowerCase() === "online"
              ? "Online"
              : "Onsite";

          const transformed: Event = {
            id: e._id || e.id || "",
            title: e.title || "",
            date: e.eventDate || e.date || new Date().toISOString(),
            endDate: e.expiryDate || e.endDate || undefined,
            mode,
            location: e.location || "TBA",
            organizer: {
              name: organizer.name || "",
              avatarImageUrl: organizer.avatarImageUrl || "/brand/icpep-logo.avif",
            },
            tags: Array.isArray(e.tags) ? e.tags : [],
            bannerImageUrl: toImageUrl(
              e.bannerImageUrl || e.coverImage || e.image,
            ),
            description: e.description || "",
            content:
              typeof (e as Record<string, unknown>).content === "string"
                ? String((e as Record<string, unknown>).content)
                : "",
            details: detailsArr,
            galleryImageUrls: Array.isArray(e.galleryImages)
              ? e.galleryImages
              : [],
            rsvpLink: e.rsvpLink,
            rsvpCount: e.rsvpCount ?? 0,
            contact: e.contact,
          };

          setRawEvent(transformed);
        } else {
          setFetchError(res?.message || "Event not found");
        }
      } catch {
        setFetchError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEvent();
    }
  }, [id]);

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
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main
          data-skeleton-hidden={showSkeleton ? undefined : ""}
          className="flex grow w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 pt-38 pb-12"
        >
          <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-5 lg:gap-12">
            <div className="order-2 hidden space-y-6 lg:order-1 lg:col-span-2 lg:block">
              <Skeleton className="aspect-square w-full rounded-3xl" />
              <Skeleton className="h-8 w-40 rounded-full" />
              <Skeleton className="h-56 w-full rounded-3xl" />
            </div>

            <div className="order-1 space-y-8 lg:order-2 lg:col-span-3">
              <Skeleton className="h-64 w-full rounded-3xl" />
              <DetailCardSkeleton lines={5} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (fetchError || !event) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex grow flex-col items-center justify-center text-center px-4 pt-38 pb-12">
          <h1 className="font-rubik text-4xl font-bold text-primary3 mb-4">
            {fetchError || "Event Not Found"}
          </h1>
          <p className="font-raleway max-w-md text-gray-600 mb-8">
            {fetchError ||
              "Sorry, the event you are looking for does not exist."}
          </p>
          <Button variant="hero" onClick={() => router.push("/events")}>
            <span className="inline-flex items-center gap-2">
              <ChevronLeft className="h-5 w-5" />
              {"Back to Events"}
            </span>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-pageblue">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="grow w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 pt-38 pb-16">
            <div className="mb-8 flex justify-start">
              <BackButton onClick={handleBackToEvents} title="Back to Events" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-2 lg:sticky lg:top-28 h-fit space-y-6 order-2 lg:order-1">
                <div className="hidden lg:block">
                  <EventBanner
                    imageUrl={event.bannerImageUrl}
                    title={event.title}
                  />
                </div>
                <div className="hidden lg:block">
                  <EventTags tags={event.tags || []} />
                </div>
                <OrganizerCard
                  organizer={event.organizer}
                  eventTitle={event.title}
                  eventId={event.id}
                  contact={event.contact}
                />
              </div>

              <div className="lg:col-span-3 space-y-8 order-1 lg:order-2">
                <GradientCard className="p-6 sm:p-8">
                  <EventHeader status={event.status} title={event.title} />
                  <EventInfo
                    date={event.date}
                    mode={event.mode}
                    location={event.location}
                  />
                </GradientCard>
                <div className="lg:hidden">
                  <EventTags tags={event.tags || []} />
                </div>
                {event.status === "Upcoming" && (
                  <RsvpCard
                    eventId={event.id}
                    rsvpCount={event.rsvpCount}
                    status={event.status}
                    date={event.date}
                    rsvpLink={event.rsvpLink}
                  />
                )}
                <EventDetails
                  title={event.title}
                  description={event.description}
                  details={event.details}
                  content={event.content}
                />
                {event.status === "Ended" && event.galleryImageUrls && (
                  <EventGallery imageUrls={event.galleryImageUrls} />
                )}
              </div>
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
