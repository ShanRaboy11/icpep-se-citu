"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Megaphone,
  CalendarDays,
  Quote,
  Handshake,
  ShoppingBag,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  Check,
  CreditCard,
  Wrench,
} from "lucide-react";
import clsx from "clsx";

const baseSections = [
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
      { name: "Advisors", href: "/create/advisors", icon: GraduationCap },
      { name: "Faculty", href: "/create/faculty", icon: BookOpen },
    ],
  },
  {
    label: "Commerce",
    links: [
      { name: "Merch", href: "/create/merch", icon: ShoppingBag },
      { name: "Membership", href: "/create/membership", icon: CreditCard },
    ],
  },
  {
    label: "Admin",
    links: [{ name: "Drafts", href: "/create/drafts", icon: FileText }],
  },
];

const MAINTENANCE_LINK = { name: "Maintenance", href: "/create/maintenance", icon: Wrench };

const Sidebar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("userRole") === "admin");
  }, []);

  // Only admins get the maintenance toggle — everyone else on this sidebar
  // (council officers) never sees the link.
  const sections = isAdmin
    ? baseSections.map((section) =>
        section.label === "Admin"
          ? { ...section, links: [...section.links, MAINTENANCE_LINK] }
          : section,
      )
    : baseSections;

  const allLinks = sections.flatMap((s) => s.links);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const currentLink = allLinks.find((link) => isActive(link.href));
  const CurrentIcon = currentLink?.icon;

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

      <nav ref={menuRef} className="lg:hidden relative w-full">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-primary1/40 cursor-pointer"
        >
          <span className="font-raleway text-xs font-medium text-gray-400">
            Manage
          </span>
          <span className="flex flex-1 items-center gap-2 font-rubik text-sm font-bold text-primary3">
            {CurrentIcon && <CurrentIcon size={16} className="text-primary1" />}
            {currentLink?.name ?? "Select a section"}
          </span>
          <ChevronDown
            size={16}
            className={clsx(
              "text-gray-400 transition-transform duration-200",
              menuOpen && "rotate-180",
            )}
          />
        </button>

        {menuOpen && (
          <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <div className="max-h-80 overflow-y-auto overflow-x-hidden p-2 themed-scrollbar">
              {sections.map((section) => (
                <div key={section.label} className="mb-1 last:mb-0">
                  <p className="px-3 pb-1 pt-2 font-raleway text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {section.label}
                  </p>
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={clsx(
                          "flex items-center gap-3 rounded-xl px-3 py-2 font-rubik text-sm transition-colors",
                          active
                            ? "bg-primary1/10 font-semibold text-primary1"
                            : "text-gray-600 hover:bg-gray-50",
                        )}
                      >
                        <Icon size={16} />
                        <span className="flex-1">{link.name}</span>
                        {active && <Check size={14} />}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Sidebar;
