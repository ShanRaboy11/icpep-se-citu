import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/app/utils/site";

interface RawAnnouncement {
  title?: string;
  description?: string;
  imageUrl?: string | null;
  publishDate?: string;
  date?: string;
  author?: { firstName: string; lastName: string };
}

const API_URL = (() => {
  const base = String(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
})();

async function fetchAnnouncement(id: string): Promise<RawAnnouncement | null> {
  try {
    const res = await fetch(`${API_URL}/announcements/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const announcement = await fetchAnnouncement(id);

  if (!announcement) {
    return { title: "Announcement" };
  }

  const images = announcement.imageUrl ? [{ url: announcement.imageUrl }] : [DEFAULT_OG_IMAGE];

  return {
    title: announcement.title || "Announcement",
    description: announcement.description,
    openGraph: {
      title: announcement.title,
      description: announcement.description,
      url: `${SITE_URL}/announcements/${id}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: announcement.title,
      description: announcement.description,
      images: images.map((img) => img.url),
    },
  };
}

export default async function AnnouncementLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const announcement = await fetchAnnouncement(id);

  if (!announcement) return children;

  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: announcement.title,
    description: announcement.description,
    image: announcement.imageUrl ? [announcement.imageUrl] : undefined,
    datePublished: announcement.publishDate || announcement.date,
    author: {
      "@type": announcement.author ? "Person" : "Organization",
      name: announcement.author
        ? `${announcement.author.firstName} ${announcement.author.lastName}`
        : SITE_NAME,
    },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      {children}
    </>
  );
}
