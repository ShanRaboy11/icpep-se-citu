'use client';

import type { NextPage } from 'next';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface MenuProps {
  userRole: 'guest' | 'user';
  onExit: () => void;
}

const Menu: React.FC<MenuProps> = ({ userRole, onExit }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const submenus: Record<string, string[]> = {
    Home: [
      "Home",
      "About ICpEP",
      "Why join ICpEP",
      "Latest Announcements",
      "Upcoming Events",
      "Testimonials",
      "Council Officers & Faculty",
      "Partners / Sponsors",
      "FAQ",
    ],
    About: [
      "Org info",
      "Org faculty profiles",
      "Org officers profiles",
      "CPE dept faculty profiles",
    ],
    Events: ["Upcoming events", "Event calendar", "Gallery"],
    Membership: [
      "Membership details",
      "Members (officers & faculty only)",
      "Merch",
    ],
    Connect: ["Lettucemeet", "Schedule"],
    Developers: ["About ExceptionHandlers", "Developers profiles"],
  };
  
  const router = useRouter();
  

  // Handle navigation for menu items
  const handleMenuClick = (item: string) => {
    if (item === "Developers") {
      router.push("/developers");
    } else if (item === "Home") {
      //router.push("/landing-page");
    } else if (item === "Events") {
      router.push("/events");
    } else {
      console.log(`Navigate to /${item.toLowerCase()}`);
      // Add other navigation logic here
    }
  };

  // Cancel timeout when hovered changes (user re-enters)
  useEffect(() => {
    if (hovered && leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
    }
  }, [hovered]);

  const handleMouseEnter = (item: string) => {
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
    setHovered(item);
  };

  const handleMouseLeave = () => {
    // Delay hover removal by 5 seconds
    leaveTimeout.current = setTimeout(() => {
      setHovered(null);
    }, 300);
  };

  const currentMenu = hovered;

  return (
    <div className="w-full min-h-screen bg-steelblue-200 text-white font-rubik relative overflow-hidden px-5 sm:px-50">
      {/* Background image */}
      <div className="absolute inset-0 opacity-20">
        <Image src="/gle.png" alt="Background" fill className="object-cover" />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Logo */}
        <div className="flex flex-col items-center pt-8 pb-5">
          <Image
            src="/icpep logo-footer.svg"
            alt="ICPEP Logo"
            width={50}
            height={50}
            className="sm:h-32 h-10 w-auto"
          />
          <div className="text-center text-white mt-8">
            <h1 className="text-sm sm:text-xl font-light">
              Institute of Computer Engineers of the Philippines Student Edition
            </h1>
            <h1 className="text-sm sm:text-xl font-light">
              Region 7 Cebu Institute of Technology-University Chapter
            </h1>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/30 my-6"></div>

        {/* Main Section */}
        <div className="flex-1 flex flex-row flex-nowrap px-8 py-6 transition-all duration-300 mb-20 sm:mb-0">
          {/* Left Menu */}
          <div className="sm:w-1/3 mb-8 w-1/2">
            <nav className="flex flex-col space-y-6">
              {Object.keys(submenus).map((item) => (
                <div
                  key={item}
                  onMouseEnter={() => handleMouseEnter(item)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleMenuClick(item)}
                  className="relative inline-block cursor-pointer group w-fit"
                >
                  <span
                    className={`text-lg sm:text-3xl font-raleway transition-colors duration-300 ${
                      currentMenu === item ? "text-white/90" : "text-white"
                    }`}
                  >
                    {item}
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 h-[3px] bg-white transition-all duration-300 ${
                      currentMenu === item ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  ></span>
                </div>
              ))}
              <div
                key="Exit"
                onClick={onExit}
                className="relative inline-block cursor-pointer group w-fit mt-8"
              >
                <span className="text-lg sm:text-3xl font-raleway transition-colors duration-300 text-white">
                  Exit
                </span>
                <span className="absolute left-0 bottom-0 h-[3px] bg-white w-0 opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-100"></span>
              </div>
            </nav>
          </div>

          {/* Submenu Column */}
          <div
            className={`w-1/2 sm:w-1/3 transition-all duration-300 ${
              currentMenu
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8 pointer-events-none"
            }`}
            onMouseEnter={() => handleMouseEnter(currentMenu!)}
            onMouseLeave={handleMouseLeave}
          >
            {currentMenu && submenus[currentMenu]?.length > 0 && (
              <div className="flex flex-col space-y-4">
                {submenus[currentMenu].map((submenu) => (
                  <div
                    key={submenu}
                    className="relative inline-block cursor-pointer group w-fit"
                    onClick={() => {
                      // Handle submenu clicks
                      if (currentMenu === "Developers" && submenu === "Developers profiles") {
                        router.push("/developers");
                      }
                      if (currentMenu === "Events" && submenu === "Upcoming events") {
                        router.push("/events");
                      }
                    }}
                  >
                    <span className="text-md sm:text-2xl font-raleway transition-colors duration-300 group-hover:text-white/80">
                      {submenu}
                    </span>
                    <span className="absolute left-0 bottom-0 h-[2px] bg-white transition-all duration-300 w-0 group-hover:w-full"></span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Us */}
          <div className="sm:ml-20 sm:mt-0 mt-10 sm:block hidden">
            <h3 className="text-white text-xl font-semibold mb-4">Contact Us</h3>
            <div className="flex gap-4 mt-6">
              <Image
                src="/fb.svg"
                alt="Facebook"
                width={24}
                height={24}
                className="cursor-pointer hover:opacity-80 transition"
              />
              <Image
                src="/email.svg"
                alt="Email"
                width={24}
                height={24}
                className="cursor-pointer hover:opacity-80 transition"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/30 my-0"></div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-white text-sm">
            Copyright © 2025 ICpEP Student Edition R7 CIT-U Chapter. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Menu;