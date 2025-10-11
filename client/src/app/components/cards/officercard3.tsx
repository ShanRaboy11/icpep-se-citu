'use client';

import React from "react";
import Image from "next/image";

interface OfficerCardProps {
  position: string;
  role: string;
  lastName: string;
  firstName: string;
  image?: string;
  onClick?: () => void;
}

const OfficerCard3: React.FC<OfficerCardProps> = ({
  position,
  role,
  lastName,
  firstName,
  image,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative w-full max-w-[280px] aspect-[3/4] bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl text-white text-center shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Position & Role (top text) */}
      <div className="pt-5">
        <h2 className="font-rubik text-2xl font-bold uppercase leading-tight mt-2">
          {position}
        </h2>
        <p className="font-rubik text-xl font-semibold uppercase -mt-1">
          {role}
        </p>
      </div>

      {/* Image overlapping both top & bottom sections */}
      <div className="relative w-[100%] mx-auto ml-10 mt-4">
        {image ? (
          <Image
            src={image}
            alt={`${firstName} ${lastName}`}
            width={320}
            height={320}
            className="object-contain mx-auto -mt-2"
          />
        ) : (
          <div className="w-full aspect-[3/4] bg-white/30 rounded-md mx-auto" />
        )}
      </div>

      {/* Name section (slightly overlaps image bottom) */}
      <div className="absolute bottom-30 left-5 text-left">
        <h3 className="font-raleway text-xl font-semibold leading-tight">
          {lastName},
        </h3>
        <p className="font-raleway text-lg -mt-1">{firstName}</p>
      </div>
    </div>
  );
};

export default OfficerCard3;
