"use client";

import Image from "next/image";
import { useState } from "react";

interface DeveloperCardProps {
  name: string;
  title: string;
  desc: string;
  imageSrc: string;
  bgSrc: string;
  details: string[];
  portfolioLink?: string;
}

export default function DeveloperCard({
  name,
  title,
  desc,
  imageSrc,
  bgSrc,
  details,
  portfolioLink,
}: DeveloperCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-[300px] h-[340px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[360px]"//w-[300px] sm:w-[320px] md:w-[360px] h-[360px] perspective ""
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
          <div className="absolute top-[-60px] sm:top-[-19px] lg:top-[-38px] left-0 w-full h-full z-0 z-0">
            <Image
              src={bgSrc}
              alt={`${name}`}
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 360px) 250px, 300px"
            />
          </div>

          <div className="relative w-[90%] ml-auto mt-6 sm:-mt-3 -mr-8">
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
          <div
            className="absolute bottom-30 left-1/2 -translate-x-1/2 w-[78%] 
                 text-left flex flex-col text-xl sm:text-xl lg:text-2xl
                font-raleway font-bold text-white text-2xl"
          >
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>

          <div className="-mt-6 bg-primary3 py-2 text-center text-white font-bold text-[20px] sm:text-[20px] lg:text-[24px] z-10 ">
            {name}
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute px-12 w-full h-full rounded-2xl  overflow-hidden shadow-lg bg-gradient-to-br from-sky-400 to-blue-900 p-6 flex flex-col justify-between text-white rotate-y-180 backface-hidden">
          <div>
            <h2 className="font-rubik text-lg sm:text-xl lg:text-2xl text-center font-bold mt-1 mb-3">
              {name}
            </h2>
            <ul className="font-raleway text-sm sm:text-base list-disc list-outside space-y-1 text-md text-gray-100 mt-5">
              {details.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          {portfolioLink && portfolioLink !== "#" && (
            <a
              href={portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              // Retained your existing styles and the added padding
              className="font-raleway  text-base sm:text-sm lg:text-lg text-gray-200 hover:text-white self-end cursor-pointer flex items-center gap-1 transition-colors mr-[-20px] mt-5 py-2 px-5"
            >
              Portfolio <span className="text-xl">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
