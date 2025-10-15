'use client';
import Image from 'next/image';

interface AnnounceCardProps {
  category: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  onClick?: () => void;
}

const AnnounceCardSmall: React.FC<AnnounceCardProps> = ({
  category,
  title,
  description,
  date,
  image,
  onClick,
}) => {
  return (
    <div  onClick={onClick}
    className="bg-white text-black rounded-2xl p-6 flex gap-6 max-w-3xl shadow-md 
                 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer 
                 active:scale-[0.98] flex-col flex-row">
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
        <span className="font-raleway bg-buttonbg1 text-primary3 text-sm font-medium px-3 py-1 rounded-full w-fit">
          {category}
        </span>

        {/* Title */}
        <h3 className="font-rubik text-lg font-semibold">{title}</h3>

        {/* Description */}
        <p className="font-raleway text-sm text-black/80 leading-snug max-w-lg -mt-2">
          {description}
        </p>

        {/* Date */}
        <span className="font-raleway text-sm text-gray-500 mt-1">{date}</span>
      </div>
    </div>
  );
};

export default AnnounceCardSmall;
