"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Button from "./button";
import Menu from "./menu";
import { useRouter } from "next/navigation";
import { notificationService } from "@/app/services/notification";
import {
  CheckCheck,
  Megaphone,
  Calendar,
  User,
  Bell,
  Check,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { LoadingIndicator } from "@/app/components/loading";

type UserRole =
  | "guest"
  | "student"
  | "council-officer"
  | "committee-officer"
  | "faculty"
  | "admin";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifPage, setNotifPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isNotifLoading, setIsNotifLoading] = useState(false);
  const [swipedNotifId, setSwipedNotifId] = useState<string | null>(null);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // handle body scroll locking
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // escape key to close menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSwipedNotifId(null);
        if (open) setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // handle header scroll state
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // check auth status on mount
  useEffect(() => {
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
    checkAuthStatus();
  }, []);

  // handle logout logic
  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setRole("guest");
    setUserName("");
    setProfileDropdownOpen(false);
    setNotifDropdownOpen(false);
    router.push("/");
  }, [router]);

  // fetch unread notifications count
  useEffect(() => {
    if (isLoggedIn) {
      const fetchUnreadCount = async () => {
        try {
          const response = await notificationService.getAll(1, 1);
          if (response?.success) {
            setUnreadCount(response.unreadCount);
          }
        } catch (error: any) {
          if (error.message === "expired_session") {
            handleLogout();
          }
        }
      };

      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, handleLogout]);

  // close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const insideOpenNotif = (event.target as Element).closest?.(
        "[data-notif-open]",
      );
      if (!insideOpenNotif) setSwipedNotifId(null);
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // fetch notification list from db
  const fetchNotificationsFromDB = async (page: number, append = false) => {
    if (isNotifLoading) return;
    setIsNotifLoading(true);
    try {
      const response = await notificationService.getAll(page, 5);
      if (response?.success) {
        const mapped = response.data.map((n: any) => {
          let link = n.link || "/home";
          if (!n.link) {
            if (n.type === "announcement" && n.relatedId)
              link = `/announcements/${n.relatedId}`;
            else if (n.type === "announcement") link = "/announcements";
            else if (n.type === "event" && n.relatedId)
              link = `/events/${n.relatedId}`;
            else if (n.type === "event") link = "/events";
            else if (n.type === "membership") link = "/profile";
            else if (n.type === "rsvp") link = "/commeet";
            else if (n.type === "system" || n.title.includes("Password"))
              link = "/profile";
          }

          return {
            id: n._id,
            title: n.title,
            date: new Date(n.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            type: n.type,
            read: n.isRead,
            link: link,
          };
        });

        setNotifications((prev) => (append ? [...prev, ...mapped] : mapped));
        setHasMore(mapped.length === 5);
        setUnreadCount(response.unreadCount);
      }
    } catch (error: any) {
      if (error.message === "expired_session") {
        handleLogout();
      }
    } finally {
      setIsNotifLoading(false);
    }
  };

  const handleNotifScroll = () => {
    if (!scrollContainerRef.current || isNotifLoading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      const nextPage = notifPage + 1;
      setNotifPage(nextPage);
      fetchNotificationsFromDB(nextPage, true);
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
    }
  };

  const handleMarkRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
    }
  };

  const handleDeleteNotif = async (e: React.MouseEvent, n: any) => {
    e.stopPropagation();
    try {
      await notificationService.delete(n.id);
      setNotifications((prev) => prev.filter((item) => item.id !== n.id));
      if (!n.read) setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
    }
  };

  const handleNotifClick = async (n: any) => {
    if (!n.read) {
      try {
        await notificationService.markAsRead(n.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
      }
    }
    router.push(n.link);
    setNotifDropdownOpen(false);
  };

  const toggleNotifDropdown = () => {
    setSwipedNotifId(null);
    if (!notifDropdownOpen) {
      setNotifPage(1);
      setHasMore(true);
      fetchNotificationsFromDB(1);
    }
    setNotifDropdownOpen(!notifDropdownOpen);
    setProfileDropdownOpen(false);
  };

  const handleLogin = () => router.push("/login");

  const DropdownItem = ({
    icon,
    text,
    onClick,
    isDestructive = false,
    badge,
  }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-all duration-200 group cursor-pointer
        ${isDestructive ? "hover:bg-red-50" : "hover:bg-[#f0f9ff]"}`}
    >
      <div
        className={`transition-colors duration-200 ${isDestructive ? "text-[#64748b] group-hover:text-red-500" : "text-[#64748b] group-hover:text-[#00a7ee]"}`}
      >
        {icon}
      </div>
      <div className="flex-1 flex items-center justify-between font-rubik">
        <span
          className={`text-sm font-medium tracking-wide transition-colors duration-200 ${isDestructive ? "text-[#373d47] group-hover:text-red-500" : "text-[#373d47] group-hover:text-[#00a7ee]"}`}
        >
          {text}
        </span>
        {badge !== undefined && badge > 0 && (
          <span className="flex items-center justify-center min-w-5 h-5 px-1.5 bg-[#ef4444]/90 text-white text-[10px] font-bold rounded-full shadow-sm">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
    </button>
  );

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 right-0 z-40 border-b border-foreground cursor-default transition-all duration-500
        ${scrolled ? "bg-white/85 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.05)]" : "bg-[#fefeff]"}`}
      >
        <div className="flex items-center justify-between py-3 px-4 md:max-w-[88%] md:mx-auto md:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link
              href="/home"
              className="flex items-center gap-3 sm:gap-4 min-w-0 group"
              aria-label="Go to Home"
            >
              <Image
                src="/brand/icpep-logo.png"
                alt="ICPEP Logo"
                width={55}
                height={55}
                className="md:h-15 md:w-auto sm:h-25 sm:w-auto rounded-full cursor-pointer transition-all duration-300 ease-in-out group-hover:drop-shadow-[0_0_8px_rgba(0,167,238,0.7)]"
              />
              <div className="flex items-end gap-0.5">
                <Image
                  src="/icons/decorative/Vector-i.svg"
                  alt="I"
                  width={0}
                  height={50}
                  className="h-0 w-auto sm:h-12"
                />
                <Image
                  src="/icons/decorative/Vector-c.svg"
                  alt="C"
                  width={0}
                  height={50}
                  className="h-0 w-auto sm:h-12"
                />
                <Image
                  src="/icons/decorative/Vector-p1.svg"
                  alt="P"
                  width={0}
                  height={50}
                  className="h-0 w-auto sm:h-12"
                />
                <Image
                  src="/icons/decorative/Vector-e1.svg"
                  alt="E"
                  width={0}
                  height={50}
                  className="h-0 w-auto sm:h-12"
                />
                <Image
                  src="/icons/decorative/Vector-p2.svg"
                  alt="P"
                  width={0}
                  height={50}
                  className="h-0 w-auto sm:h-12"
                />
                <Image
                  src="/icons/decorative/Vector-dot.svg"
                  alt="."
                  width={0}
                  height={16}
                  className="h-0 w-auto sm:h-3.5 -ml-2"
                />
                <Image
                  src="/icons/decorative/Vector-s.svg"
                  alt="S"
                  width={0}
                  height={50}
                  className="h-0 w-auto sm:h-12"
                />
                <Image
                  src="/icons/decorative/Vector-e2.svg"
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
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-5">
            {role === "guest" && (
              <Button
                className="sm:block bg-transparent border border-primary1 text-primary1
                           hover:bg-primary1 hover:text-white font-raleway font-semibold
                           text-sm sm:text-base py-2 px-4 rounded-lg relative overflow-hidden
                           before:absolute before:inset-0 before:bg-linear-to-r
                           before:from-transparent before:via-white/40 before:to-transparent
                           before:-translate-x-full hover:before:translate-x-full
                           before:transition-transform before:duration-700"
                onClick={handleLogin}
              >
                Log In
              </Button>
            )}

            {isLoggedIn && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* notification btn */}
                <div className="sm:relative" ref={notifDropdownRef}>
                  <style>{`
                    @keyframes bell-ring {
                      0% { transform: rotate(0deg); }
                      10% { transform: rotate(18deg); }
                      30% { transform: rotate(-16deg); }
                      50% { transform: rotate(12deg); }
                      70% { transform: rotate(-8deg); }
                      85% { transform: rotate(4deg); }
                      100% { transform: rotate(0deg); }
                    }
                    .bell-ring:hover svg { animation: bell-ring 0.6s ease-in-out; transform-origin: top center; }
                    .themed-scrollbar::-webkit-scrollbar { width: 6px; }
                    .themed-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .themed-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
                    .themed-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
                  `}</style>
                  <div
                    onClick={toggleNotifDropdown}
                    className="relative flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 bell-ring cursor-pointer group select-none"
                  >
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-[#00a7ee] transition-colors duration-300 ease-in-out group-hover:text-[#0096d6] group-hover:drop-shadow-[0_0_10px_rgba(0,167,238,0.75)]"
                    >
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-0.5 right-px flex items-center justify-center min-w-4.5 h-4.5 px-0.75 bg-[#ef4444] text-white text-[10px] font-normal font-rubik rounded-full shadow-sm border border-white leading-none">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>

                  {notifDropdownOpen && (
                    <div className="absolute top-full mt-2 left-3 right-3 sm:top-[125%] sm:mt-0 sm:left-auto sm:right-0 sm:w-100 bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 z-50 animate-in fade-in slide-in-from-top-3 duration-200 origin-top-right overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h3 className="text-[#373d47] font-bold text-sm font-rubik tracking-tight">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] font-bold text-[#00a7ee] font-rubik flex items-center gap-1.5 hover:text-[#0096d6] cursor-pointer transition-colors"
                          >
                            <CheckCheck size={16} /> Mark all as read
                          </button>
                        )}
                      </div>

                      <div
                        ref={scrollContainerRef}
                        onScroll={handleNotifScroll}
                        className="max-h-95 themed-scrollbar overflow-y-auto overflow-x-hidden bg-white"
                      >
                        {notifications.length > 0 ? (
                          <div className="flex flex-col">
                            {notifications.map((n) => {
                              const isSwiped = swipedNotifId === n.id;
                              const actionsWidth = n.read ? 72 : 144;

                              return (
                                <div
                                  key={n.id}
                                  data-notif-open={isSwiped ? "" : undefined}
                                  className="relative overflow-hidden border-b border-gray-50"
                                >
                                  <div
                                    className="absolute inset-y-0 right-0 flex"
                                    style={{ width: actionsWidth }}
                                  >
                                    {!n.read && (
                                      <button
                                        tabIndex={isSwiped ? 0 : -1}
                                        onClick={(e) => {
                                          handleMarkRead(e, n.id);
                                          setSwipedNotifId(null);
                                        }}
                                        className="flex-1 flex flex-col items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-rubik font-semibold transition-colors cursor-pointer"
                                      >
                                        <Check size={16} strokeWidth={3} />
                                        Read
                                      </button>
                                    )}
                                    <button
                                      tabIndex={isSwiped ? 0 : -1}
                                      onClick={(e) => {
                                        handleDeleteNotif(e, n);
                                        setSwipedNotifId(null);
                                      }}
                                      className="flex-1 flex flex-col items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[11px] font-rubik font-semibold transition-colors cursor-pointer"
                                    >
                                      <Trash2 size={16} />
                                      Delete
                                    </button>
                                  </div>

                                  <div
                                    onClick={() =>
                                      isSwiped
                                        ? setSwipedNotifId(null)
                                        : handleNotifClick(n)
                                    }
                                    style={{
                                      transform: isSwiped
                                        ? `translateX(-${actionsWidth}px)`
                                        : "translateX(0)",
                                    }}
                                    className={`relative flex gap-4 px-6 py-4 cursor-pointer transition-[transform,background-color] duration-300 ease-out ${!n.read ? "bg-[#fafcff]" : "bg-white hover:bg-gray-50"}`}
                                  >
                                    <div className="shrink-0 flex items-center">
                                      {n.type === "announcement" ? (
                                        <Megaphone className="w-6 h-6 text-orange-500" />
                                      ) : n.type === "event" ? (
                                        <Calendar className="w-6 h-6 text-blue-500" />
                                      ) : n.type === "membership" ? (
                                        <User className="w-6 h-6 text-green-500" />
                                      ) : (
                                        <Bell className="w-6 h-6 text-primary1" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                      <p
                                        className={`text-xs leading-tight font-rubik ${!n.read ? "text-[#373d47] font-bold" : "text-gray-500 font-medium"}`}
                                      >
                                        {n.title}
                                      </p>
                                      <p className="text-[12px] text-gray-400 font-raleway mt-0.5 font-medium tracking-tight">
                                        {n.date}
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-2">
                                      {!n.read && (
                                        <div className="w-2 h-2 bg-primary1 rounded-full shrink-0"></div>
                                      )}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSwipedNotifId(isSwiped ? null : n.id);
                                        }}
                                        title="More actions"
                                        aria-expanded={isSwiped}
                                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                          isSwiped
                                            ? "bg-gray-100 text-gray-600"
                                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                        }`}
                                      >
                                        <MoreVertical size={16} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {isNotifLoading && (
                              <div className="py-6 flex justify-center">
                                <LoadingIndicator size="sm" />
                              </div>
                            )}
                          </div>
                        ) : !isNotifLoading ? (
                          <div className="py-16 px-6 text-center">
                            <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-sm text-gray-300 font-rubik font-medium">
                              Your inbox is empty
                            </p>
                          </div>
                        ) : (
                          <div className="py-24 flex justify-center">
                            <LoadingIndicator />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* profile btn */}
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="cursor-pointer outline-none select-none tap-highlight-transparent p-1"
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                  >
                    <Image
                      src="/icons/ui/user.svg"
                      alt="User"
                      width={36}
                      height={36}
                      className="h-10 w-10 sm:h-11 sm:w-11 transition-transform duration-200 ease-in-out hover:brightness-105 active:scale-95"
                    />
                  </div>
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
                          icon={<User size={20} />}
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
              </div>
            )}

            {/* menu */}
            <div
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="cursor-pointer"
            >
              <div
                className={`hidden md:grid grid-cols-3 gap-1 transition-transform duration-500 ease-in-out hover:rotate-90 ${open ? "rotate-360" : ""}`}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-[3px] bg-[#00a7ee]"
                  />
                ))}
              </div>
              <div className="md:hidden flex flex-col items-end justify-center gap-1.5 w-9 h-9">
                <div
                  className={`h-1 bg-[#00a7ee] rounded-full transition-all duration-300 ${open ? "w-6" : "w-6.5"}`}
                />
                <div
                  className={`h-1 bg-[#00a7ee] rounded-full transition-all duration-300 ${open ? "w-6.5" : "w-4.75"}`}
                />
                <div
                  className={`h-1 bg-[#00a7ee] rounded-full transition-all duration-300 ${open ? "w-6" : "w-6.5"}`}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 overflow-y-auto themed-scrollbar-dark transition-transform duration-700 ease-in-out ${open ? "translate-x-0 md:translate-y-0" : "translate-x-full md:translate-x-0 md:-translate-y-full"}`}
      >
        <Menu userRole={role} onExit={() => setOpen(false)} />
      </div>
    </>
  );
};

export default Header;
