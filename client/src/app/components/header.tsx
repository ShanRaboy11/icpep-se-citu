"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "./button";
import Menu from "./menu";
import { useRouter } from "next/navigation";

// UserRole types
type UserRole =
  | "guest"
  | "student"
  | "council-officer"
  | "committee-officer"
  | "faculty";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- NEW: Prevent Body Scroll when Menu is Open ---
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup ensures scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  // -------------------------------------------------

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (token && userRole) {
      setIsLoggedIn(true);
      setRole(userRole as UserRole);
      const storedUserName = localStorage.getItem("userName");
      setUserName(storedUserName || "ICPEP Member");
    } else {
      setIsLoggedIn(false);
      setRole("guest");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");

    setIsLoggedIn(false);
    setRole("guest");
    setUserName("");
    setProfileDropdownOpen(false);

    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Helper for Dropdown Items
  const DropdownItem = ({
    icon,
    text,
    onClick,
    isDestructive = false,
  }: {
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
    isDestructive?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-all duration-200 group cursor-pointer
        ${isDestructive ? "hover:bg-red-50" : "hover:bg-[#f0f9ff]"}`}
    >
      <div
        className={`transition-colors duration-200 
        ${
          isDestructive
            ? "text-[#64748b] group-hover:text-red-500"
            : "text-[#64748b] group-hover:text-[#00a7ee]"
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-sm font-medium font-rubik tracking-wide transition-colors duration-200
        ${
          isDestructive
            ? "text-[#373d47] group-hover:text-red-500"
            : "text-[#373d47] group-hover:text-[#00a7ee]"
        }`}
      >
        {text}
      </span>
    </button>
  );

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 right-0 z-40 border-b border-foreground cursor-default transition-all duration-500
        ${
          scrolled
            ? "bg-white/85 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            : "bg-[#fefeff]"
        }`}
      >
        <div className="flex items-center justify-between py-3 px-4 md:max-w-[88%] md:mx-auto md:px-8 lg:px-10">
          {/* Logo Section */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Image
              src="/icpep logo.png"
              alt="ICPEP Logo"
              width={55}
              height={55}
              className="md:h-15 md:w-auto sm:h-25 sm:w-auto rounded-full cursor-pointer 
                       transition-all duration-300 ease-in-out 
                       hover:drop-shadow-[0_0_8px_rgba(0,167,238,0.7)]"
              onClick={() => router.push("/home")}
            />
            <div className="flex items-end gap-0.5">
              <Image
                src="/Vector-i.svg"
                alt="I"
                width={0}
                height={50}
                className="h-0 w-auto sm:h-12"
              />
              <Image
                src="/Vector-c.svg"
                alt="C"
                width={0}
                height={50}
                className="h-0 w-auto sm:h-12"
              />
              <Image
                src="/Vector-p1.svg"
                alt="P"
                width={0}
                height={50}
                className="h-0 w-auto sm:h-12"
              />
              <Image
                src="/Vector-e1.svg"
                alt="E"
                width={0}
                height={50}
                className="h-0 w-auto sm:h-12"
              />
              <Image
                src="/Vector-p2.svg"
                alt="P"
                width={0}
                height={50}
                className="h-0 w-auto sm:h-12"
              />
              <Image
                src="/Vector-dot.svg"
                alt="."
                width={0}
                height={16}
                className="h-0 w-auto sm:h-3.5 -ml-2"
              />
              <Image
                src="/Vector-s.svg"
                alt="S"
                width={0}
                height={50}
                className="h-0 w-auto sm:h-12"
              />
              <Image
                src="/Vector-e2.svg"
                alt="E"
                width={0}
                height={50}
                className="h-0 w-auto sm:h-12"
              />
            </div>
            <div className="min-w-0 font-rubik -ml-2">
              <div className="truncate text-[0px] sm:text-[22px] font-bold text-[#00a7ee] -mt-1 pt-1">
                Region 7
              </div>
              <div className="truncate text-[0px] sm:text-[22px] font-bold text-[#00a7ee] -mt-1">
                CIT-U Chapter
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-5">
            {/* Guest View - Login Only */}
            {role === "guest" && (
              <>
                <Button
                  className="sm:block border-2 border-[#00a7ee] relative overflow-hidden 
                outline-none focus:outline-none focus:ring-0 active:ring-0 ring-0
                transition-all duration-300 ease-in-out active:scale-95 
                before:absolute before:inset-0 before:bg-gradient-to-r 
                before:from-transparent before:via-white/40 before:to-transparent 
                before:translate-x-[-100%] hover:before:translate-x-[100%] 
                before:transition-transform before:duration-700 
                text-[#00a7ee] hover:bg-[#dbeeff]"
                  onClick={handleLogin}
                >
                  Log In
                </Button>
              </>
            )}

            {/* Logged In View */}
            {isLoggedIn && (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="cursor-pointer outline-none select-none tap-highlight-transparent p-1"
                  onClick={handleProfileClick}
                >
                  <Image
                    src="/user.svg"
                    alt="User Profile"
                    width={36}
                    height={36}
                    className="h-10 w-10 sm:h-11 sm:w-11 transition-transform duration-200 ease-in-out hover:brightness-105 active:scale-95"
                  />
                </div>

                {/* DROPDOWN */}
                {profileDropdownOpen && (
                  <div className="absolute top-[125%] right-0 w-64 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col z-50 animate-in fade-in slide-in-from-top-3 duration-200 origin-top-right overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-[#373d47] font-bold text-sm truncate font-rubik leading-tight">
                        {userName}
                      </p>
                      <p className="text-[#00a7ee] text-xs font-semibold font-raleway uppercase tracking-wider mt-1">
                        {role.replace("-", " ")}
                      </p>
                    </div>
                    <div className="py-2">
                      <DropdownItem
                        onClick={() => router.push("/profile")}
                        text="My Profile"
                        icon={
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        }
                      />
                      <DropdownItem
                        onClick={() => router.push("/notifications")}
                        text="Notifications"
                        icon={
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                          </svg>
                        }
                      />
                      <DropdownItem
                        onClick={() => router.push("/contact")}
                        text="Support"
                        icon={
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        }
                      />
                    </div>
                    <div className="h-px bg-gray-100 mx-3"></div>
                    <div className="py-2">
                      <DropdownItem
                        onClick={handleLogout}
                        text="Sign Out"
                        isDestructive={true}
                        icon={
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MENU TOGGLE WRAPPER */}
            <div
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="cursor-pointer"
            >
              {/* DESKTOP TOGGLE (9 DOTS) */}
              <div
                className={`hidden md:grid grid-cols-3 gap-1 transition-transform duration-500 ease-in-out hover:rotate-90 ${
                  open ? "rotate-[360deg]" : ""
                }`}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-[3px] bg-[#00a7ee]"
                  />
                ))}
              </div>

              {/* MOBILE TOGGLE */}
              <div className="md:hidden flex flex-col items-end justify-center gap-[6px] w-9 h-9">
                {/* Top Line */}
                <div
                  className={`h-[4px] bg-[#00a7ee] rounded-full transition-all duration-300 ${
                    open ? "w-6" : "w-[26px]"
                  }`}
                />

                {/* Middle Line */}
                <div
                  className={`h-[4px] bg-[#00a7ee] rounded-full transition-all duration-300 ${
                    open ? "w-[26px]" : "w-[19px]"
                  }`}
                />

                {/* Bottom Line */}
                <div
                  className={`h-[4px] bg-[#00a7ee] rounded-full transition-all duration-300 ${
                    open ? "w-6" : "w-[26px]"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FULL SCREEN MENU OVERLAY - MOVED OUTSIDE HEADER */}
      <div
        className={`fixed inset-0 z-50 overflow-y-auto transition-transform duration-700 ease-in-out 
          ${
            open
              ? "translate-x-0 md:translate-y-0"
              : "translate-x-full md:translate-x-0 md:-translate-y-full"
          }`}
      >
        <Menu userRole={role} onExit={() => setOpen(false)} />
      </div>
    </>
  );
};

export default Header;
