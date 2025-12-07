"use client";

import { FC } from "react";
import Image from "next/image";

interface FacultyMember {
  name: string;
  position: string;
  imageUrl: string;
}

const DepartmentHeadCard: FC<FacultyMember> = ({
  name,
  position,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col items-center text-center relative group cursor-default">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-primary1/20 blur-[40px] sm:blur-[60px] rounded-full -z-10 transition-all duration-500 group-hover:bg-primary1/30"></div>

      <div className="relative mb-3 sm:mb-5">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary1 to-primary3 blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

        <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full border-4 border-white shadow-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={`Profile of ${name}`}
            fill
            sizes="(max-width: 640px) 128px, 176px"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
      </div>

      <h3 className="font-rubik text-2xl sm:text-3xl font-bold text-primary3 mb-1 sm:mb-2">
        {name}
      </h3>
      <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary1/10 text-primary1 font-raleway font-bold text-xs sm:text-sm tracking-wide">
        {position}
      </span>
    </div>
  );
};

export default DepartmentHeadCard;
