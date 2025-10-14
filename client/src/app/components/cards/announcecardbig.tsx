'use client';
import React from "react";
import Image from "next/image";

interface EventCardProps {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  onClick?: () => void;
}

const AnnounceCardBig: React.FC<EventCardProps> = ({
  title,
  date,
  description,
  imageUrl,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full max-w-sm mx-auto overflow-hidden"
    >
      {/* Image */}
      <div className="relative w-full aspect-video bg-gray-300 rounded-t-2xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2 px-6 pb-6">
        <span className="font-raleway inline-block text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
          Event
        </span>

        <h3 className="font-rubik text-lg font-semibold text-gray-900">{title}</h3>
        <p className="font-raleway text-sm text-gray-500">{date}</p>
        <p className="font-raleway text-sm text-gray-700 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AnnounceCardBig;
