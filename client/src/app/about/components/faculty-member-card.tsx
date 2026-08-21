"use client";

import { FC } from "react";
import Image from "next/image";

interface FacultyMember {
  name: string;
  position: string;
  imageUrl: string;
}

const FacultyMemberCard: FC<FacultyMember> = ({ name, imageUrl }) => {
  return (
    <div className="group relative w-full flex flex-col items-center bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 ease-in-out hover:shadow-primary1/40 hover:-translate-y-1 overflow-hidden p-3 sm:p-8">
      <div className="relative mb-4 sm:mb-7 flex justify-center items-center">
        {/* rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-full border border-gray-100 opacity-100"></div>
          <div className="absolute w-[130px] h-[130px] sm:w-[260px] sm:h-[260px] rounded-full border border-gray-100 opacity-80"></div>
          <div className="absolute w-[160px] h-[160px] sm:w-[320px] sm:h-[320px] rounded-full border border-gray-50 opacity-60"></div>
          <div className="absolute w-[190px] h-[190px] sm:w-[380px] sm:h-[380px] rounded-full border border-gray-50 opacity-40"></div>
        </div>

        {/* glow */}
        <div className="absolute inset-0 bg-primary1/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110 pointer-events-none"></div>

        {/* photo */}
        <div className="relative w-24 h-24 sm:w-40 sm:h-40 p-1.5 sm:p-2 bg-white rounded-full border-2 border-primary1/40 shadow-sm z-10 group-hover:shadow-md group-hover:border-primary1 transition-all duration-300">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={`Profile of ${name}`}
              fill
              sizes="(max-width: 640px) 96px, 160px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* name & role */}
      <div className="relative z-10 text-center">
        <h4 className="font-rubik font-bold text-sm sm:text-xl text-primary3 mb-1 sm:mb-2 leading-tight">
          {name}
        </h4>
        <p className="font-raleway text-[10px] sm:text-sm font-bold text-primary1 uppercase tracking-wider">
          Instructor
        </p>
      </div>
    </div>
  );
};

export default FacultyMemberCard;
