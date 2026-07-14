"use client";

import type { FC } from "react";
import Image from "next/image";
import { User, Edit2, BadgeInfo } from "lucide-react";

interface ProfileSummaryProps {
  name: string;
  studentNumber: string;
  program: string;
  yearLevel: string;
  imageUrl?: string;
  onEdit?: () => void;
}

export const ProfileSummary: FC<ProfileSummaryProps> = ({
  name,
  studentNumber,
  program,
  yearLevel,
  imageUrl,
  onEdit,
}) => {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm relative overflow-hidden group">
      {/* Visual background element */}
      <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/5 blur-lg pointer-events-none" />

      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-primary1 bg-slate-100 flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/gle.png";
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-primary1">
              <User className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h4 className="font-rubik text-base font-bold text-slate-800 tracking-tight truncate leading-tight">
            {name}
          </h4>
          <p className="mt-1 font-raleway text-xs text-slate-400 font-semibold tracking-wide">
            STUDENT MEMBER
          </p>
        </div>
      </div>

      <div className="space-y-3.5 mb-6">
        <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
          <span className="font-raleway text-xs text-slate-400">Student No.</span>
          <span className="font-rubik text-sm font-bold text-slate-700">{studentNumber}</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
          <span className="font-raleway text-xs text-slate-400">Program</span>
          <span className="font-raleway text-sm font-bold text-slate-700">{program}</span>
        </div>
        <div className="flex items-center justify-between pb-1">
          <span className="font-raleway text-xs text-slate-400">Year Level</span>
          <span className="font-raleway text-sm font-bold text-slate-700">{yearLevel}</span>
        </div>
      </div>
      <button
  onClick={onEdit}
  className="flex items-center justify-center gap-2 bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-buttonbg1 hover:border-primary1 hover:text-primary1 font-raleway font-semibold px-8 py-3 rounded-full transition-all duration-300 cursor-pointer w-[220px] sm:w-auto"
>
  <Edit2 className="h-4 w-4" />
  <span>Edit Profile</span>
</button>
    </div>
  );
};

export default ProfileSummary;
