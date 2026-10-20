"use client";

import { useState } from "react";
import Image from "next/image";
import ReportEventModal from "./report-modal";

interface Props {
  organizer?:
    | {
        name?: string;
        avatarImageUrl?: string;
        [key: string]: unknown;
      }
    | string;
  eventTitle?: string;
  eventId?: string;
}

export default function OrganizerCard({ organizer, eventTitle, eventId }: Props) {
  const [imgError, setImgError] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  if (!organizer) {
    return null;
  }

  const organizerData =
    typeof organizer === "string"
      ? { name: organizer, avatarImageUrl: undefined }
      : organizer;

  const name = organizerData.name || "Event Organizer";
  const avatarUrl = organizerData.avatarImageUrl || "/placeholders/placeholder-avatar.svg";

  return (
    <div className="overflow-hidden rounded-3xl border border-primary1/15 bg-white shadow-lg">
      <div className="flex items-center gap-4 bg-linear-to-r from-primary1/15 to-primary3/10 px-6 py-5">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white ring-2 ring-white shrink-0">
          {!imgError ? (
            <Image
              src={avatarUrl}
              alt={`${name} logo`}
              fill
              sizes="3.5rem"
              onError={() => setImgError(true)}
              unoptimized={avatarUrl.endsWith(".svg")}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary1/10 text-primary1">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-rubik font-bold text-base sm:text-lg text-primary3">
            {name}
          </h3>
          <p className="font-raleway text-sm text-bodytext">Event Organizer</p>
        </div>
      </div>
      <div className="space-y-3 p-6">
        <button
          onClick={() =>
            (window.location.href = "mailto:icpep.seofficial2526@gmail.com")
          }
          className="w-full cursor-pointer rounded-xl bg-primary1 px-6 py-3 text-center font-raleway font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-primary2"
        >
          Contact Host
        </button>
        <button
          onClick={() => setShowReportModal(true)}
          className="w-full cursor-pointer rounded-xl border border-primary1/60 bg-transparent px-6 py-3 text-center font-raleway font-bold text-primary1 shadow-md transition-all hover:scale-105 hover:bg-primary1/10"
        >
          Report Event
        </button>
      </div>

      {eventId && (
        <ReportEventModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          eventId={eventId}
          eventTitle={eventTitle || name}
        />
      )}
    </div>
  );
}
