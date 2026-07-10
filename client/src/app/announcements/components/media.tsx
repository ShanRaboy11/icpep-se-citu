import CarouselGallery from "./carousel";
import Image from "next/image";

interface AnnouncementMediaProps {
  title: string;
  imageUrl: string;
  galleryImageUrls?: string[];
}

export default function AnnouncementMedia({
  title,
  imageUrl,
  galleryImageUrls,
}: AnnouncementMediaProps) {
  const cleanUrl = (url: string): string[] => {
    if (!url) return [];
    const trimmed = url.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter((u) => typeof u === "string" && u.length > 0);
        }
      } catch {
        // ff parsing fails, treat as single string if it's not just brackets
      }
    }
    return [trimmed];
  };

  const mainImages = cleanUrl(imageUrl);

  const galleryImages = (galleryImageUrls || []).flatMap((url) =>
    cleanUrl(url)
  );

  const allImages = [...mainImages, ...galleryImages]
    .filter((url) => url && url.length > 0)
    .filter((v, i, a) => a.findIndex((x) => x === v) === i);

  if (allImages.length === 0) {
    return null;
  }

  if (allImages.length === 1) {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden relative h-64 sm:h-96 w-full">
        <Image
          src={allImages[0]}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return <CarouselGallery imageUrls={allImages} />;
}
