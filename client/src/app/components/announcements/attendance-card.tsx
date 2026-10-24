"use client";

import { useState } from "react";
import Button from "@/app/components/ui/button";
import CountBadge from "@/app/components/ui/count-badge";
import SectionHeading from "@/app/components/ui/section-heading";

interface Attendee {
  name: string;
  position?: string;
}

const COLLAPSED_COUNT = 6;

const isHttpUrl = (value: string) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

export default function MeetingAttendanceCard({
  attendance = [],
  attendanceLink,
}: {
  attendance?: Attendee[];
  attendanceLink?: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const link = attendanceLink && isHttpUrl(attendanceLink) ? attendanceLink : null;
  if (attendance.length === 0 && !link) return null;

  const visible = expanded ? attendance : attendance.slice(0, COLLAPSED_COUNT);
  const hidden = attendance.length - visible.length;

  return (
    <div className="rounded-3xl border border-primary1/15 bg-white p-5 shadow-md sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <SectionHeading as="h3">Attendance</SectionHeading>
        <CountBadge count={attendance.length} />
      </div>

      {attendance.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {visible.map((person) => (
            <li key={`${person.name}|${person.position}`} className="flex items-baseline justify-between gap-4 py-2.5">
              <span className="font-raleway text-sm font-semibold text-primary3">{person.name}</span>
              {person.position && <span className="text-right font-raleway text-xs text-gray-500">{person.position}</span>}
            </li>
          ))}
        </ul>
      )}

      {attendance.length > COLLAPSED_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-3 cursor-pointer font-raleway text-sm font-semibold text-primary1 hover:underline"
        >
          {expanded ? "Show less" : `Show ${hidden} more`}
        </button>
      )}

      {link && (
        <Button
          variant="heroOutline"
          rounded="lg"
          className="mt-5 w-full py-3"
          onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
        >
          Open attendance form
        </Button>
      )}
    </div>
  );
}
