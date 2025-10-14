'use client';

import React from 'react';
import Image from 'next/image';

interface AnnounceCardProps {
  image: string;
  tag: string;
  title: string;
  description: string;
  date: string;
  onClick?: () => void;
}

const AnnounceCardMed: React.FC<AnnounceCardProps> = ({
  image,
  tag,
  title,
  description,
  date,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="sm:w-[55%] flex flex-col justify-center sm:flex-row bg-white border border-sky-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 active:scale-95"
    >
      {/* Image Section */}
      <div className="relative w-full sm:w-1/3 h-48 sm:h-auto">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between p-6 mx-3 w-full sm:w-2/3 sm:ml-5">
        <div>
          {/* Tag */}
          <span className="font-raleway bg-primary1 text-white text-sm font-medium px-4 py-2 rounded-3xl">
            {tag}
          </span>

          {/* Title */}
          <h2 className="font-rubik text-xl sm:text-2xl font-semibold text-sky-900 mt-5 mb-1">
            {title}
          </h2>

          {/* Description */}
          <p className="font-raleway text-gray-700 text-sm sm:text-base leading-relaxed -mt-1">
            {description}
          </p>
        </div>

        {/* Date */}
        <p className="font-raleway text-sky-500 text-sm sm:text-base font-medium mt-6">
          {date}
        </p>
      </div>
    </div>
  );
};

export default AnnounceCardMed;
