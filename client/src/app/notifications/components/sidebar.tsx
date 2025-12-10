"use client";

import { Megaphone, Bell, Calendar, LayoutGrid, Menu, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

// Simplified filter types
export type FilterType = "all" | "announcement" | "event" | "others";

interface SidebarProps {
  activeTab: FilterType;
  onTabChange: (tab: FilterType) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [open, setOpen] = useState(false);

  const links = [
    {
      name: "All Updates",
      value: "all",
      icon: <LayoutGrid size={18} />,
    },
    {
      name: "Announcements",
      value: "announcement",
      icon: <Megaphone size={18} />,
    },
    {
      name: "Events",
      value: "event",
      icon: <Calendar size={18} />,
    },
    {
      name: "Others",
      value: "others",
      icon: <Bell size={18} />,
    },
  ];

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between w-full px-4 py-3 mb-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
        <span className="font-rubik text-sm font-medium text-gray-600">
          Filter:{" "}
          <span className="text-primary1 capitalize font-bold">
            {activeTab}
          </span>
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 -mr-2 text-gray-500 hover:text-primary1 transition-colors"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={clsx(
          // Layout
          "w-full lg:w-64 flex-shrink-0 lg:block overflow-hidden",
          open ? "block mb-8" : "hidden",

          // CONTAINER STYLES (Matched to Search/Action Bar)
          "bg-white rounded-2xl border border-gray-100 shadow-sm",
          "transition-all duration-300",
          "hover:shadow-md hover:border-primary1/30",

          // Tight Padding
          "p-3"
        )}
      >
        <div className="flex flex-col h-full">
          <h3 className="px-4 pb-2 pt-2 font-raleway text-xs font-bold text-gray-400 uppercase tracking-widest">
            Categories
          </h3>

          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <button
                key={link.value}
                onClick={() => {
                  onTabChange(link.value as FilterType);
                  setOpen(false);
                }}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl font-rubik text-sm transition-all duration-200 text-left w-full cursor-pointer",
                  activeTab === link.value
                    ? "bg-primary1 text-white shadow-md shadow-primary1/25 font-semibold"
                    : "text-gray-600 hover:bg-primary1/5 hover:text-primary1 hover:translate-x-1"
                )}
              >
                {link.icon}
                {link.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
