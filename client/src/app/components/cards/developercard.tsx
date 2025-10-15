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
      className="w-[280px] sm:w-[300px] md:w-[340px] h-[340px] perspective-1000 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-out preserve-3d ${
          isHovered ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute w-full h-full rounded-2xl overflow-hidden shadow-lg [backface-visibility:hidden] bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-700 flex flex-col">
          {/* Content area with image and title */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            {/* Background pattern/decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full" />
              <div className="absolute bottom-20 left-10 w-20 h-20 border-4 border-white rounded-full" />
            </div>

            {/* Silhouette image */}
            <div className="relative w-full h-full flex items-end justify-center pb-4">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={`${name}`}
                  width={280}
                  height={280}
                  className="object-contain"
                />
              ) : (
                <div className="w-48 h-64 bg-white/20 rounded-md" />
              )}
            </div>

            {/* Role title overlay (top-left) */}
            <div className="absolute top-8 left-8 text-left">
              <p className="font-raleway font-bold text-white text-xl sm:text-2xl leading-tight">
                {title}
              </p>
              <p className="font-raleway font-bold text-white text-xl sm:text-2xl leading-tight">
                {desc}
              </p>
            </div>
          </div>

          {/* Name banner at bottom */}
          <div className="bg-[#0B2F5C] py-4 text-center text-white font-raleway font-bold text-lg">
            {name}
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute w-full h-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-600 to-blue-900 p-8 flex flex-col justify-between text-white [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div>
            <h2 className="font-raleway text-2xl font-bold mb-6 text-left">
              {name}
            </h2>
            <ul className="font-raleway text-sm sm:text-base space-y-2 text-gray-100">
              {details.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {portfolioLink && (
            
              href={portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-raleway text-sm text-gray-200 hover:text-white self-end flex items-center gap-1 transition-colors"
            >
              Portfolio <span className="text-lg">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
  );
}