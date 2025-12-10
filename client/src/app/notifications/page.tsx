"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./components/sidebar";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Eye, ChevronDown, Search, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import NotificationCard, {
  NotificationItem,
} from "./components/notification-card";

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const filterType = searchParams.get("type"); // "calendar" | "megaphone" | ...

  // Temporary sample notifications — replace with DB later
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      message: "New Event Scheduled Tomorrow",
      date: "Oct 30, 2025",
      type: "calendar",
      link: "/events",
      read: false,
    },
    {
      id: "2",
      message: "New Announcement Posted",
      date: "Oct 29, 2025",
      type: "megaphone",
      link: "/announcements",
      read: false,
    },
    {
      id: "3",
      message: "Your Membership Approval was Confirmed",
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
  ]);

  // If filter exists → filter; else → show all
  // If filter exists → filter; and also apply "all/unread" tabs
  const filtered = notifications
    // Filter by sidebar type (if set)
    .filter((n) => (filterType ? n.type === filterType : true))

    // Apply "All / Unread" toggle
    .filter((n) => (activeTab === "unread" ? !n.read : true))

    // Search bar matches message text
    .filter((n) => n.message.toLowerCase().includes(searchQuery.toLowerCase()));

  // Mark notification as read
  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      {/* Global Header */}
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12">
        {/* Page Title */}
        <div className="text-center sm:text-left mb-10">
          <h1 className="text-2xl sm:text-5xl font-bold font-rubik text-primary2">
            Notifications
          </h1>
          <div className="h-[2px] bg-primary1 w-24 sm:w-full mt-3 mx-auto rounded-full" />
        </div>

        {/* Sidebar + Main Form */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full md:flex-nowrap">
              {/* Tabs */}
              <div className="flex items-center bg-sky-100 rounded-xl p-[4px] shrink-0 w-full sm:w-fit">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 px-6 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    activeTab === "all"
                      ? "bg-sky-500 text-white shadow-sm"
                      : "text-sky-600 hover:text-sky-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`flex-1 px-6 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    activeTab === "unread"
                      ? "bg-sky-500 text-white shadow-sm"
                      : "text-sky-600 hover:text-sky-700"
                  }`}
                >
                  Unread
                </button>
              </div>

              {/* Search */}
              <div className="flex-1 mx-0 md:mx-4 w-full flex items-center border border-sky-300 rounded-lg px-3 py-2 text-gray-700 focus-within:ring-2 focus-within:ring-sky-400 bg-white min-w-[240px]">
                <Search size={18} className="text-sky-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search notifications"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-sm text-gray-700 placeholder-sky-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="secondary"
                  className="flex items-center gap-2 whitespace-nowrap"
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, read: true }))
                    )
                  }
                >
                  Mark All as Read
                </Button>

                <Button
                  variant="primary2"
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus size={18} />
                  New Notice
                </Button>
              </div>
            </div>

            <div className="h-[1px] bg-gray-400 w-full mt-8 mb-5 mx-auto rounded-full" />
            {filtered.length > 0 ? (
              filtered.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  item={notification}
                  onMarkRead={handleMarkRead}
                />
              ))
            ) : (
              <div className="text-center font-raleway text-sky-500 py-10 text-lg">
                No notifications found.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </section>
  );
}
