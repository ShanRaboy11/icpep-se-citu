"use client";

import { Megaphone, Bell, Calendar, LayoutGrid } from "lucide-react";
import clsx from "clsx";

// Simplified filter types
export type FilterType = "all" | "announcement" | "event" | "others";

interface SidebarProps {
  activeTab: FilterType;
  onTabChange: (tab: FilterType) => void;
  className?: string; // Added className prop for layout control
}

// Exporting config so we can reuse it in the mobile view
export const FILTER_OPTIONS = [
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

const Sidebar = ({ activeTab, onTabChange, className }: SidebarProps) => {
  return (
    <aside
      className={clsx(
        // Layout
        "w-64 flex-shrink-0",
        className, // Allow parent to control visibility (hidden lg:block)

        // CONTAINER STYLES
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
          {FILTER_OPTIONS.map((link) => (
            <button
              key={link.value}
              onClick={() => onTabChange(link.value as FilterType)}
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
  );
};

export default Sidebar;
