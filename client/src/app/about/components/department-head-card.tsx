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
      {/* glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  w-40 h-40 sm:w-56 sm:h-56 bg-primary1/20 
                  blur-[50px] sm:blur-[70px] rounded-full -z-10 
                  transition-all duration-500 group-hover:bg-primary1/30"
      ></div>

      <div className="relative mb-4 sm:mb-6">
        {/* gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary1 to-primary3 blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

        {/* photo */}
        <div className="relative w-36 h-36 sm:w-52 sm:h-52 rounded-full border-4 border-white shadow-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={`Profile of ${name}`}
            fill
            sizes="(max-width: 640px) 144px, 208px"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
      </div>

      {/* name */}
      <h3 className="font-rubik text-2xl sm:text-3xl font-bold text-primary3 mb-1 sm:mb-2">
        {name}
      </h3>

      {/* pill */}
      <div
        className="mt-2 inline-flex items-center px-5 py-2 
                  rounded-full border-2 border-primary1/60 
                  text-primary1 bg-white
                  font-raleway font-bold 
                  text-[10px] sm:text-sm 
                  uppercase tracking-wider
                  transition-all duration-300 
                  group-hover:border-primary1 group-hover:shadow-sm"
      >
        {position}
      </div>
    </div>
  );
};

export default DepartmentHeadCard;
