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
import Sidebar from "@/app/components/sidebar";
import Grid from "@/app/components/grid";
import { GlassCard } from "../components/glass-card";
import {
  Megaphone,
  CalendarDays,
  ShoppingBag,
  Pencil,
  Trash2,
  Quote,
  Handshake,
  AlertTriangle,
  Clock,
  FileText,
} from "lucide-react";

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

type TabType =
  | "announcements"
  | "events"
  | "merch"
  | "testimonials"
  | "sponsors";

const TAB_CONFIG = [
  {
    id: "announcements" as TabType,
    label: "Announcements",
    icon: Megaphone,
    href: "/announcements/create",
    emptyLabel: "announcement",
  },
  {
    id: "events" as TabType,
    label: "Events",
    icon: CalendarDays,
    href: "/events/create",
    emptyLabel: "event",
  },
  {
    id: "testimonials" as TabType,
    label: "Testimonials",
    icon: Quote,
    href: "/create/testimonials",
    emptyLabel: "testimonial",
  },
  {
    id: "sponsors" as TabType,
    label: "Sponsors",
    icon: Handshake,
    href: "/create/sponsors",
    emptyLabel: "sponsor",
  },
  {
    id: "merch" as TabType,
    label: "Merch",
    icon: ShoppingBag,
    href: "/create/merch",
    emptyLabel: "merch item",
  },
];

const TYPE_BADGE: Record<
  string,
  { color: string; bg: string; border: string; dot: string }
