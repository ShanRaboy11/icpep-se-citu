"use client";

import { User } from "lucide-react";

interface PersonalInformationProps {
  fullName: string;
  idNumber: string;
  yearLevel: string | number;
  email: string;
  loading?: boolean;
}

export function PersonalInformation({
  fullName,
  idNumber,
  yearLevel,
  email,
  loading = false,
}: PersonalInformationProps) {
  if (loading) {
    return (
      <div className="relative w-full border border-primary1/30 rounded-2xl p-6 px-7 sm:px-10 sm:py-8 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg overflow-hidden">
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          }}
        />
        
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary1/20">
          <div className="p-2 bg-gray-200 rounded-lg animate-pulse">
            <div className="w-5 h-5 bg-gray-300 rounded" />
          </div>
          <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse" />
        </div>

        <div className="flex flex-col gap-5">
          {["Full Name", "ID Number", "Year Level", "Institutional Email"].map((label) => (
            <div key={label} className="flex flex-row items-center justify-between p-3 rounded-xl">
              <span className="text-gray-400 font-raleway text-lg font-medium">{label}</span>
              <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-primary1/30 rounded-2xl p-6 px-7 sm:px-10 sm:py-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary1/20">
        <div className="p-2 bg-primary1/10 rounded-lg hover:bg-primary1/20 transition-colors duration-300">
          <User className="w-5 h-5 text-primary1" />
        </div>
        <h2 className="text-xl sm:text-2xl font-rubik text-primary3 font-bold">
          Personal Information
        </h2>
      </div>

      <div className="flex flex-col gap-5 text-sm md:text-base">
        <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <span className="text-gray-700 font-raleway text-lg font-medium">Full Name</span>
          <span className="font-rubik text-primary3 text-lg font-semibold sm:mr-10 text-right">
            {fullName}
          </span>
        </div>

        <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <span className="text-gray-700 font-raleway text-lg font-medium">ID Number</span>
          <span className="font-rubik text-primary3 text-lg font-semibold sm:mr-10">
            {idNumber}
          </span>
        </div>

        <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <span className="text-gray-700 font-raleway text-lg font-medium">Year Level</span>
          <span className="font-rubik text-primary3 text-lg font-semibold sm:mr-10">
            {yearLevel}
          </span>
        </div>

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

