"use client";

import { events } from "../utils/event";
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

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = events.find((e) => e.id === params.id);

  if (!event) {
    return (
      <div>
        <Header />
        <main className="text-center pt-38">Event not found.</main>
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
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 pt-38 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2 lg:sticky lg:top-28 h-fit space-y-6 order-2 lg:order-1">
              <EventBanner
                imageUrl={event.bannerImageUrl}
                title={event.title}
              />
              <EventTags tags={event.tags} />
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
