'use client';
import Image from 'next/image';

interface AnnouncementCardProps {
  category: string;
  title: string;
  description: string;
  date: string;
  image?: string;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  category,
  title,
  description,
  date,
  image,
}) => {
  return (
    <div className="bg-sky-500 text-black rounded-2xl p-6 flex items-center gap-6 max-w-3xl shadow-md hover:shadow-lg transition">
      {/* Image */}
      <div className="w-30 h-30 bg-gray-300 rounded-xl overflow-hidden flex-shrink-0">
        {image && (
          <Image
            src={image}
            alt={title}
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col space-y-2">
        {/* Category */}
        <span className="bg-white text-primary3 text-sm font-medium px-3 py-1 rounded-full w-fit">
          {category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold">{title}</h3>

        {/* Description */}
        <p className="text-sm text-black/80 leading-snug max-w-lg -mt-2">
          {description}
        </p>

        {/* Date */}
        <span className="text-sm text-white/90 mt-1">{date}</span>
      </div>
    </div>
  );
};

export default AnnouncementCard;
