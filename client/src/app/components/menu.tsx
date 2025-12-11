"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

interface MenuProps {
  userRole:
    | "guest"
    | "student"
    | "council-officer"
    | "committee-officer"
    | "faculty";
  onExit: () => void;
}

type MenuItem = {
  label: string;
  href?: string;
  children?: MenuItem[];
};

const Menu: React.FC<MenuProps> = ({ userRole, onExit }) => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // -- Navigation Structure Definition --
  const getNavItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      { label: "Home", href: "/home" },
      { label: "About", href: "/about" },
      
      // --- NEW SECTION: Updates (Announcements & Events) ---
      {
        label: "Updates", 
        children: [
          { label: "Announcements", href: "/announcements" },
          { label: "Events", href: "/events" },
        ],
      },

      {
        label: "Membership",
        children: [
          { label: "Registration", href: "/membership" },
          { label: "Merch", href: "/merch" },
        ],
      },
      { label: "Developers", href: "/developers" },
    ];

    if (userRole === "council-officer") {
      baseItems.push({
        label: "Manage",
        children: [
          { label: "Announcements", href: "/announcements/create" },
          { label: "Events", href: "/events/create" },
          { label: "Merch", href: "/create/merch" },
          { label: "Testimonials", href: "/create/testimonials" },
          { label: "Sponsors", href: "/create/sponsors" },
          { label: "Officers", href: "/create/officers" },
          { label: "Users", href: "/users" },
          { label: "FAQ", href: "/faq" },
        ],
      });
    }

    if (userRole === "council-officer" || userRole === "committee-officer") {
      baseItems.push({ label: "ComMeet", href: "/commeet" });
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const handleNavigate = (href?: string) => {
    if (!href) return;
    onExit();
    router.push(href);
  };

  const handleMouseEnter = (label: string) => {
    setActiveItem(label);
  };

  const handleMouseLeaveNav = () => {
    setActiveItem(null);
  };

  // Helper to determine active children for Desktop Right Panel
  const activeChildren = activeItem
    ? navItems.find((item) => item.label === activeItem)?.children
    : undefined;

  return (
    <div className="w-full min-h-screen bg-[#00609c] text-white font-rubik relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image
          src="/gle.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Header Area */}
      <div className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12 md:py-6">
        {/* LOGO SECTION */}
        <div
          onClick={() => handleNavigate("/home")}
          className="flex items-center gap-3 cursor-pointer group opacity-90 hover:opacity-100 transition-opacity"
        >
          {/* 1. Official Icon */}
          <Image
            src="/icpep logo.png"
            alt="ICPEP Logo"
            width={56}
            height={56}
            className="w-12 h-12 md:w-[54px] md:h-[54px] object-contain"
          />

          {/* 2. Vector Text & Chapter Name */}
          <div className="flex flex-col justify-center gap-[2px]">
            {/* Top: Vector Letters */}
            <div className="flex items-start gap-[1px] h-[26px] md:h-[34px]">
              <Image
                src="/Vector-ifooter.svg"
                alt="I"
                width={0}
                height={34}
                className="h-full w-auto pointer-events-none"
              />
              <Image
                src="/Vector-cfooter.svg"
                alt="C"
                width={0}
                height={34}
                className="h-full w-auto pointer-events-none"
              />
              <Image
                src="/Vector-p1footer.svg"
                alt="P"
                width={0}
                height={34}
                className="h-full w-auto pointer-events-none"
              />
              <Image
                src="/Vector-e1footer.svg"
                alt="E"
                width={0}
                height={34}
                className="h-full w-auto pointer-events-none"
              />
              <Image
                src="/Vector-p2footer.svg"
                alt="P"
                width={0}
                height={34}
                className="h-full w-auto pointer-events-none"
              />

              <Image
                src="/Vector-dotfooter.svg"
                alt="."
                width={0}
                height={8}
                className="h-[30%] w-auto -ml-[2px] mr-[2px] self-end pointer-events-none"
              />

              <Image
                src="/Vector-sfooter.svg"
                alt="S"
                width={0}
                height={34}
                className="h-full w-auto pointer-events-none"
              />
              <Image
                src="/Vector-e2footer.svg"
                alt="E"
                width={0}
                height={34}
                className="h-full w-auto pointer-events-none"
              />
            </div>

            {/* Bottom: Chapter Text */}
            <div className="flex flex-row gap-2 leading-none font-rubik text-white/90">
              <span className="text-[11px] md:text-[13px] font-bold tracking-wide">
                Region 7
              </span>
              <span className="text-[11px] md:text-[13px] font-bold tracking-wide">
                CIT-U Chapter
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onExit}
          className="group cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white group-hover:rotate-90 transition-transform duration-300"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Main Content Wrapper */}
      <div
        onMouseLeave={handleMouseLeaveNav}
        className="flex-1 relative z-10 flex flex-col md:flex-row px-6 md:px-12 pt-4 pb-12 max-w-7xl mx-auto w-full"
      >
        {/* Left Column: Main Categories */}
        <div className="w-full md:w-5/12 lg:w-1/3 flex flex-col gap-2 md:gap-4 md:border-r border-white/10 md:pr-10">
          <h3 className="text-xs font-bold text-[#00a7ee] uppercase tracking-widest mb-2 md:mb-6 font-raleway">
            Navigation
          </h3>

          {navItems.map((item) => (
            <div key={item.label} className="flex flex-col">
              {/* PARENT NAV ITEM */}
              <div
                onMouseEnter={() => handleMouseEnter(item.label)}
                onClick={() => {
                  if (activeItem === item.label) {
                    // If already open, close it (Toggle)
                    setActiveItem(null);
                  } else {
                    // If closed, open it
                    setActiveItem(item.label);
                  }

                  if (!item.children) handleNavigate(item.href);
                }}
                className="group cursor-pointer flex items-center justify-between py-1"
              >
                <span
                  className={`text-3xl md:text-4xl lg:text-5xl font-bold transition-all duration-300 ${
                    activeItem === item.label
                      ? "text-white translate-x-2 md:translate-x-4"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {item.label}
                </span>

                {/* Arrow for active state (Desktop only) */}
                <span
                  className={`hidden md:block text-2xl transition-opacity duration-300 ${
                    activeItem === item.label
                      ? "opacity-100 text-[#00a7ee]"
                      : "opacity-0"
                  }`}
                >
                  &rarr;
                </span>

                {/* Mobile Expansion Indicator */}
                {item.children && (
                  <span
                    className={`md:hidden text-xl text-white/50 ${
                      activeItem === item.label
                        ? "rotate-90 text-[#00a7ee]"
                        : ""
                    } transition-transform duration-300`}
                  >
                    &#8250;
                  </span>
                )}
              </div>

              {/* MOBILE ONLY: SUB-ITEMS (Directly below clicked item) */}
              {activeItem === item.label && item.children && (
                <div className="md:hidden flex flex-col pl-6 mt-2 mb-4 border-l-2 border-[#00a7ee]/30 animate-in slide-in-from-top-2 duration-200">
                  {item.children.map((child) => (
                    <div
                      key={child.label}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(child.href);
                      }}
                      className="py-2 text-xl text-white/80 hover:text-[#00a7ee] cursor-pointer font-raleway"
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: Submenus & Details (Desktop Only) */}
        <div className="hidden md:flex flex-col w-full md:w-7/12 lg:w-2/3 md:pl-16 lg:pl-24 pt-12">
          {/* Submenu Items / Details */}
          {!activeItem ? (
            // Default State: Welcome Message for COMPanions
            <div className="flex flex-col justify-center h-full opacity-60 pb-20 animate-in fade-in duration-500">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Hello, COMPanion!
              </h2>
              <p className="font-raleway text-xl max-w-lg text-white/80 leading-relaxed">
                Welcome to your official ICPEP SE hub. Explore our events,
                manage your membership, and connect with the community.
              </p>
            </div>
          ) : activeChildren ? (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <h3 className="text-white/50 text-sm font-raleway mb-6 uppercase tracking-wider">
                {activeItem} Options
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {activeChildren.map((child) => (
                  <div
                    key={child.label}
                    onClick={() => handleNavigate(child.href)}
                    className="group flex items-center gap-4 cursor-pointer w-fit"
                  >
                    <div className="w-12 h-[1px] bg-white/30 group-hover:w-20 group-hover:bg-[#00a7ee] transition-all duration-300"></div>
                    <span className="text-2xl font-raleway font-light text-white group-hover:text-[#00a7ee] transition-colors">
                      {child.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Information when no sub-items exist */
            <div className="flex flex-col justify-center h-full opacity-60 pb-20 animate-in fade-in duration-500">
              <h2 className="text-4xl font-bold mb-4">{activeItem}</h2>
              <p className="font-raleway text-xl max-w-md mb-6 text-white/80">
                Click to navigate to the {activeItem} page.
              </p>
              <div
                onClick={() =>
                  handleNavigate(
                    navItems.find((i) => i.label === activeItem)?.href
                  )
                }
                className="px-8 py-3 border border-white/30 rounded-full w-fit hover:bg-white hover:text-[#00609c] transition-all cursor-pointer font-semibold"
              >
                Go to {activeItem}
              </div>
            </div>
          )}

          {/* Contact / Get in Touch Section */}
          <div className="mt-auto pt-10 border-t border-white/10 w-full">
            <div className="flex flex-col xl:flex-row items-start justify-between gap-6">
              <div>
                <p className="text-xs font-bold text-[#00a7ee] uppercase tracking-widest mb-2 font-raleway">
                  Get in Touch
                </p>
                <a
                  href="mailto:icpepse@cit.edu"
                  className="block text-xl font-raleway text-white hover:text-[#00a7ee] transition-colors mb-1"
                >
                  icpepse@cit.edu
                </a>
                <p className="text-white/40 text-sm font-raleway">
                  Institute of Computer Engineers of the Philippines Student
                  Edition
                </p>
                <p className="text-white/40 text-sm font-raleway">
                  Cebu Institute of Technology - University
                </p>
              </div>

              <div className="flex gap-4">
                {[
                  {
                    src: "/fb.svg",
                    link: "https://www.facebook.com/cituicpep",
                  },
                  { src: "/email.svg", link: "mailto:icpepse@cit.edu" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300 group"
                  >
                    <Image
                      src={social.src}
                      alt="Social"
                      width={20}
                      height={20}
                      className="opacity-70 group-hover:opacity-100 group-hover:[filter:invert(28%)_sepia(95%)_saturate(1985%)_hue-rotate(186deg)_brightness(93%)_contrast(101%)] transition-all"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;