> = {
  Meeting: {
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
  },
  Achievement: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  News: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  General: {
    color: "text-gray-600",
    bg: "bg-gray-100",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
};

export default function DraftsPage() {
  const [announcements, setAnnouncements] = useState<DraftItem[]>([]);
  const [events, setEvents] = useState<DraftItem[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("announcements");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: TabType;
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [annRes, evtRes, merchRes, testRes, sponsorRes] =
          await Promise.all([
            announcementService.getMyAnnouncements({ page: 1, limit: 50 }),
            eventService.getMyEvents({ page: 1, limit: 50 }),
            merchService.getAll(),
            testimonialService.getAllTestimonials(),
            sponsorService.getAllSponsors(),
          ]);
        const annData = Array.isArray(annRes.data) ? annRes.data : [];
        const evtData = Array.isArray(evtRes.data) ? evtRes.data : [];
        const testData = Array.isArray(testRes.data)
          ? testRes.data
          : Array.isArray(testRes)
            ? testRes
            : [];
        const sponsorData = Array.isArray(sponsorRes.data)
          ? sponsorRes.data
          : Array.isArray(sponsorRes)
            ? sponsorRes
            : [];
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
        setAnnouncements((p) => p.filter((i) => i._id !== itemToDelete.id));
      } else if (itemToDelete.type === "events") {
        await eventService.deleteEvent(itemToDelete.id);
        setEvents((p) => p.filter((i) => i._id !== itemToDelete.id));
      } else if (itemToDelete.type === "merch") {
        await merchService.delete(itemToDelete.id);
        setMerch((p) => p.filter((i) => i._id !== itemToDelete.id));
      } else if (itemToDelete.type === "testimonials") {
        await testimonialService.deleteTestimonial(itemToDelete.id);
        setTestimonials((p) => p.filter((i) => i._id !== itemToDelete.id));
      } else if (itemToDelete.type === "sponsors") {
        await sponsorService.deleteSponsor(itemToDelete.id);
        setSponsors((p) => p.filter((i) => i._id !== itemToDelete.id));
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

  const draftCounts = {
    announcements: announcements.filter((a) => !a.isPublished).length,
    events: events.filter((e) => !e.isPublished).length,
    testimonials: testimonials.filter((t) => !t.isActive).length,
    sponsors: sponsors.filter((s) => !s.isActive).length,
    merch: merch.filter((m) => !m.isActive).length,
  };

  const totalDrafts = Object.values(draftCounts).reduce((a, b) => a + b, 0);

  // ── EMPTY STATE ──
  const EmptyState = ({
    icon: Icon,
    label,
    href,
  }: {
    icon: any;
    label: string;
    href: string;
  }) => (
    <div className="py-20 flex flex-col items-center gap-5 text-gray-300">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
        <Icon size={26} className="text-gray-300" />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold font-rubik text-gray-400">
          No {label} drafts
        </p>
        <p className="text-xs font-raleway mt-0.5 text-gray-300">
          Nothing saved here yet
        </p>
      </div>
      <Link href={href}>
        <button className="px-5 py-2.5 text-xs font-bold font-rubik text-primary2 border-2 border-primary2/30 hover:border-primary2 hover:bg-primary2/5 rounded-xl transition-all duration-200">
          Create {label}
        </button>
      </Link>
    </div>
  );

  // ── DRAFT ROW ──
  const DraftRow = ({
    editHref,
    onDelete,
    children,
  }: {
    editHref: string;
    onDelete: () => void;
    children: React.ReactNode;
  }) => (
    <div className="group flex items-start justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-50 hover:bg-gray-50/70 transition-all duration-200 first:border-t-0">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Link href={editHref}>
          <button className="p-2 text-gray-400 hover:text-primary1 hover:bg-primary1/10 rounded-lg transition-all duration-150">
            <Pencil size={15} />
          </button>
        </Link>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );

  // ── RENDERERS ──
  const renderAnnouncementsEvents = (
    items: DraftItem[],
    type: "announcement" | "event",
  ) => {
    const filtered = (items || []).filter((it) => !it.isPublished);
    const tabId = type === "announcement" ? "announcements" : "events";
    const tabCfg = TAB_CONFIG.find((t) => t.id === tabId)!;
    const Icon = tabCfg.icon;
    if (filtered.length === 0)
      return (
        <EmptyState icon={Icon} label={tabCfg.emptyLabel} href={tabCfg.href} />
      );
    return (
      <div>
        {filtered.map((it) => {
          const scheduled = it.publishDate
            ? new Date(it.publishDate) > now
            : false;
          const meta = it.type
            ? TYPE_BADGE[it.type] || TYPE_BADGE.General
            : null;
          return (
            <DraftRow
              key={it._id}
              editHref={`/${type === "announcement" ? "announcements" : "events"}/create?edit=${it._id}`}
              onDelete={() => confirmDelete(it._id, tabId)}
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary1/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={14} className="text-primary1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs sm:text-sm text-gray-800 font-rubik line-clamp-2 sm:truncate">
                    {it.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {meta && it.type && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${meta.bg} ${meta.color} ${meta.border}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${meta.dot}`}
                        />
                        {it.type}
                      </span>
                    )}
                    {scheduled && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <Clock size={9} />
                        {new Date(it.publishDate!).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      Draft
                    </span>
                  </div>
                </div>
              </div>
            </DraftRow>
          );
        })}
      </div>
    );
  };

  const renderMerch = () => {
    const filtered = merch.filter((m) => !m.isActive);
    if (filtered.length === 0)
      return (
        <EmptyState
          icon={ShoppingBag}
          label="merch item"
          href="/create/merch"
        />
      );
    return (
      <div>
        {filtered.map((item) => (
          <DraftRow
            key={item._id}
            editHref={`/create/merch?edit=${item._id}`}
            onDelete={() => confirmDelete(item._id, "merch")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag size={16} className="text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs sm:text-sm text-gray-800 font-rubik truncate">
                  {item.name}
                </p>
                {item.description && (
                  <p className="text-xs text-gray-400 font-raleway mt-0.5 truncate">
                    {item.description}
                  </p>
                )}
                <div className="mt-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary2/10 text-primary2 border border-primary2/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary2" />
                    {item.prices.length} price{" "}
                    {item.prices.length === 1 ? "option" : "options"}
                  </span>
                </div>
              </div>
            </div>
          </DraftRow>
        ))}
      </div>
    );
  };

  const renderTestimonials = () => {
    const filtered = testimonials.filter((t) => !t.isActive);
    if (filtered.length === 0)
      return (
        <EmptyState
          icon={Quote}
          label="testimonial"
          href="/create/testimonials"
        />
      );
    return (
      <div>
        {filtered.map((item) => (
          <DraftRow
            key={item._id}
            editHref={`/create/testimonials?edit=${item._id}`}
            onDelete={() => confirmDelete(item._id, "testimonials")}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-100 flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary1/10 text-primary1 text-xs font-black font-rubik">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs sm:text-sm text-gray-800 font-rubik">
                  {item.name}
                </p>
                <p className="text-xs text-primary1 font-semibold font-raleway">
                  {item.role}
                </p>
                {item.quote && (
                  <p className="text-xs text-gray-400 font-raleway italic mt-0.5 truncate max-w-sm">
                    <Quote
                      size={8}
                      className="inline text-primary2/40 mr-0.5 -mt-0.5"
                    />
                    {item.quote}
                  </p>
                )}
              </div>
            </div>
          </DraftRow>
        ))}
      </div>
    );
  };

  const renderSponsors = () => {
    const filtered = sponsors.filter((s) => !s.isActive);
    if (filtered.length === 0)
      return (
        <EmptyState icon={Handshake} label="sponsor" href="/create/sponsors" />
      );
    return (
      <div>
        {filtered.map((item) => (
          <DraftRow
            key={item._id}
            editHref={`/create/sponsors?edit=${item._id}`}
            onDelete={() => confirmDelete(item._id, "sponsors")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-600 font-black text-lg font-rubik">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs sm:text-sm text-gray-800 font-rubik truncate">
                  {item.name}
                </p>
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Handshake size={9} />
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          </DraftRow>
        ))}
      </div>
    );
  };

  const activeConfig = TAB_CONFIG.find((t) => t.id === activeTab)!;
  const activeCount = draftCounts[activeTab];

  return (
    <section className="min-h-screen bg-[#f8f9fc] flex flex-col relative overflow-x-hidden">
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          {/* PAGE HEADER */}
          <div className="mb-14">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-primary2 uppercase font-raleway mb-3">
              <span className="w-8 h-px bg-primary2 inline-block" />
              Content Management
            </div>
            <h1 className="text-4xl sm:text-7xl font-black font-rubik leading-[0.9] tracking-tight">
              <span className="bg-gradient-to-br from-primary3 via-primary1 to-primary2 bg-clip-text text-transparent">
                Drafts &{"\n"}Scheduled
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <p className="text-gray-500 font-raleway text-sm sm:text-base">
                Manage unpublished content and scheduled posts
              </p>
              {totalDrafts > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary2/10 text-primary2 border border-primary2/20">
                  <FileText size={10} />
                  {totalDrafts} total
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </aside>

            <div className="flex-1 min-w-0 space-y-6">
              {/* TABS */}
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none -mx-1 px-1">
                {TAB_CONFIG.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const count = draftCounts[tab.id];
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-3 sm:px-5 py-3 rounded-xl font-bold font-rubik text-xs transition-all duration-200 flex-shrink-0 ${
                        isActive
                          ? "bg-gradient-to-r from-primary1 to-primary2 text-white shadow-lg shadow-primary2/25"
                          : "bg-white text-gray-400 border border-gray-200 hover:text-gray-700 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <Icon
                        size={13}
                        className={isActive ? "text-white/80" : "text-gray-400"}
                      />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black min-w-[20px] text-center ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* CONTENT CARD */}
              <GlassCard>
                <div className="bg-white rounded-2xl overflow-hidden">
                  {/* Card Header */}
                  <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black font-rubik text-primary3">
                        {activeConfig.label}
                      </h2>
                      <p className="text-gray-400 text-xs font-raleway mt-0.5">
                        {activeCount} unpublished{" "}
                        {activeCount === 1 ? "draft" : "drafts"}
                      </p>
                    </div>
                    <Link href={activeConfig.href}>
                      <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold font-rubik text-primary2 border border-primary2/20 hover:border-primary2/50 hover:bg-primary2/5 rounded-full transition-all duration-200">
                        + New{" "}
                        <span className="hidden sm:inline">
                          {activeConfig.emptyLabel}
                        </span>
                      </button>
                    </Link>
                  </div>

                  {/* Content */}
                  {loading ? (
                    <div className="p-4 sm:p-8 space-y-3 sm:space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-14 sm:h-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl animate-pulse"
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      {activeTab === "announcements" &&
                        renderAnnouncementsEvents(
                          announcements,
                          "announcement",
                        )}
                      {activeTab === "events" &&
                        renderAnnouncementsEvents(events, "event")}
                      {activeTab === "testimonials" && renderTestimonials()}
                      {activeTab === "sponsors" && renderSponsors()}
                      {activeTab === "merch" && renderMerch()}
                    </>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-primary3 font-rubik mb-2">
              Delete Draft?
            </h3>
            <p className="text-gray-400 text-sm font-raleway mb-6 leading-relaxed">
              This will permanently remove the draft. This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 text-sm font-bold font-rubik text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 text-sm font-bold font-rubik text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-lg shadow-red-500/25"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl relative">
                  <svg
                    className="w-10 h-10 text-white"
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
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-black text-primary3 font-rubik">
                {successMessage.title}
              </h3>
              <p className="text-gray-400 text-sm font-raleway mt-2">
                {successMessage.description}
              </p>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 text-sm font-bold font-rubik text-white bg-gradient-to-r from-primary1 to-primary2 rounded-xl shadow-lg hover:shadow-primary2/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
