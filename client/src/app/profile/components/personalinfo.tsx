"use client";

import { User } from "lucide-react";

interface PersonalInformationProps {
  fullName: string;
  idNumber: string;
  yearLevel: string | number;
  email: string;
}

export default function PersonalInformation({
  fullName,
  idNumber,
  yearLevel,
  email,
}: PersonalInformationProps) {
  return (
    <div className="w-full border border-primary1/30 rounded-2xl p-6 px-7 sm:px-10 sm:py-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary1/20">
        <div className="p-2 bg-primary1/10 rounded-lg hover:bg-primary1/20 transition-colors duration-300">
          <User className="w-5 h-5 text-primary1" />
        </div>
        <h2 className="text-xl sm:text-2xl font-rubik text-primary3 font-bold">
          Personal Information
        </h2>
      </div>

      <div className="flex flex-col gap-5 text-sm md:text-base">
        {/* Full Name */}
        <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <span className="text-gray-700 font-raleway text-lg font-medium">Full Name</span>
          <span className="font-rubik text-primary3 text-lg font-semibold sm:mr-10 text-right">
            {fullName}
          </span>
        </div>

        {/* ID Number */}
        <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <span className="text-gray-700 font-raleway text-lg font-medium">ID Number</span>
          <span className="font-rubik text-primary3 text-lg font-semibold sm:mr-10">
            {idNumber}
          </span>
        </div>

        {/* Year Level */}
        <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <span className="text-gray-700 font-raleway text-lg font-medium">Year Level</span>
          <span className="font-rubik text-primary3 text-lg font-semibold sm:mr-10">
            {yearLevel}
          </span>
        </div>

        {/* Email */}
        <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <span className="text-gray-700 font-raleway text-lg font-medium">
            Institutional Email
          </span>
          <span className="font-rubik text-primary3 text-lg font-semibold sm:mr-10 truncate max-w-xs text-right">
            {email}
          </span>
        </div>
      </div>
    </div>
  );
}