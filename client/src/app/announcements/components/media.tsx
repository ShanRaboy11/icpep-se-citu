import CarouselGallery from "./carousel";

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
  // Combine the main image with the gallery images, ensuring no duplicates
  const allImages = [imageUrl, ...(galleryImageUrls || [])].filter(
    (v, i, a) => a.findIndex((x) => x === v) === i
  );

  // If there's only one unique image, show the simple version
  if (allImages.length <= 1) {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 sm:h-96 object-cover"
        />
      </div>
    );
  }

  return <CarouselGallery imageUrls={allImages} />;
}
