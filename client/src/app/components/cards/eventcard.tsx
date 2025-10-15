'use client';

import React from "react";
import Image from "next/image";
import Button from "../button";

interface EventCardProps {
  image: string;
  title: string;
  description: string;
  onRSVP?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ image, title, description, onRSVP }) => {
  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-sky-100 rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col mx-auto">
      {/* Image */}
      <div className="relative w-full h-40 sm:h-48 md:h-56">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="text-justify p-5 flex flex-col justify-between flex-grow px-10">
        <div>
          <h2 className="font-rubik text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="font-raleway text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
            {description}
          </p>
        </div>
        <Button variant="primary2" onClick={onRSVP} className="self-end">RSVP</Button>
      </div>
    </div>
  );
};

export default EventCard;
