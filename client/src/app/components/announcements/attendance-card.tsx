"use client";

import { useState } from "react";
import Button from "@/app/components/ui/button";
import CountBadge from "@/app/components/ui/count-badge";
import SectionHeading from "@/app/components/ui/section-heading";
import AttendanceModal, { type Attendee } from "./attendance-modal";
import { formatAttendeeName, shortPosition, sortAttendance } from "@/app/utils/announcements/attendance";

const PREVIEW_COUNT = 4;

interface MeetingAttendanceCardProps {
  title: string;
  date: string;
  time?: string;
  location?: string;
  attendance?: Attendee[];
}

export default function MeetingAttendanceCard({
  title,
  date,
  time,
  location,
  attendance = [],
}: MeetingAttendanceCardProps) {
  const [open, setOpen] = useState(false);
  if (attendance.length === 0) return null;

  const preview = sortAttendance(attendance).slice(0, PREVIEW_COUNT);
  const remaining = attendance.length - preview.length;

  return (
    <>
      <div className="rounded-3xl border border-primary1/15 bg-white p-5 shadow-md sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <SectionHeading as="h3">Attendance</SectionHeading>
          <CountBadge count={attendance.length} />
        </div>

        {preview.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {preview.map((person) => (
              <li key={`${person.name}|${person.position}`} className="py-2.5">
                <p className="font-raleway text-sm font-semibold text-primary3">{formatAttendeeName(person.name)}</p>
                {person.position && (
                  <p className="font-raleway text-xs text-gray-500">{shortPosition(person.position)}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        {remaining > 0 && (
          <p className="mt-2 font-raleway text-xs text-gray-400">
            +{remaining} more {remaining === 1 ? "attendee" : "attendees"}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-3">
          {attendance.length > 0 && (
            <Button variant="hero" rounded="lg" className="w-full py-3" onClick={() => setOpen(true)}>
              View full attendance
            </Button>
          )}
        </div>
      </div>

      {open && (
        <AttendanceModal
          title={title}
          date={date}
          time={time}
          location={location}
          attendance={attendance}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
