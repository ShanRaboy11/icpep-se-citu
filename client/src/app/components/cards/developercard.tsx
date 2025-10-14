"use client";
import Image from "next/image";
import { useState } from "react";

interface DeveloperCardProps {
  name: string;
  title: string;
  desc: string;
  imageSrc: string;
  details: string[];
  portfolioLink?: string;
}

export default function DeveloperCard({
  name,
  title,
  desc,
  imageSrc,
  details,
  portfolioLink,
}: DeveloperCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-[280px] sm:w-[300px] md:w-[340px] h-[340px] perspective cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-300 ease-out transform-style-preserve-3d ${
          isHovered ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute w-full h-full rounded-2xl overflow-hidden shadow-lg backface-hidden bg-gradient-to-b from-sky-400 to-blue-600 flex flex-col justify-between">
          {/* Silhouette image (larger and centered) */}
      <div className="relative w-[90%] ml-auto mt-10 sm:mt-1 -mr-8">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${name}`}
            width={330}
            height={330}
            className="object-contain mx-auto"
          />
        ) : (
          <div className="w-full aspect-[3/4] bg-white/30 rounded-md mx-auto" />
        )}
      </div>

      {/* Name (overlapping bottom slightly) */}
      <div className="absolute bottom-30 left-1/2 -translate-x-1/2 w-[78%] 
                 text-left flex flex-col
                font-raleway font-bold text-white text-2xl">
        <h3>
          {title}
        </h3>
        <p>
          {desc}
        </p>
      </div>

          <div className="-mt-5 bg-primary3 py-3 text-center text-white font-bold text-lg z-10">
            {name}
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute px-12 w-full h-full rounded-2xl  overflow-hidden shadow-lg bg-gradient-to-br from-sky-400 to-blue-900 p-6 flex flex-col justify-between text-white rotate-y-180 backface-hidden">
          <div>
            <h2 className="font-rubik text-xl sm:text-2xl text-center font-bold mb-3 mt-3">{name}</h2>
            <ul className="font-raleway text-sm sm:text-base list-disc list-outside space-y-1 text-md text-gray-100 mt-5">
              {details.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          {portfolioLink && (
            <a
              href={portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-raleway text-sm text-gray-200 hover:text-white self-end"
            >
              Portfolio ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
