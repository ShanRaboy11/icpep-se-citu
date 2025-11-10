"use client";

import React from "react";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  content: string;
  type: string;
  publishDate: string;
  author?: {
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  agenda?: string[];
  awardees?: Array<{
    name: string;
    program?: string;
    year: string;
    award: string;
  }>;
  attachments?: Array<{
    name: string;
    url: string;
    fileType?: string;
  }>;
}

interface AnnouncementDetailsProps {
  announcement: Announcement;
}

export default function AnnouncementDetails({ announcement }: AnnouncementDetailsProps) {
  // Add null/undefined checks
  if (!announcement) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <p className="font-raleway text-gray-600">Loading announcement details...</p>
      </div>
    );
  }

  const isMeeting = announcement.type?.toLowerCase() === "meeting";
  const isAward = announcement.type?.toLowerCase() === "award" || announcement.type?.toLowerCase() === "achievement";
  
  // Format date properly
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date not available";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Date not available";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary1"></div>
          <span className="font-raleway text-sm text-gray-600">
            {announcement.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-raleway text-sm text-gray-600">
            {formatDate(announcement.publishDate)}
          </span>
        </div>
        {announcement.author && (
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-400"
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
            <span className="font-raleway text-sm text-gray-600">
              {announcement.author.firstName} {announcement.author.lastName}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="font-rubik text-2xl font-bold text-primary3 mb-4">
          About this {announcement.type}
        </h2>
        <p className="font-raleway text-gray-600 leading-relaxed">
          {announcement.description}
        </p>
      </div>

      {/* Content */}
      <div className="mb-8">
        <h3 className="font-rubik text-xl font-semibold text-primary3 mb-3">
          Details
        </h3>
        <div className="font-raleway text-gray-600 leading-relaxed whitespace-pre-wrap">
          {announcement.content}
        </div>
      </div>

      {/* Agenda - Only show for Meetings */}
      {isMeeting && announcement.agenda && announcement.agenda.length > 0 && (
        <div className="mb-8">
          <h3 className="font-rubik text-xl font-semibold text-primary3 mb-4">
            Agenda
          </h3>
          <ol className="space-y-3">
            {announcement.agenda.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-rubik font-semibold text-primary1 min-w-[2rem]">
                  {index + 1}.
                </span>
                <span className="font-raleway text-gray-600">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Awardees - Only show for Awards/Achievement */}
      {isAward && announcement.awardees && announcement.awardees.length > 0 && (
        <div className="mb-8">
          <h3 className="font-rubik text-xl font-semibold text-primary3 mb-4">
            Award Recipients
          </h3>
          <div className="space-y-4">
            {announcement.awardees.map((awardee, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-100"
              >
                <h4 className="font-rubik font-semibold text-primary3 mb-2">
                  {awardee.name}
                </h4>
                <div className="space-y-1">
                  {awardee.program && (
                    <p className="font-raleway text-sm text-gray-600">
                      <span className="font-semibold">Program:</span>{" "}
                      {awardee.program}
                    </p>
                  )}
                  <p className="font-raleway text-sm text-gray-600">
                    <span className="font-semibold">Year:</span> {awardee.year}
                  </p>
                  <p className="font-raleway text-sm text-primary1 font-semibold">
                    {awardee.award}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachments - Show for all types if available */}
      {announcement.attachments && announcement.attachments.length > 0 && (
        <div>
          <h3 className="font-rubik text-xl font-semibold text-primary3 mb-4">
            Attachments
          </h3>
          <div className="space-y-2">
            {announcement.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary1 hover:bg-primary1/5 transition-all duration-200"
              >
                <svg
                  className="h-5 w-5 text-primary1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="font-raleway text-sm font-medium text-gray-900 truncate">
                    {attachment.name}
                  </p>
                  {attachment.fileType && (
                    <p className="font-raleway text-xs text-gray-500">
                      {attachment.fileType}
                    </p>
                  )}
                </div>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}