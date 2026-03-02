"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Megaphone,
  CalendarDays,
  Quote,
  Handshake,
  ShoppingBag,
  Users,
  FileText,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const sections = [
  {
    label: "Content",
    links: [
      { name: "Announcements", href: "/announcements/create", icon: Megaphone },
      { name: "Events", href: "/events/create", icon: CalendarDays },
      { name: "Testimonials", href: "/create/testimonials", icon: Quote },
      { name: "Sponsors", href: "/create/sponsors", icon: Handshake },
    ],
  },
  {
    label: "Store",
    links: [
      { name: "Merch", href: "/create/merch", icon: ShoppingBag },
      { name: "Officers", href: "/create/officers", icon: Users },
    ],
  },
  {
    label: "System",
    links: [{ name: "Drafts", href: "/drafts", icon: FileText }],
  },
];

const allLinks = sections.flatMap((s) => s.links);

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop: vertical card (hidden below lg) ── */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm py-4 px-2.5 gap-0.5 relative overflow-hidden">
        {/* Top accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary1 to-primary2 rounded-t-2xl" />

        {sections.map((section, si) => (
          <div key={section.label}>
            {si > 0 && <div className="h-px bg-gray-100 my-2 mx-1" />}

            <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-gray-400 px-3 pt-2 pb-1 font-rubik">
              {section.label}
            </p>

            {section.links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    "group relative flex items-center gap-2.5 px-3 py-2 rounded-xl border text-[13px] font-medium font-rubik transition-all duration-150",
                    active
                      ? "bg-primary1/8 border-primary1/20 text-primary3"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-800"
                  )}
                >
                  {/* Active left bar */}
                  {active && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-full bg-gradient-to-b from-primary1 to-primary2" />
                  )}

                  {/* Icon tile */}
                  <span
                    className={clsx(
                      "flex items-center justify-center w-7 h-7 rounded-lg border shrink-0 transition-all duration-150",
                      active
                        ? "bg-gradient-to-br from-primary1 to-primary2 border-transparent text-white shadow-md shadow-primary1/25"
                        : "bg-gray-100 border-gray-200 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                    )}
                  >
                    <Icon size={13} strokeWidth={2} />
                  </span>

                  <span className="flex-1">{link.name}</span>

                  <ChevronRight
                    size={11}
                    className={clsx(
                      "transition-all duration-150 text-gray-300",
                      active
                        ? "opacity-60 text-primary1"
                        : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                  />
                </Link>
              );
            })}
          </div>
        ))}
      </aside>

      {/* ── Mobile: horizontal pill scroll bar (visible below lg) ── */}
      <nav className="lg:hidden w-full">
        <div
          className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 px-0.5
          [mask-image:linear-gradient(90deg,transparent_0%,black_4%,black_96%,transparent_100%)]"
        >
          {allLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-medium font-rubik whitespace-nowrap shrink-0 transition-all duration-150",
                  active
                    ? "bg-primary1 border-primary1 text-white shadow-md shadow-primary1/25"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                <Icon size={12} strokeWidth={2} />
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
