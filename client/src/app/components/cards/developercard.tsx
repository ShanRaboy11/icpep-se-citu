'use client';

import React from "react";
import Image from "next/image";

interface OfficerCardProps {
  name: string;
  position: string;
  role: string;
  image?: string;
  achievements?: string[];
  portfolioLink?: string;
}

const OfficerFlipCard: React.FC<OfficerCardProps> = ({
  name,
  position,
  role,
  image,
  achievements = [],
  portfolioLink,
}) => {
  return (
    <div className="group w-full max-w-[280px] aspect-square perspective mx-auto">
      {/* Inner wrapper for 3D flip */}
      <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">

        {/* Front Side */}
        <div className="absolute w-full h-full bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl text-white shadow-md backface-hidden overflow-hidden flex flex-col justify-between">
          {/* Role + Position */}
          <div className="p-5 text-left">
            <h2 className="text-lg font-semibold uppercase">{position}</h2>
            <p className="text-md">{role}</p>
          </div>

          {/* Image */}
          <div className="relative w-[90%] mx-auto">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={300}
                height={300}
                className="object-contain mx-auto"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-white/30 rounded-md mx-auto" />
            )}
          </div>

          {/* Name bar */}
          <div className="bg-blue-900 text-center py-2 text-white font-semibold text-sm sm:text-base rounded-b-2xl">
            {name}
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-2xl shadow-md rotate-y-180 backface-hidden p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">{name}</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {achievements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {portfolioLink && (
            <a
              href={portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-right text-blue-300 hover:text-white transition-all"
            >
              Portfolio ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerFlipCard;
