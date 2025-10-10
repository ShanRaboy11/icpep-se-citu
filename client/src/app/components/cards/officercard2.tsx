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

const OfficerCard: React.FC<OfficerCardProps> = ({
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
      className="relative w-full max-w-[350px] aspect-square bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl text-white text-center p-5 shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Position and Role */}
      <div className="mt-1">
        <h2 className="font-rubik text-3xl font-bold uppercase leading-tight">
          {position}
        </h2>
        <p className="font-rubik text-2xl font-semibold uppercase">{role}</p>
      </div>

      {/* Silhouette image (larger and centered) */}
      <div className="relative w-[90%] ml-auto -mt-5 -mr-8">
        {image ? (
          <Image
            src={image}
            alt={`${firstName} ${lastName}`}
            width={330}
            height={330}
            className="object-contain mx-auto"
          />
        ) : (
          <div className="w-full aspect-[3/4] bg-white/30 rounded-md mx-auto" />
        )}
      </div>

      {/* Name (overlapping bottom slightly) */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-left w-[85%]">
        <h3 className="font-raleway text-2xl font-semibold leading-tight">
          {lastName},
        </h3>
        <p className="font-raleway text-xl">{firstName}</p>
      </div>
    </div>
  );
};

export default OfficerCard;
