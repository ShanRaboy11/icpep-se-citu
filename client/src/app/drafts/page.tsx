"use client";

import React, { useEffect, useState } from "react";
import announcementService from "../services/announcement";
import eventService from "../services/event";
import Link from "next/link";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Button from "@/app/components/button";

interface DraftItem {
  _id: string;
  title: string;
  publishDate?: string;
  isPublished?: boolean;
  type?: string;
}

type ViewType = "announcements" | "events";

export default function DraftsPage() {
  const [announcements, setAnnouncements] = useState<DraftItem[]>([]);
  const [events, setEvents] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>("announcements");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [annRes, evtRes] = await Promise.all([
          announcementService.getMyAnnouncements({ page: 1, limit: 50 }),
          eventService.getMyEvents({ page: 1, limit: 50 }),
        ]);
        const annData = Array.isArray(annRes.data) ? annRes.data : [];
        const evtData = Array.isArray(evtRes.data) ? evtRes.data : [];
        setAnnouncements(annData as DraftItem[]);
        setEvents(evtData as DraftItem[]);
      } catch (err) {
        console.error("Failed to load drafts", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const now = new Date();

  const renderList = (items: DraftItem[], type: "announcement" | "event") => {
    if (!items || items.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 font-raleway mb-4">
            No {type}s yet
          </p>
          <Link
            href={
              type === "announcement"
                ? "/announcements/create"
                : "/events/create"
            }
          >
            <Button variant="primary2" size="sm">
              Create {type === "announcement" ? "Announcement" : "Event"}
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <ul className="space-y-3">
        {items.map((it) => {
          const scheduled = it.publishDate
            ? new Date(it.publishDate) > now
            : false;
          const isDraft = !it.isPublished;

          return (
            <li
              key={it._id}
              className="p-4 bg-white border border-primary1/20 rounded-xl hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary3 font-rubik text-lg mb-1">
                    {it.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-raleway">
                    {it.type && (
                      <span className="px-2 py-0.5 bg-primary1/10 text-primary1 rounded-full text-xs font-medium">
                        {it.type}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        scheduled
                          ? "bg-blue-100 text-blue-700"
                          : isDraft
                          ? "bg-gray-100 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {scheduled
                        ? `Scheduled: ${new Date(
                            it.publishDate!
                          ).toLocaleDateString()} ${new Date(
                            it.publishDate!
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : isDraft
                        ? "Draft"
                        : "Published"}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/${
                    type === "announcement" ? "announcements" : "events"
                  }/${it._id}`}
                >
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12">
        <div className="text-center sm:text-left mb-10">
          <h1 className="text-2xl sm:text-5xl font-bold font-rubik text-primary3">
            Drafts & Scheduled
          </h1>
          <div className="h-[3px] bg-primary1 w-24 sm:w-full mt-3 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="border border-primary1 rounded-2xl p-4 bg-white">
              {loading ? (
                <>
                  {/* Skeleton Sidebar */}
                  <div className="h-6 bg-gray-200 rounded-lg w-32 mb-4 animate-pulse"></div>
                  <nav className="space-y-2">
                    <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  </nav>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-primary3 font-rubik mb-4">
                    Filter by Type
                  </h2>
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveView("announcements")}
                      className={`w-full text-left px-4 py-3 rounded-lg font-raleway transition-colors ${
                        activeView === "announcements"
                          ? "bg-primary1 text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Announcements</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            activeView === "announcements"
                              ? "bg-white/20 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {announcements.length}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveView("events")}
                      className={`w-full text-left px-4 py-3 rounded-lg font-raleway transition-colors ${
                        activeView === "events"
                          ? "bg-primary1 text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Events</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            activeView === "events"
                              ? "bg-white/20 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {events.length}
                        </span>
                      </div>
                    </button>
                  </nav>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link
                      href={
                        activeView === "announcements"
                          ? "/announcements/create"
                          : "/events/create"
                      }
                    >
                      <Button variant="primary2" size="sm" className="w-full">
                        + New{" "}
                        {activeView === "announcements" ? "Announcement" : "Event"}
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="border border-primary1 rounded-2xl p-6 bg-white">
                {/* Skeleton Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                  </div>
                  <div className="h-9 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
                </div>

                {/* Skeleton Items */}
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-xl"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2 animate-pulse"></div>
                          <div className="flex items-center gap-2">
                            <div className="h-5 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                            <div className="h-5 bg-gray-200 rounded-full w-32 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="h-9 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-primary1 rounded-2xl p-6 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary1 font-rubik">
                      {activeView === "announcements"
                        ? "Announcements"
                        : "Events"}
                    </h2>
                    <p className="text-sm text-gray-500 font-raleway mt-1">
                      {activeView === "announcements"
                        ? announcements.length
                        : events.length}{" "}
                      {(activeView === "announcements"
                        ? announcements.length
                        : events.length) === 1
                        ? "item"
                        : "items"}
                    </p>
                  </div>
                  <Link
                    href={
                      activeView === "announcements"
                        ? "/announcements/create"
                        : "/events/create"
                    }
                  >
                    <Button variant="outline" size="sm">
                      + Create New
                    </Button>
                  </Link>
                </div>

                {activeView === "announcements"
                  ? renderList(announcements, "announcement")
                  : renderList(events, "event")}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </section>
  );
}