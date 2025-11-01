"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./components/sidebarnotif";
import Button from "@/app/components/button";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Eye, ChevronDown, Search, Plus } from "lucide-react";
import NotificationCard from "./components/notificationcard";

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
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
          <div className="h-[2px] sm:bg-gray-300 bg-primary1 w-24 sm:w-full mt-3 mx-auto rounded-full" />
        </div>

        {/* Sidebar + Main Form */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 w-full flex-wrap">
              {/* Tabs */}
              <div className="flex items-center bg-sky-100 rounded-xl p-[4px] w-full sm:w-fit">
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
              <div className="flex-1 sm:mx-4 flex items-center border border-sky-300 rounded-lg px-3 py-2 text-gray-700 focus-within:ring-2 focus-within:ring-sky-400 bg-white min-w-[200px] sm:min-w-[300px] md:min-w-[400px]">
                <Search size={18} className="text-sky-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search notifications"
                  className="w-full bg-transparent focus:outline-none text-sm text-gray-700 placeholder-sky-400"
                />
              </div>

              {/* New Notice Button */}
              <Button
                variant="primary2"
                className="flex items-center gap-2 whitespace-nowrap justify-center w-full sm:w-auto"
              >
                <Plus size={18} />
                New Notice
              </Button>
            </div>

            <div className="h-[1px] bg-gray-400 w-full mt-8 mb-5 mx-auto rounded-full" />
            <NotificationCard
              item={{
                id: "1",
                message: "Your Quarterly Meeting starts soon.",
                date: "Jan 30, 2025",
                type: "calendar",
                link: "/events/quarterly-meeting",
                read: false,
              }}
              onMarkRead={(id) => console.log("Marked read:", id)}
            />
            <NotificationCard
              item={{
                id: "1",
                message: "Your Quarterly Meeting starts soon.",
                date: "Jan 30, 2025",
                type: "megaphone",
                link: "/events/quarterly-meeting",
                read: false,
              }}
              onMarkRead={(id) => console.log("Marked read:", id)}
            />
            <NotificationCard
              item={{
                id: "1",
                message: "Your Quarterly Meeting starts soon.",
                date: "Jan 30, 2025",
                type: "member",
                link: "/events/quarterly-meeting",
                read: false,
              }}
              onMarkRead={(id) => console.log("Marked read:", id)}
            />
            <NotificationCard
              item={{
                id: "1",
                message: "Your Quarterly Meeting starts soon.",
                date: "Jan 30, 2025",
                type: "notification",
                link: "/events/quarterly-meeting",
                read: false,
              }}
              onMarkRead={(id) => console.log("Marked read:", id)}
            />
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </section>
  );
}
