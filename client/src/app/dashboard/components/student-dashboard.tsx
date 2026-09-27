"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Grid from "../../components/grid";
import { LoadingScreen } from "../../components/loading";
import { DashboardHeader } from "../components/DashboardHeader";
import { EventCard } from "../components/EventCard";
import { AnnouncementCard } from "../components/AnnouncementCard";
import { MerchandiseCard } from "../components/MerchandiseCard";
import { ProfileSummary } from "../components/ProfileSummary";

import userService, { CurrentUser } from "../../services/user";
import eventService from "../../services/event";
import announcementService from "../../services/announcement";
import merchService, { MerchItem } from "../../services/merch";

import { ChevronRight } from "lucide-react";

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" as const },
  }),
};

interface DisplayEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  imageUrl: string;
  status: "Upcoming" | "Ongoing" | "Completed";
}

interface DisplayAnnouncement {
  id: string;
  title: string;
  content: string;
  publishDate: string;
}

const formatYearLevel = (value?: string | number) => {
  if (value === undefined || value === null || value === "") return "—";
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  if (Number.isNaN(n)) return String(value);
  const suffixes = ["th", "st", "nd", "rd"];
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : suffixes[n % 10] || "th";
  return `${n}${suffix} Year`;
};

const eventStatus = (eventDate: string): DisplayEvent["status"] => {
  const now = new Date();
  const date = new Date(eventDate);
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (startOfDay.getTime() === startOfToday.getTime()) return "Ongoing";
  return date > now ? "Upcoming" : "Completed";
};

