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
import { Megaphone, CalendarDays, ShoppingBag, Pencil, Trash2, Quote, Handshake, AlertTriangle, Clock, Eye } from "lucide-react";

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

  // Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: TabType } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", description: "" });

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

  const confirmDelete = (id: string, type: TabType) => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "announcements") {
        await announcementService.deleteAnnouncement(itemToDelete.id);
        setAnnouncements((prev) => prev.filter((i) => i._id !== itemToDelete.id));
      } else if (itemToDelete.type === "events") {
        await eventService.deleteEvent(itemToDelete.id);
        setEvents((prev) => prev.filter((i) => i._id !== itemToDelete.id));
      } else if (itemToDelete.type === "merch") {
        await merchService.delete(itemToDelete.id);
        setMerch((prev) => prev.filter((i) => i._id !== itemToDelete.id));
      } else if (itemToDelete.type === "testimonials") {
        await testimonialService.deleteTestimonial(itemToDelete.id);
        setTestimonials((prev) => prev.filter((i) => i._id !== itemToDelete.id));
      } else if (itemToDelete.type === "sponsors") {
        await sponsorService.deleteSponsor(itemToDelete.id);
        setSponsors((prev) => prev.filter((i) => i._id !== itemToDelete.id));
      }

      setShowDeleteModal(false);
      setItemToDelete(null);
      setSuccessMessage({
        title: "Deleted Successfully",
        description: "The draft has been permanently removed.",
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete draft:", error);
      alert("Failed to delete draft.");
    }
  };

  const now = new Date();

  const renderAnnouncementsEvents = (items: DraftItem[], type: "announcement" | "event") => {
    const filtered = (items || []).filter((it) => !it.isPublished);

    if (filtered.length === 0) {
      return (
        <div className="text-center py-16 px-6">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              {type === "announcement" ? (
                <Megaphone className="w-10 h-10 text-gray-400" />
              ) : (
                <CalendarDays className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-700 font-rubik mb-2">
              No {type} drafts yet
            </h3>
            <p className="text-gray-500 font-raleway mb-6 text-sm">
              Create your first {type} draft to get started
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
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {filtered.map((it) => {
          const scheduled = it.publishDate
            ? new Date(it.publishDate) > now
            : false;

          return (
            <div
              key={it._id}
              className="group relative bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-100 rounded-2xl p-6 hover:border-primary3/40 hover:shadow-xl hover:shadow-primary3/10 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary3 to-primary1 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="mt-1 p-2 bg-primary1/10 rounded-xl group-hover:bg-primary3/20 transition-colors">
                      {type === "announcement" ? (
                        <Megaphone className="w-5 h-5 text-primary1" />
                      ) : (
                        <CalendarDays className="w-5 h-5 text-primary1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-primary3 font-rubik text-xl mb-2 line-clamp-2 group-hover:text-primary3 transition-colors">
                        {it.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        {it.type && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary1/10 to-primary2/10 text-primary1 rounded-xl text-xs font-bold border border-primary1/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary1" />
                            {it.type}
                          </span>
                        )}
                        {scheduled && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-200">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(it.publishDate!).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${
                      type === "announcement" ? "announcements" : "events"
                    }/create?edit=${it._id}`}
                  >
                    <button className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110">
                      <Pencil size={18} />
                    </button>
                  </Link>
                  <button
                    onClick={() => confirmDelete(it._id, type === "announcement" ? "announcements" : "events")}
                    className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 size={18} />
                  </button>
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
        <div className="text-center py-16 px-6">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 font-rubik mb-2">
              No merchandise drafts yet
            </h3>
            <p className="text-gray-500 font-raleway mb-6 text-sm">
              Create your first merch draft to get started
            </p>
            <Link href="/create/merch">
              <Button variant="primary2" size="sm">
                Create Merch
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="group relative bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-100 rounded-2xl p-6 hover:border-primary3/40 hover:shadow-xl hover:shadow-primary3/10 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary3 to-primary1 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {item.image ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary2/20 to-primary1/20 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-8 h-8 text-primary2" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary3 font-rubik text-xl mb-2 line-clamp-1 group-hover:text-primary3 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-raleway line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary2/10 to-primary1/10 text-primary2 rounded-xl text-xs font-bold border border-primary2/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary2" />
                      {item.prices.length} Price {item.prices.length === 1 ? 'Option' : 'Options'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link href={`/create/merch?edit=${item._id}`}>
                  <button className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110">
                    <Pencil size={18} />
                  </button>
                </Link>
                <button
                  onClick={() => confirmDelete(item._id, "merch")}
                  className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <Trash2 size={18} />
                </button>
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
        <div className="text-center py-16 px-6">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Quote className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 font-rubik mb-2">
              No testimonial drafts yet
            </h3>
            <p className="text-gray-500 font-raleway mb-6 text-sm">
              Create your first testimonial draft to get started
            </p>
            <Link href="/create/testimonials">
              <Button variant="primary2" size="sm">
                Create Testimonial
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="group relative bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-100 rounded-2xl p-6 hover:border-primary3/40 hover:shadow-xl hover:shadow-primary3/10 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary3 to-primary1 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {item.image ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 shadow-md ring-2 ring-white group-hover:shadow-lg transition-shadow">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary1/20 to-purple-200/30 flex items-center justify-center text-primary1 font-bold text-2xl flex-shrink-0 shadow-md ring-2 ring-white">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary3 font-rubik text-xl mb-1 line-clamp-1 group-hover:text-primary3 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-primary1 font-bold font-raleway mb-3 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary1" />
                    {item.role}
                  </p>
                  <div className="relative">
                    <Quote className="absolute -left-1 -top-1 w-5 h-5 text-purple-200" />
                    <p className="text-sm text-gray-600 font-raleway line-clamp-2 italic pl-4">
                      {item.quote}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link href={`/create/testimonials?edit=${item._id}`}>
                  <button className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110">
                    <Pencil size={18} />
                  </button>
                </Link>
                <button
                  onClick={() => confirmDelete(item._id, "testimonials")}
                  className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <Trash2 size={18} />
                </button>
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
        <div className="text-center py-16 px-6">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Handshake className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 font-rubik mb-2">
              No sponsor drafts yet
            </h3>
            <p className="text-gray-500 font-raleway mb-6 text-sm">
              Create your first sponsor draft to get started
            </p>
            <Link href="/create/sponsors">
              <Button variant="primary2" size="sm">
                Create Sponsor
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="group relative bg-gradient-to-br from-white to-gray-50/50 border-2 border-gray-100 rounded-2xl p-6 hover:border-primary3/40 hover:shadow-xl hover:shadow-primary3/10 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary3 to-primary1 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {item.image ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/50 flex items-center justify-center text-amber-600 font-bold text-2xl flex-shrink-0 shadow-md">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary3 font-rubik text-xl mb-2 line-clamp-1 group-hover:text-primary3 transition-colors">
                    {item.name}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-200">
                    <Handshake className="w-3.5 h-3.5" />
                    {item.type}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link href={`/create/sponsors?edit=${item._id}`}>
                  <button className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110">
                    <Pencil size={18} />
                  </button>
                </Link>
                <button
                  onClick={() => confirmDelete(item._id, "sponsors")}
                  className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: "announcements" as TabType, label: "Announcements", icon: Megaphone, count: announcements.filter(a => !a.isPublished).length },
    { id: "events" as TabType, label: "Events", icon: CalendarDays, count: events.filter(e => !e.isPublished).length },
    { id: "testimonials" as TabType, label: "Testimonials", icon: Quote, count: testimonials.filter(t => !t.isActive).length },
    { id: "sponsors" as TabType, label: "Sponsors", icon: Handshake, count: sponsors.filter(s => !s.isActive).length },
    { id: "merch" as TabType, label: "Merch", icon: ShoppingBag, count: merch.filter(m => !m.isActive).length },
  ];

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
              {/* Improved Tabs */}
              <div className="relative">
                <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 flex-shrink-0 ${
                          isActive
                            ? "bg-gradient-to-br from-primary3 to-primary1 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:text-gray-900 border-2 border-gray-100 hover:border-gray-200 hover:shadow-md"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
                        )}
                        <div className="relative flex items-center gap-3">
                          <div className={`p-2 rounded-xl transition-all ${
                            isActive ? "bg-white/20" : "bg-gray-100"
                          }`}>
                            <Icon size={18} className={isActive ? "text-white" : "text-gray-600"} />
                          </div>
                          <span className="whitespace-nowrap text-sm">{tab.label}</span>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold min-w-[28px] text-center ${
                            isActive 
                              ? "bg-white/25 text-white" 
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {tab.count}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Area */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 min-h-[400px]">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-28 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl animate-pulse" />
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-rubik mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-500 font-raleway mb-6">
              Are you sure you want to delete this draft? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />

          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
            <div className="flex flex-col items-center gap-6">
              {/* Success Icon with Animation */}
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg relative">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl text-primary3 font-bold font-rubik">
                  {successMessage.title}
                </h3>
                <p className="text-gray-600 font-raleway">
                  {successMessage.description}
                </p>
              </div>

              <div className="flex gap-3 mt-2 w-full">
                <Button
                  variant="primary3"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}