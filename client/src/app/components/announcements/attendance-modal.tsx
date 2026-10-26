"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import CountBadge from "@/app/components/ui/count-badge";
import SectionHeading from "@/app/components/ui/section-heading";
import { X } from "lucide-react";
import { formatDate, formatTime } from "@/app/utils/announcements/announcements";
import { formatAttendeeName, groupAttendance, groupPosition } from "@/app/utils/announcements/attendance";
import { useBodyScrollLock } from "@/app/hooks/use-body-scroll-lock";

export interface Attendee {
  name: string;
  position?: string;
}

interface AttendanceModalProps {
  title: string;
  date: string;
  time?: string;
  location?: string;
  attendance: Attendee[];
  onClose: () => void;
}

export default function AttendanceModal({ title, date, time, location, attendance, onClose }: AttendanceModalProps) {
  useBodyScrollLock(true);
  const groups = groupAttendance(attendance);
  const pills = [formatDate(date), time ? formatTime(time) : null, location].filter(Boolean) as string[];

  return createPortal(
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="relative flex items-center gap-4 border-b border-gray-100 px-6 py-5 sm:px-8">
          <Image src="/brand/icpep-logo.avif" alt="ICpEP Logo" width={56} height={56} className="shrink-0 rounded-full" />
          <div className="min-w-0 pr-8">
            <h2 className="font-rubik text-xl font-bold leading-tight text-primary3 sm:text-2xl">{title}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full bg-primary1/10 px-3 py-1 font-raleway text-xs font-semibold text-primary1"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="group absolute right-4 top-4 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        <div className="themed-scrollbar flex-1 space-y-5 overflow-y-auto p-6 sm:p-8">
          {groups.map((group) => (
            <div key={group.name} className="rounded-2xl border border-primary1/15 bg-white p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <SectionHeading as="h3" size="md">{group.name}</SectionHeading>
                <CountBadge count={group.members.length} />
              </div>
              <ul className="divide-y divide-gray-100">
                {group.members.map((member) => (
                  <li
                    key={`${member.name}|${member.position}`}
                    className="flex items-baseline justify-between gap-4 py-2.5 font-raleway"
                  >
                    <span className="text-sm font-semibold text-primary3">{formatAttendeeName(member.name)}</span>
                    <span className="text-right text-xs text-gray-500">{groupPosition(member.position, group.isCouncil)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