const formatEventDate = (eventDate: string, time?: string) => {
  const formatted = new Date(eventDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return time ? `${formatted} · ${time}` : formatted;
};

const membershipTypeLabel: Record<string, string> = {
  both: "Local & Regional Member",
  local: "Local Member",
  regional: "Regional Member",
};

const lowestPrice = (prices: MerchItem["prices"]) => {
  if (!prices || prices.length === 0) return "—";
  const min = Math.min(...prices.map((p) => p.price));
  return `₱${min.toLocaleString()}`;
};

export default function StudentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [announcements, setAnnouncements] = useState<DisplayAnnouncement[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date().toISOString();

        const [userRes, eventsRes, announcementsRes, merchRes] = await Promise.all([
          userService.getCurrentUser().catch(() => null),
          eventService
            .getEvents({ isPublished: true, startDate: today, sort: "eventDate", limit: 3 })
            .catch(() => null),
          announcementService
            .getAnnouncements({ isPublished: true, sort: "-publishDate", limit: 2 })
            .catch(() => null),
          merchService.getAll().catch(() => []),
        ]);

        if (userRes?.success && userRes.data) setUser(userRes.data);

        const rawEvents = (eventsRes?.data as any[]) || [];
        setEvents(
          rawEvents.map((e) => ({
            id: e._id,
            title: e.title,
            date: formatEventDate(e.eventDate, e.time),
            venue: e.location || "TBA",
            imageUrl: e.coverImage || "/content/gle.png",
            status: eventStatus(e.eventDate),
          })),
        );

        const rawAnnouncements = (announcementsRes?.data as any[]) || [];
        setAnnouncements(
          rawAnnouncements.map((a) => ({
            id: a.id,
            title: a.title,
            content: a.description || a.content || "",
            publishDate: a.publishDate
              ? new Date(a.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "",
          })),
        );

        setMerch((merchRes || []).filter((m) => m.isActive).slice(0, 2));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <LoadingScreen showEntrance={false} />;
  }

  const isMember = !!user?.membershipStatus?.isMember;
  const validUntil = user?.membershipStatus?.validUntil
    ? new Date(user.membershipStatus.validUntil)
    : null;
  const isExpired = !!validUntil && validUntil < new Date();
  const membershipStatusLabel = isExpired ? "Expired" : isMember ? "Active" : "Pending";
  const membershipTypeText = isMember
    ? membershipTypeLabel[user?.membershipStatus?.membershipType || ""] || "Member"
    : "Non-Member";
  const renewalDateText = validUntil
    ? validUntil.toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : undefined;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />
        <div className="relative z-10 flex flex-col">
          <Header />

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-38 pb-24">

            {/* Bento Grid Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

              {/* 1. Header (Spans all 3 columns) */}
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-3"
              >
                <DashboardHeader
                  userName={user?.firstName || "there"}
                  role="student"
                  membershipStatus={membershipStatusLabel as "Active" | "Pending" | "Expired"}
                  membershipType={membershipTypeText}
                  renewalDate={renewalDateText}
                />
              </motion.div>

              {/* 2. Upcoming Events (Spans 2 columns, Left Column Row 2) */}
              <motion.div
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-2 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-rubik text-lg font-bold text-primary3 tracking-tight">
                    Upcoming Events
                  </h3>

                  <button
  onClick={() => router.push("/events")}
  className="flex items-center justify-center gap-2 border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white text-xs font-raleway font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer w-55 sm:w-auto"
>
  <span>Explore More Events</span>
  <ChevronRight className="h-4 w-4" />
</button>
                </div>
                {events.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
                    {events.map((event) => (
                      <EventCard
                        key={event.id}
                        title={event.title}
                        date={event.date}
                        venue={event.venue}
                        imageUrl={event.imageUrl}
                        status={event.status}
                        onClick={() => router.push(`/events/${event.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="font-raleway text-sm text-slate-500 mt-4">
                    No upcoming events right now — check back soon.
                  </p>
                )}
              </motion.div>

              {/* 3. Profile Summary (Spans 1 column, Right Column Row 2) */}
              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-1"
              >
                <ProfileSummary
                  name={`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Member"}
                  studentNumber={user?.studentNumber || "—"}
                  program="BS Computer Engineering"
                  yearLevel={formatYearLevel(user?.yearLevel)}
                  imageUrl={user?.profilePicture || undefined}
                  onEdit={() => router.push("/profile")}
                />
              </motion.div>

              {/* 4. Latest Announcements (Spans 2 columns, Left Column Row 3) */}
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-2 flex flex-col gap-4 mt-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-rubik text-lg font-bold text-primary3 tracking-tight">
                    Latest Announcements
                  </h3>

                  <button
  onClick={() => router.push("/announcements")}
  className="flex items-center justify-center gap-2 border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white text-xs font-raleway font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer w-55 sm:w-auto"
>
  <span>View All Announcements</span>
  <ChevronRight className="h-4 w-4" />
</button>
                </div>
                {announcements.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {announcements.map((ann) => (
                      <AnnouncementCard
                        key={ann.id}
                        title={ann.title}
                        content={ann.content}
                        publishDate={ann.publishDate}
                        onClick={() => router.push("/announcements")}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="font-raleway text-sm text-slate-500">
                    No announcements posted yet.
                  </p>
                )}
              </motion.div>

              {/* 5. Featured Merchandise (Spans 1 column, Right Column Row 3) */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-1 flex flex-col gap-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mt-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-rubik text-base font-bold text-primary3 tracking-tight">
                    Featured Merchandise
                  </h3>
                  <button
                    onClick={() => router.push("/merch")}
                    className="inline-flex items-center gap-1 font-raleway text-xs font-semibold text-primary1 hover:text-primary3 transition-colors duration-300 cursor-pointer"
                  >
                    Visit Shop
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                {merch.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {merch.map((item) => (
                      <MerchandiseCard
                        key={item._id}
                        name={item.name}
                        price={lowestPrice(item.prices)}
                        imageUrl={item.image || "/content/gle.png"}
                        onClick={() => router.push("/merch")}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="font-raleway text-sm text-slate-500 mt-3">
                    No merchandise available yet.
                  </p>
                )}
              </motion.div>

            </div>

          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
}
