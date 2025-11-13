"use client";

import React from "react";
import Link from "next/link";
import { Megaphone, CalendarDays } from "lucide-react";
import clsx from "clsx";

interface DraftItem {
  _id: string;
  title: string;
  publishDate?: string;
  isPublished?: boolean;
  type?: string;
}

type Props = {
  activeView: "announcements" | "events";
  onChangeView: (v: "announcements" | "events") => void;
  announcements: DraftItem[];
  events: DraftItem[];
};

export default function DraftsSidebar({
  activeView,
  onChangeView,
  announcements,
  events,
}: Props) {
  const annCount = (announcements || []).filter((a) => !a.isPublished).length;
  const evtCount = (events || []).filter((e) => !e.isPublished).length;

  const links = [
    {
      name: "Announcements",
      key: "announcements",
      icon: <Megaphone size={18} />,
      count: annCount,
    },
    {
      name: "Events",
      key: "events",
      icon: <CalendarDays size={18} />,
      count: evtCount,
    },
  ];

  return (
    <aside className="w-full sm:w-60 bg-white sm:border-r border-gray-200 flex sm:flex-col sm:items-start sm:gap-2 sm:px-4 px-4 py-1 sm:h-[calc(100vh-100px)]">
      {links.map((link) => (
        <button
          key={link.key}
          onClick={() => onChangeView(link.key as "announcements" | "events")}
          className={clsx(
            "flex font-rubik items-center gap-2 w-full px-4 py-2 rounded-lg font-medium transition-all",
            activeView === (link.key as "announcements" | "events") ? "bg-primary1 text-white" : "hover:bg-gray-100 text-gray-800"
          )}
        >
          {link.icon}
          {link.name}
        </button>
      ))}
    </aside>
  );
}
