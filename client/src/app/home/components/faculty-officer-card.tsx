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
      className={`relative rounded-2xl p-0.5 
        bg-linear-to-br from-(--secondary2) to-(--primary1) 
        shadow-md transition-all duration-500 ease-in-out
        h-60 sm:h-70
        ${
          isExpanded
            ? "w-60 sm:w-70 shadow-xl"
            : "w-30 sm:w-37.5"
        }`}
    >
      <div className="relative w-full h-full flex items-center justify-start overflow-hidden rounded-[14px] bg-linear-to-br from-(--primary1) to-(--primary3)">
        <Image
          src="/brand/icpep-logo.png"
          alt="ICPEP Logo"
          width={300}
          height={300}
          className={`absolute -mt-50 -ml-6 transition-opacity duration-700 ease-in-out pointer-events-none transform-none ${
            isExpanded ? "opacity-20" : "opacity-0"
          }`}
        />
        <div
          className={`shrink-0 transform transition-transform duration-500 ${
            isExpanded ? "translate-x-4 scale-105" : "translate-x-0 scale-100"
          }`}
        >
          <Image
            src={image}
            alt={name}
            width={200}
            height={300}
            className="rounded-xl -mb-10 object-cover h-65 w-45 sm:h-80 sm:w-55"
          />
        </div>
        <div
          className={`absolute inset-x-0 bottom-0 h-1/2 
            bg-linear-to-t from-[#002231] via-[#00223199] to-transparent 
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
          className={`absolute left-4 bottom-4 sm:left-6 sm:bottom-6 text-left w-48 h-17.5 sm:w-52 sm:h-20 flex flex-col justify-end z-20
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
