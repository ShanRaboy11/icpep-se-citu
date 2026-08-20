"use client";

import type { FC } from "react";
import { Megaphone, ArrowRight } from "lucide-react";

interface AnnouncementCardProps {
  title: string;
  content: string;
  publishDate: string;
  onClick?: () => void;
}

export const AnnouncementCard: FC<AnnouncementCardProps> = ({
  title,
  content,
  publishDate,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col p-6 rounded-3xl border border-slate-100 bg-white hover:bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
          <Megaphone className="h-5 w-5" />
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
            <h5 className="font-rubik text-base font-bold text-slate-800 tracking-tight leading-snug group-hover:text-primary1 transition-colors duration-300">
              {title}
            </h5>
            <span className="font-raleway text-xs text-slate-400 whitespace-nowrap">
              {publishDate}
            </span>
          </div>

          <p className="font-raleway text-sm text-slate-500 leading-relaxed line-clamp-2">
            {content}
          </p>
        </div>
      </div>

      <div className=" flex justify-end">
        <span className="inline-flex items-center gap-1 font-raleway text-xs font-semibold text-primary1 group-hover:text-primary3 transition-colors duration-300">
          View Announcement
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
};

export default AnnouncementCard;
