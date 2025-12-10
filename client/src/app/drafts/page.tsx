"use client";

import React, { useEffect, useState } from "react";
import announcementService from "../services/announcement";
import eventService from "../services/event";
import merchService, { MerchItem } from "../services/merch";
import testimonialService from "../services/testimonial";
import sponsorService from "../services/sponsor";
import Link from "next/link";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Button from "@/app/components/button";
import Sidebar from "@/app/components/sidebar";
import { Megaphone, CalendarDays, ShoppingBag, Pencil, Trash2, Quote, Handshake } from "lucide-react";

interface DraftItem {
  _id: string;
  title: string;
  publishDate?: string;
  isPublished?: boolean;
  type?: string;
  category?: "announcement" | "event" | "merch" | "testimonial" | "sponsor";
}

interface TestimonialItem {
  _id: string;
  name: string;
  role: string;
  quote: string;
  image?: string;
  isActive: boolean;
}

interface SponsorItem {
  _id: string;
  name: string;
  type: string;
  image?: string;
  isActive: boolean;
}

type TabType = "announcements" | "events" | "merch" | "testimonials" | "sponsors";

export default function DraftsPage() {
  const [announcements, setAnnouncements] = useState<DraftItem[]>([]);
  const [events, setEvents] = useState<DraftItem[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("announcements");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [annRes, evtRes, merchRes, testRes, sponsorRes] = await Promise.all([
          announcementService.getMyAnnouncements({ page: 1, limit: 50 }),
          eventService.getMyEvents({ page: 1, limit: 50 }),
          merchService.getAll(),
          testimonialService.getAllTestimonials(),
          sponsorService.getAllSponsors(),
        ]);

        const annData = Array.isArray(annRes.data) ? annRes.data : [];
        const evtData = Array.isArray(evtRes.data) ? evtRes.data : [];
        const testData = Array.isArray(testRes.data) ? testRes.data : (Array.isArray(testRes) ? testRes : []);
        const sponsorData = Array.isArray(sponsorRes.data) ? sponsorRes.data : (Array.isArray(sponsorRes) ? sponsorRes : []);
        
        setAnnouncements(annData as DraftItem[]);
        setEvents(evtData as DraftItem[]);
        setMerch(merchRes);
        setTestimonials(testData as TestimonialItem[]);
        setSponsors(sponsorData as SponsorItem[]);
      } catch (err) {
        console.error("Failed to load drafts", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const now = new Date();

  const renderAnnouncementsEvents = (items: DraftItem[], type: "announcement" | "event") => {
    const filtered = (items || []).filter((it) => !it.isPublished);

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-raleway mb-4">
            No drafts found for {type}s
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
      <div className="space-y-3">
        {filtered.map((it) => {
          const scheduled = it.publishDate
            ? new Date(it.publishDate) > now
            : false;

          return (
            <div
              key={it._id}
              className="p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-primary3 font-rubik text-lg mb-2">
                    {it.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-raleway">
                    {it.type && (
                      <span className="px-2.5 py-1 bg-primary1/10 text-primary1 rounded-lg text-xs font-bold">
                        {it.type}
                      </span>
                    )}
                    {scheduled ? (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700">
                        Scheduled: {new Date(it.publishDate!).toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/${
                      type === "announcement" ? "announcements" : "events"
                    }/create?edit=${it._id}`}
                  >
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                      <Pencil size={18} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMerch = () => {
    const filtered = merch.filter((m) => !m.isActive);

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-raleway mb-4">
            No merchandise drafts found
          </p>
          <Link href="/create/merch">
            <Button variant="primary2" size="sm">
              Create Merch
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                {item.image && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-primary3 font-rubik text-lg mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-raleway line-clamp-1">
                    {item.description}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2.5 py-1 bg-primary2/10 text-primary2 rounded-lg text-xs font-bold">
                      {item.prices.length} Price Options
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/create/merch?edit=${item._id}`}>
                  {/* Note: You might need to update the merch create page to handle ?edit= query param or use a different way to pass the ID */}
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <Pencil size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTestimonials = () => {
    const filtered = testimonials.filter((t) => !t.isActive);

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-raleway mb-4">
            No testimonial drafts found
          </p>
          <Link href="/create/testimonials">
            <Button variant="primary2" size="sm">
              Create Testimonial
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                {item.image ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary1/10 flex items-center justify-center text-primary1 font-bold text-xl flex-shrink-0">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-primary3 font-rubik text-lg mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-primary1 font-bold font-raleway mb-1">
                    {item.role}
                  </p>
                  <p className="text-sm text-gray-500 font-raleway line-clamp-1 italic">
                    "{item.quote}"
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/create/testimonials?edit=${item._id}`}>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <Pencil size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSponsors = () => {
    const filtered = sponsors.filter((s) => !s.isActive);

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-raleway mb-4">
            No sponsor drafts found
          </p>
          <Link href="/create/sponsors">
            <Button variant="primary2" size="sm">
              Create Sponsor
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                {item.image ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-primary1/10 flex items-center justify-center text-primary1 font-bold text-xl flex-shrink-0">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-primary3 font-rubik text-lg mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-primary1 font-bold font-raleway mb-1">
                    {item.type}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/create/sponsors?edit=${item._id}`}>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <Pencil size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
          {/* Page Header with Gradient */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary1/10 to-primary2/10 rounded-3xl blur-3xl -z-10" />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-6xl font-bold font-rubik bg-gradient-to-r from-primary3 via-primary1 to-primary2 bg-clip-text text-transparent mb-3">
                Drafts & Scheduled
              </h1>
              <p className="text-gray-600 font-raleway text-lg">
                Manage your unpublished content and scheduled posts
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit">
                <button
                  onClick={() => setActiveTab("announcements")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "announcements"
                      ? "bg-primary3 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Megaphone size={16} />
                  Announcements
                  <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${
                    activeTab === "announcements" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {announcements.filter(a => !a.isPublished).length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("events")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "events"
                      ? "bg-primary3 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <CalendarDays size={16} />
                  Events
                  <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${
                    activeTab === "events" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {events.filter(e => !e.isPublished).length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("testimonials")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "testimonials"
                      ? "bg-primary3 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Quote size={16} />
                  Testimonials
                  <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${
                    activeTab === "testimonials" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {testimonials.filter(t => !t.isActive).length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("sponsors")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "sponsors"
                      ? "bg-primary3 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Handshake size={16} />
                  Sponsors
                  <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${
                    activeTab === "sponsors" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {sponsors.filter(s => !s.isActive).length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("merch")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === "merch"
                      ? "bg-primary3 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <ShoppingBag size={16} />
                  Merch
                  <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${
                    activeTab === "merch" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {merch.filter(m => !m.isActive).length}
                  </span>
                </button>
              </div>

              {/* Content Area */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 min-h-[400px]">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    {activeTab === "announcements" && renderAnnouncementsEvents(announcements, "announcement")}
                    {activeTab === "events" && renderAnnouncementsEvents(events, "event")}
                    {activeTab === "testimonials" && renderTestimonials()}
                    {activeTab === "sponsors" && renderSponsors()}
                    {activeTab === "merch" && renderMerch()}
                  </>
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