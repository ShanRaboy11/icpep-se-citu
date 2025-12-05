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
      <div className="relative mb-3 sm:mb-6 flex justify-center items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[90px] h-[90px] sm:w-[180px] sm:h-[180px] rounded-full border border-gray-100 opacity-100"></div>
          <div className="absolute w-[120px] h-[120px] sm:w-[240px] sm:h-[240px] rounded-full border border-gray-100 opacity-80"></div>
          <div className="absolute w-[150px] h-[150px] sm:w-[300px] sm:h-[300px] rounded-full border border-gray-50 opacity-60"></div>
          <div className="absolute w-[180px] h-[180px] sm:w-[360px] sm:h-[360px] rounded-full border border-gray-50 opacity-40"></div>
        </div>

        <div className="absolute inset-0 bg-primary1/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110 pointer-events-none"></div>

        <div className="relative w-20 h-20 sm:w-36 sm:h-36 p-1 sm:p-1.5 bg-white rounded-full border-2 border-primary1/40 shadow-sm z-10 group-hover:shadow-md group-hover:border-primary1 transition-all duration-300">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={`Profile of ${name}`}
              fill
              sizes="(max-width: 640px) 80px, 144px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

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
