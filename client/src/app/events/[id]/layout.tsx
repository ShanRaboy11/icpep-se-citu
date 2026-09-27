import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/app/utils/site";

interface RawEvent {
  title?: string;
  eventDate?: string;
  endDate?: string;
  mode?: string;
  location?: string;
  organizer?: string | { name?: string };
  bannerImageUrl?: string;
  coverImage?: string;
  image?: string;
  description?: string;
}

const API_URL = (() => {
  const base = String(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
})();

async function fetchEvent(id: string): Promise<RawEvent | null> {
  try {
    const res = await fetch(`${API_URL}/events/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

const plainText = (html?: string) =>
  (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchEvent(id);

  if (!event) {
    return { title: "Event" };
  }

  const description = plainText(event.description) || `An event by ${SITE_NAME}.`;
  const image = event.bannerImageUrl || event.coverImage || event.image;
  const images = image ? [{ url: image }] : [DEFAULT_OG_IMAGE];

  return {
    title: event.title || "Event",
    description,
    openGraph: {
      title: event.title,
      description,
      url: `${SITE_URL}/events/${id}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: images.map((img) => img.url),
    },
  };
}

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await fetchEvent(id);

  if (!event) return children;

  const organizerName =
    typeof event.organizer === "string" ? event.organizer : event.organizer?.name;
  const image = event.bannerImageUrl || event.coverImage || event.image;

  // Lets AI answer engines and rich search results answer "when/where is
  // ICpEP's next event" directly, without having to parse the page's prose.
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.eventDate,
    endDate: event.endDate || undefined,
    eventAttendanceMode:
      event.mode === "Online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.location
      ? event.mode === "Online"
        ? { "@type": "VirtualLocation", url: `${SITE_URL}/events/${id}`, name: event.location }
        : { "@type": "Place", name: event.location }
      : undefined,
    image: image ? [image] : undefined,
    description: plainText(event.description),
    organizer: { "@type": "Organization", name: organizerName || SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      {children}
    </>
  );
}
