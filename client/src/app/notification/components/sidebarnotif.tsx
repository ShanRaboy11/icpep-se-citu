"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone, Bell, BadgeCheck, Calendar, Menu, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    {
      name: "Announcements",
      href: "/announcements/create",
      icon: <Megaphone size={20} />,
    },
    {
      name: "Approval",
      href: "/approval",
      icon: <BadgeCheck size={20} />,
    },
    {
      name: "Events",
      href: "/events",
      icon: <Calendar size={20} />,
    },
    {
      name: "Reminders",
      href: "/reminders",
      icon: <Bell size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="sm:hidden flex items-center justify-between w-full px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-20">
        <h1 className="text-lg font-semibold text-primary1">Filters</h1>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          {open ? (
            <X size={22} className="text-gray-500" />
          ) : (
            <Menu size={22} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={clsx(
          "bg-white flex flex-col sm:w-60 w-full sm:h-[calc(100vh-100px)]  transition-all duration-300",
          open
            ? "max-h-[300px] sm:max-h-full overflow-y-auto"
            : "max-h-0 sm:max-h-full overflow-hidden sm:overflow-visible"
        )}
      >
        {/* Sidebar Header (Desktop Only) */}
        <div className="hidden sm:block px-4 pt-6 pb-2">
          <h1 className="text-md font-light font-rubik text-gray-500">
            Filters
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 sm:gap-2 px-4 py-2 sm:py-0">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex items-center gap-2 px-4 py-3 rounded-lg font-rubik font-normal transition-all text-sm",
                pathname === link.href
                  ? "bg-primary1 text-white"
                  : "hover:bg-gray-100 text-gray-800"
              )}
              onClick={() => setOpen(false)} // Close on mobile tap
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
