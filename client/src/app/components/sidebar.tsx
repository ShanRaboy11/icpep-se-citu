"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Megaphone,
  CalendarDays,
  Quote,
  Handshake,
  ShoppingBag,
} from "lucide-react";
import clsx from "clsx";

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    {
      name: "Announcements",
      href: "/announcements/create",
      icon: <Megaphone size={20} />,
    },
    {
      name: "Events",
      href: "/events/create",
      icon: <CalendarDays size={20} />,
    },
    {
      name: "Testimonials",
      href: "/create/testimonials",
      icon: <Quote size={20} />,
    },
    {
      name: "Sponsors",
      href: "/create/sponsors",
      icon: <Handshake size={20} />,
    },
    {
      name: "Merch",
      href: "/create/merch",
      icon: <ShoppingBag size={20} />,
    },
  ];

  return (
    <aside
      className="
    w-full sm:w-60 bg-white sm:border-r border-gray-200
    px-4 py-4 rounded-xl shadow-sm
    sm:flex sm:flex-col sm:items-start sm:gap-2
    h-fit
  "
    >
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={clsx(
            "flex font-rubik items-center gap-2 w-full px-4 py-2 rounded-lg font-medium transition-all",
            pathname === link.href
              ? "bg-primary1 text-white"
              : "hover:bg-gray-100 text-gray-800"
          )}
        >
          {link.icon}
          {link.name}
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;
