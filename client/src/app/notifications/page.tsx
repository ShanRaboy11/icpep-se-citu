"use client";

import React, { useState } from "react";
import Sidebar, { FilterType } from "./components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Grid from "@/app/components/grid";
import { Search, CheckCheck } from "lucide-react";
import NotificationCard, {
  NotificationItem,
} from "./components/notification-card";

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "0", // High Priority
      message: "Action Required: Submit Availability for Executive Meeting",
      date: "Nov 01, 2025",
      type: "action", // This triggers the AlertCircle icon
      link: "/commeet",
      read: false,
    },
    {
      id: "1",
      message: "Annual General Assembly Scheduled",
      date: "Oct 30, 2025",
      type: "calendar",
      link: "/events",
      read: false,
    },
    {
      id: "2",
      message: "System Maintenance Notice: Downtime expected",
      date: "Oct 29, 2025",
      type: "megaphone",
      link: "/announcements",
      read: false,
    },
    {
      id: "3",
      message: "Your Membership Application has been Approved",
      date: "Oct 28, 2025",
      type: "member",
      link: "/profile",
      read: true,
    },
    {
      id: "4",
      message: "Reminder: Submit your Monthly Report",
      date: "Oct 27, 2025",
      type: "notification",
      link: "/reminders",
      read: false,
    },
    {
      id: "5",
      message: "New Policy Update: Terms of Service",
      date: "Oct 26, 2025",
      type: "megaphone",
      link: "/announcements",
      read: true,
    },
  ]);

  // Filtering Logic
  const filtered = notifications.filter((n) => {
    // 1. Search Filter
    if (!n.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 2. Tab Category Filter
    if (activeTab === "all") return true;

    if (activeTab === "event" && n.type === "calendar") return true;
    if (activeTab === "announcement" && n.type === "megaphone") return true;

    // "Others" now includes Member, Notification, AND Action Required
    if (
      activeTab === "others" &&
      (n.type === "member" || n.type === "notification" || n.type === "action")
    ) {
      return true;
    }

    return false;
  });

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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

          {/* Sidebar + Main Content Layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Filter */}
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content Area */}
            <div className="flex-1 w-full">
              {/* Search & Actions Bar - STYLED LIKE MEETING CARD */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 sticky top-24 z-20 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary1/30 p-4">
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
                <Button
                  variant="secondary"
                  className="flex items-center justify-center gap-2 px-6 py-3 h-auto text-sm font-rubik font-medium whitespace-nowrap bg-white border border-gray-200 text-gray-500 hover:text-primary1 hover:border-primary1/50 hover:bg-primary1/5 transition-all duration-300 rounded-xl shadow-none"
                  onClick={handleMarkAllRead}
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All Read
                </Button>
              </div>

              {/* Notification List */}
              <div className="flex flex-col gap-3 min-h-[400px]">
                {filtered.length > 0 ? (
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
