"use client";

import React, { useState, useEffect } from "react";
import Sidebar, { FilterType, FILTER_OPTIONS } from "./components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import {
  Search,
  CheckCheck,
  SlidersHorizontal,
  X,
  Loader2,
} from "lucide-react";
import NotificationCard, {
  NotificationItem,
} from "./components/notification-card";
import { notificationService, Notification } from "@/app/services/notification";

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Map frontend filter to backend filter
      // Frontend: 'all' | 'event' | 'announcement' | 'others'
      // Backend expects same or we handle mapping in service/controller
      const response = await notificationService.getAll(1, 50, activeTab);

      if (response.success) {
        const mappedNotifications: NotificationItem[] = response.data.map(
          (n: Notification) => {
            // Map backend types to frontend types
            let type: NotificationItem["type"] = "notification";
            if (n.type === "announcement") type = "megaphone";
            else if (n.type === "event") type = "calendar";
            else if (n.type === "membership") type = "member";
            else if (n.type === "rsvp") type = "action";
            else if (n.type === "system") type = "notification";

            // Generate link based on type and relatedId
            let link = "/notifications";
            if (n.type === "announcement") link = "/announcements";
            else if (n.type === "event" && n.relatedId)
              link = `/events/${n.relatedId}`;
            else if (n.type === "membership") link = "/profile";
            else if (n.type === "rsvp") link = "/commeet";
            else if (n.type === "system" && n.title.includes("Password"))
              link = "/profile";

            return {
              id: n._id,
              message: n.title, // Using title as the main message
              date: new Date(n.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              type,
              link,
              read: n.isRead,
            };
          }
        );
        setNotifications(mappedNotifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  // Filtering Logic (Client-side search on top of server-side type filtering)
  const filtered = notifications.filter((n) => {
    if (!n.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <section className="min-h-screen bg-white flex flex-col relative overflow-hidden font-rubik">
      {/* Background Grid */}
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-16">
          {/* Page Header */}
          <div className="mb-16 text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                Inbox
              </span>
            </div>

            {/* Title */}
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              Notifications
            </h1>

            {/* Description */}
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Keep track of your latest updates, official announcements, and
              important reminders all in one place.
            </p>
          </div>

          {/* Layout Container */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* DESKTOP Sidebar (Hidden on Mobile) */}
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="hidden lg:block"
            />

            {/* Content Area */}
            <div className="flex-1 w-full">
              {/* --- SEARCH & ACTIONS BAR --- */}
              <div className="flex flex-row gap-2 sm:gap-4 mb-4 sticky top-24 z-20 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary1/30 p-2 sm:p-4">
                {/* Search Input */}
                <div className="relative flex-1 group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary1 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search notifications"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-rubik text-gray-700 placeholder-gray-400 focus:bg-white focus:border-primary1/50 focus:ring-4 focus:ring-primary1/10 outline-none transition-all duration-300"
                  />
                </div>

                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className={`
                    lg:hidden flex items-center justify-center w-12 rounded-xl border transition-all duration-300 shadow-none cursor-pointer
                    ${
                      isMobileFilterOpen
                        ? "bg-primary1 text-white border-primary1" // Active: Flat Blue, No Shadow
                        : "bg-white border-gray-200 text-gray-500 hover:text-primary1 hover:border-primary1/50 hover:bg-primary1/5" // Inactive: Standard
                    }
                  `}
                >
                  {isMobileFilterOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <SlidersHorizontal className="w-5 h-5" />
                  )}
                </button>

                {/* Mark All Read Button */}
                <Button
                  variant="secondary"
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 h-auto text-sm font-rubik font-medium whitespace-nowrap bg-white border border-gray-200 text-gray-500 hover:text-primary1 hover:border-primary1/50 hover:bg-primary1/5 transition-all duration-300 rounded-xl shadow-none"
                  onClick={handleMarkAllRead}
                >
                  <CheckCheck className="w-5 h-5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Mark All Read</span>
                </Button>
              </div>

              {/* --- MOBILE FILTER SECTION (Below Search) --- */}
              <div
                className={`
                  lg:hidden overflow-hidden transition-all duration-300 ease-in-out
                  ${
                    isMobileFilterOpen
                      ? "max-h-96 opacity-100 mb-6"
                      : "max-h-0 opacity-0 mb-0"
                  }
                `}
              >
                <div className="grid grid-cols-2 gap-2 bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setActiveTab(opt.value as FilterType);
                      }}
                      className={`
                        flex items-center gap-2 justify-center py-2.5 px-3 rounded-xl text-sm font-rubik font-medium transition-all duration-200
                        ${
                          activeTab === opt.value
                            ? "bg-primary1 text-white shadow-md shadow-primary1/20"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-primary1/30 hover:text-primary1"
                        }
                      `}
                    >
                      {/* FIX APPLIED HERE: Added <any> cast */}
                      {React.cloneElement(opt.icon as React.ReactElement<any>, {
                        size: 16,
                      })}
                      <span>{opt.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* --- NOTIFICATION LIST --- */}
              <div className="flex flex-col gap-3 min-h-[400px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary1 animate-spin mb-4" />
                    <p className="text-gray-500 font-rubik">
                      Loading notifications...
                    </p>
                  </div>
                ) : filtered.length > 0 ? (
                  filtered.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      item={notification}
                      onMarkRead={handleMarkRead}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 px-4 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="p-4 bg-white rounded-full mb-4 shadow-sm border border-gray-100">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="font-rubik text-gray-700 text-lg font-semibold">
                      No notifications found
                    </p>
                    <p className="font-raleway text-sm text-gray-500 mt-2 max-w-xs text-center">
                      We couldn't find any updates matching your current
                      filters.
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-4 text-sm text-primary1 hover:text-primary3 font-semibold font-rubik transition-colors"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </section>
  );
}
