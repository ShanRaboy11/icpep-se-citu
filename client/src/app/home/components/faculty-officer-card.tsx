"use client";

import Image from "next/image";
import { useState } from "react";

interface FacultyOfficerCardProps {
  name: string;
  title: string;
  image: string;
  forceHoverState?: boolean;
}

export default function FacultyOfficerCard({
  name,
  title,
  image,
  forceHoverState,
}: FacultyOfficerCardProps) {
  const [hovered, setHovered] = useState(false);

  const isExpanded = forceHoverState ?? hovered;
  const lastName = name.split(" ").pop() || "";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-2xl p-[2px] 
        bg-gradient-to-br from-[var(--secondary2)] to-[var(--primary1)] 
        shadow-md transition-all duration-500 ease-in-out
        h-[240px] sm:h-[280px]
        ${
          isExpanded
            ? "w-[240px] sm:w-[280px] shadow-xl"
            : "w-[120px] sm:w-[150px]"
        }`}
    >
      <div className="relative w-full h-full flex items-center justify-start overflow-hidden rounded-[14px] bg-gradient-to-br from-[var(--primary1)] to-[var(--primary3)]">
        <Image
          src="/icpep logo.png"
          alt="ICPEP Logo"
          width={300}
          height={300}
          className={`absolute -mt-50 -ml-6 transition-opacity duration-700 ease-in-out pointer-events-none transform-none ${
            isExpanded ? "opacity-20" : "opacity-0"
          }`}
        />
        <div
          className={`flex-shrink-0 transform transition-transform duration-500 ${
            isExpanded ? "translate-x-4 scale-105" : "translate-x-0 scale-100"
          }`}
        >
          <Image
            src={image}
            alt={name}
            width={200}
            height={300}
            className="rounded-xl -mb-10 object-cover h-[260px] w-[180px] sm:h-[320px] sm:w-[220px]"
          />
        </div>
        <div
          className={`absolute inset-x-0 bottom-0 h-1/2 
            bg-gradient-to-t from-[#002231] via-[#00223199] to-transparent 
            z-10 transition-opacity duration-500 ease-in-out pointer-events-none ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
        />
        <div
          className={`absolute left-2 bottom-4 sm:left-4 z-20
            transition-opacity duration-300 ease-in-out ${
              isExpanded ? "opacity-0" : "opacity-100"
            }`}
        >
          <p className="font-raleway text-2xl sm:text-3xl text-white font-semibold [writing-mode:vertical-rl] transform rotate-180 drop-shadow-md">
            {lastName}
          </p>
        </div>
        <div
          className={`absolute left-4 bottom-4 sm:left-6 sm:bottom-6 text-left w-48 h-[70px] sm:w-52 sm:h-[80px] flex flex-col justify-end z-20
            transition-all duration-500 ease-in-out ${
              isExpanded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4 pointer-events-none"
            }`}
        >
          <h3 className="font-rubik text-xl sm:text-2xl font-bold text-white drop-shadow-md">
            {title}
          </h3>
          <p className="font-raleway text-base sm:text-lg text-white leading-tight drop-shadow-md pt-1">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}
