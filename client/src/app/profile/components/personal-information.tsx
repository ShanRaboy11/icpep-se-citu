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
      <div className="relative w-full border border-primary1/10 rounded-3xl p-5 bg-white shadow-lg overflow-hidden">
        <div className="absolute inset-0 -translate-x-full shimmer-bg-animate" />
        <div className="flex items-center gap-4 mb-4 pb-3 border-b border-primary1/5">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
          <div className="h-6 w-40 bg-gray-100 rounded-md" />
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center px-1">
              <div className="h-4 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-primary1/10 rounded-3xl p-5 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 pb-3 border-b border-primary1/5">
        <div className="p-3 bg-primary1/10 rounded-2xl text-primary1 flex-shrink-0">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-rubik font-bold text-primary3 leading-tight">
            Personal Information
          </h2>
          <p className="font-raleway text-xs text-gray-500 mt-0.5">
            Basic account details
          </p>
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2">
        <InfoRow label="Full Name" value={fullName} capitalize />
        <InfoRow label="ID Number" value={idNumber} />
        <InfoRow label="Year Level" value={String(yearLevel)} />
        <InfoRow label="Institutional Email" value={email} />
      </div>
    </div>
  );
}

function InfoRow({ label, value, capitalize = false }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors duration-200">
      <span className="text-gray-600 font-raleway font-semibold text-sm mb-1 sm:mb-0">
        {label}
      </span>
      <span 
        className={`font-rubik text-gray-800 font-medium text-base text-left sm:text-right break-all sm:break-normal max-w-full sm:max-w-[60%] ${capitalize ? 'capitalize' : ''}`}
      >
        {capitalize ? value.toLowerCase() : value}
      </span>
    </div>
  );
}