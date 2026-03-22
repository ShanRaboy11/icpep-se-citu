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
  Check,
} from "lucide-react";
import clsx from "clsx";

const sections = [
  {
    label: "Engagement",
    links: [
      { name: "Announcements", href: "/create/announcements", icon: Megaphone },
      { name: "Events", href: "/create/events", icon: CalendarDays },
    ],
  },
  {
    label: "Community",
    links: [
      { name: "Testimonials", href: "/create/testimonials", icon: Quote },
      { name: "Sponsors", href: "/create/sponsors", icon: Handshake },
      { name: "Officers", href: "/create/officers", icon: Users },
    ],
  },
  {
    label: "Commerce",
    links: [{ name: "Merch", href: "/create/merch", icon: ShoppingBag }],
  },
  {
    label: "Admin",
    links: [{ name: "Drafts", href: "/create/drafts", icon: FileText }],
  },
];

const allLinks = sections.flatMap((s) => s.links);

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 shrink-0 rounded-3xl border border-gray-100 bg-white shadow-sm py-6 px-4 gap-1 relative overflow-hidden">
        {sections.map((section, si) => (
          <div key={section.label} className={clsx(si > 0 && "mt-4")}>
            <p className="font-rubik font-semibold text-primary3 text-sm px-3 mb-2">
              {section.label}
            </p>

            <div className="flex flex-col gap-1">
              {section.links.map((link) => {
                const Icon = link.icon;
                const active =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 font-rubik cursor-pointer",
                      active
                        ? "bg-primary1 text-white shadow-md shadow-primary1/25 font-semibold"
                        : "text-gray-600 hover:bg-primary1/5 hover:text-primary1 hover:translate-x-1",
                    )}
                  >
                    <span
                      className={clsx(
                        "flex items-center justify-center shrink-0 transition-colors",
                        active ? "text-white" : "text-primary1",
                      )}
                    >
                      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                    </span>

                    <span className="flex-1">{link.name}</span>

                    {active ? (
                      <Check size={14} className="text-white" />
                    ) : (
                      <ChevronRight
                        size={14}
                        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </aside>

      <nav className="lg:hidden w-full">
        <div
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1
          [mask-image:linear-gradient(90deg,transparent_0%,black_5%,black_95%,transparent_100%)]"
        >
          {allLinks.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold font-rubik whitespace-nowrap shrink-0 transition-all duration-200",
                  active
                    ? "bg-primary1 border-primary1 text-white shadow-md shadow-primary1/25"
                    : "bg-white border-gray-200 text-gray-500 hover:border-primary1/30 hover:bg-primary1/5 hover:text-primary1",
                )}
              >
                <Icon size={14} strokeWidth={2} />
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
