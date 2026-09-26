"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Grid from "../../components/grid";
import { LoadingScreen } from "../../components/loading";
import { DashboardHeader } from "../components/DashboardHeader";
import { StatCard } from "../components/StatCard";
import { QuickActionCard } from "../components/QuickActionCard";
import { ActivityCard, type ActivityType } from "../components/ActivityCard";
import { EventCard } from "../components/EventCard";
import { AnnouncementCard } from "../components/AnnouncementCard";

import { getCurrentAcademicYear } from "../../utils/academic-year";
import userService, { CurrentUser } from "../../services/user";
import eventService from "../../services/event";
import announcementService from "../../services/announcement";
import merchService from "../../services/merch";
import { notificationService } from "../../services/notification";
import siteService from "../../services/site";

import {
  Users,
  Calendar,
  Megaphone,
  ShoppingBag,
  CalendarPlus,
  UserCheck,
  Package,
  CalendarClock,
  ChevronRight,
  Wrench,
} from "lucide-react";

// ─── Icon map for stat cards ──────────────────────────────────────────────────
const statIconMap: Record<string, React.ReactNode> = {
  members: <Users className="h-4 w-4" />,
  events: <Calendar className="h-4 w-4" />,
  announcements: <Megaphone className="h-4 w-4" />,
  merch: <ShoppingBag className="h-4 w-4" />,
};

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

interface DisplayActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: ActivityType;
  isRead: boolean;
  link: string;
}

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

const currentAcademicYear = () =>
  `A.Y. ${getCurrentAcademicYear().replace("-", " - ")}`;

const officerPosition = (user: CurrentUser | null) => {
  if (!user) return undefined;
  if (user.councilPosition) return user.councilPosition;
  if (user.committeeTitle) {
    return user.committeeDepartment
      ? `${user.committeeTitle} – ${user.committeeDepartment}`
      : user.committeeTitle;
  }
  if (user.position) return user.position;
  if (user.role === "admin") return "Administrator";
  return undefined;
};

const notificationToActivityType = (type: string): ActivityType => {
  if (type === "rsvp") return "event";
  if (type === "announcement" || type === "event" || type === "membership") return type;
  return "event";
};

// Mirrors header.tsx's notification-dropdown link resolution, so clicking a
// notification here lands in the same place it would from the header bell.
const resolveNotificationLink = (n: {
  link?: string;
  type: string;
  relatedId?: string;
  title: string;
}) => {
  if (n.link) return n.link;
  if (n.type === "announcement" && n.relatedId) return `/announcements/${n.relatedId}`;
  if (n.type === "announcement") return "/announcements";
  if (n.type === "event" && n.relatedId) return `/events/${n.relatedId}`;
  if (n.type === "event") return "/events";
  if (n.type === "membership") return "/profile";
  if (n.type === "rsvp") return "/commeet";
  if (n.type === "system" || n.title.includes("Password")) return "/profile";
  return "/home";
};

const timeAgo = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function OfficerDashboard({
  variant = "officer",
}: {
  variant?: "officer" | "admin";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [stats, setStats] = useState({ members: 0, events: 0, announcements: 0, merch: 0 });
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [announcements, setAnnouncements] = useState<DisplayAnnouncement[]>([]);
  const [activities, setActivities] = useState<DisplayActivity[]>([]);
  const [maintenanceOn, setMaintenanceOn] = useState<boolean | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date().toISOString();

        const [userRes, userStatsRes, eventsRes, recentAnnouncementsRes, merchList, notificationsRes] =
          await Promise.all([
            userService.getCurrentUser().catch(() => null),
            userService.getStats().catch(() => null),
            eventService
              .getEvents({ isPublished: true, startDate: today, sort: "eventDate", limit: 3 })
              .catch(() => null),
            announcementService
              .getAnnouncements({ isPublished: true, sort: "-publishDate", limit: 2 })
              .catch(() => null),
            merchService.getAll().catch(() => []),
            notificationService.getAll(1, 5).catch(() => null),
          ]);

        if (userRes?.success && userRes.data) setUser(userRes.data);

        if (variant === "admin") {
          siteService
            .getSettings()
            .then((settings) => setMaintenanceOn(settings.maintenanceMode))
            .catch(() => {});
        }

        setStats({
          members: userStatsRes?.data?.members ?? 0,
          events: eventsRes?.pagination?.total ?? 0,
          announcements: recentAnnouncementsRes?.pagination?.total ?? 0,
          merch: (merchList || []).filter((m) => m.isActive).length,
        });

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

        const rawAnnouncements = (recentAnnouncementsRes?.data as any[]) || [];
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

        const rawNotifications = (notificationsRes?.data as any[]) || [];
        setActivities(
          rawNotifications.map((n) => ({
            id: n._id,
            title: n.title,
            description: n.message,
            timestamp: timeAgo(n.createdAt),
            type: notificationToActivityType(n.type),
            isRead: !!n.isRead,
            link: resolveNotificationLink(n),
          })),
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [variant]);

  const handleActivityClick = async (activity: DisplayActivity) => {
    if (!activity.isRead) {
      setActivities((prev) =>
        prev.map((a) => (a.id === activity.id ? { ...a, isRead: true } : a)),
      );
      try {
        await notificationService.markAsRead(activity.id);
      } catch {
      }
    }
    router.push(activity.link);
  };

  if (loading) {
    return <LoadingScreen showEntrance={false} />;
  }

  // /create/* and /users only admit council officers and admins, so the
  // shortcuts to them are only useful to those roles.
  const canManage = user?.role === "council-officer" || user?.role === "admin";

  const officerStats = [
    {
      id: "members",
      title: "Total Members",
      count: stats.members,
      subtitle: "Active registered members",
      color: "blue" as const,
    },
    {
      id: "events",
      title: "Upcoming Events",
      count: stats.events,
      subtitle: "Scheduled ahead",
      color: "cyan" as const,
    },
    {
      id: "announcements",
      title: "Announcements",
      count: stats.announcements,
      subtitle: "Total published",
      color: "sky" as const,
    },
    {
      id: "merch",
      title: "Merch Items",
      count: stats.merch,
      subtitle: "Available in store",
      color: "blue" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />
        <div className="relative z-10 flex flex-col">
          <Header />

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-38 pb-24 flex flex-col gap-8">

            {/* 1. Header (Spans all 3 columns) */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <DashboardHeader
                userName={user?.firstName || "there"}
                role={variant}
                position={variant === "admin" ? "Administrator" : officerPosition(user)}
                academicYear={currentAcademicYear()}
              />
            </motion.div>

            {/* 2. Stats Block (Full width, horizontal line of stats) */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              <h3 className="font-rubik text-sm font-bold text-primary3 tracking-wide uppercase">
                Chapter Analytics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {officerStats
                  // the member count comes from an officer/admin-only endpoint
                  .filter((stat) => canManage || stat.id !== "members")
                  .map((stat) => (
                  <StatCard
                    key={stat.id}
                    icon={statIconMap[stat.id]}
                    count={stat.count}
                    title={stat.title}
                    subtitle={stat.subtitle}
                    color={stat.color}
                  />
                ))}
              </div>
            </motion.div>

            {/* 3. Quick Actions (Full width, horizontal line of actions) */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              <h3 className="font-rubik text-sm font-bold text-primary3 tracking-wide uppercase">
                Action Shortcuts
              </h3>
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${
                  variant === "admin" ? "md:grid-cols-6" : "md:grid-cols-5"
                }`}
              >
                {canManage && (
                  <>
                <QuickActionCard
                  title="Create Event"
                  description="Publish a new event."
                  icon={<CalendarPlus className="h-4 w-4" />}
                  onClick={() => router.push("/create/events")}
                  accentColor="primary"
                  actionLabel="Create"
                />
                <QuickActionCard
                  title="Post Announcement"
                  description="Broadcast announcements."
                  icon={<Megaphone className="h-4 w-4" />}
                  onClick={() => router.push("/create/announcements")}
                  accentColor="steel"
                  actionLabel="Post"
                />
                <QuickActionCard
                  title="Verify Membership"
                  description="Approve registrations."
                  icon={<UserCheck className="h-4 w-4" />}
                  onClick={() => router.push("/users")}
                  accentColor="primary"
                  actionLabel="Verify"
                />
                <QuickActionCard
                  title="Add Merchandise"
                  description="Update shop items."
                  icon={<Package className="h-4 w-4" />}
                  onClick={() => router.push("/create/merch")}
                  accentColor="steel"
                  actionLabel="Add"
                />
                  </>
                )}
                <QuickActionCard
                  title="Schedule Meeting"
                  description="Set office hours."
                  icon={<CalendarClock className="h-4 w-4" />}
                  onClick={() => router.push("/commeet")}
                  accentColor="primary"
                  actionLabel="Schedule"
                />
                {variant === "admin" && (
                  <QuickActionCard
                    title="Maintenance"
                    description="Suspend the site."
                    icon={<Wrench className="h-4 w-4" />}
                    onClick={() => router.push("/create/maintenance")}
                    accentColor="steel"
                    actionLabel="Manage"
                  />
                )}
              </div>
            </motion.div>

            {variant === "admin" && (
              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                <h3 className="font-rubik text-sm font-bold text-primary3 tracking-wide uppercase">
                  System
                </h3>
                <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        maintenanceOn ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                    />
                    <div className="font-raleway">
                      <p className="text-sm font-semibold text-primary3">
                        {maintenanceOn === null
                          ? "Checking site status..."
                          : maintenanceOn
                            ? "Under maintenance — visitors see the maintenance screen"
                            : "Site is live"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Only admins can turn maintenance mode on or off.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/create/maintenance")}
                    className="rounded-full border-2 border-primary1 px-5 py-2 font-raleway text-xs font-semibold text-primary1 transition-all duration-300 hover:bg-primary1 hover:text-white cursor-pointer"
                  >
                    Manage maintenance
                  </button>
                </div>
              </motion.div>
            )}

            {/* 4. Bento grid bottom section: Left (Events + Announcements), Right (Tall Notifications) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

              {/* Left Column (Spans 2 columns) */}
              <div className="lg:col-span-2 flex flex-col gap-8">

                {/* Upcoming Events */}
                <motion.div
                  custom={3}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-4 mt-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-rubik text-lg font-bold text-primary3 tracking-tight">
                      Upcoming Events
                    </h3>

                    <button
  onClick={() => router.push("/events")}
  className="flex items-center justify-center gap-2 border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white text-xs font-raleway font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer w-55 sm:w-auto"
>
  <span>View All Events</span>
  <ChevronRight className="h-4 w-4" />
</button>
                  </div>
                  {events.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <p className="font-raleway text-sm text-slate-500">
                      No upcoming events scheduled.
                    </p>
                  )}
                </motion.div>

                {/* Recent Announcements */}
                <motion.div
                  custom={4}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-4 mt-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-rubik text-lg font-bold text-primary3 tracking-tight">
                      Recent Announcements
                    </h3>
                    <button
  onClick={() => router.push("/announcements")}
  className="flex items-center justify-center gap-2 border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white text-xs font-raleway font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg cursor-pointer w-55 sm:w-auto"
>
  <span>View All</span>
  <ChevronRight className="h-4 w-4" />
</button>
                  </div>
                  {announcements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              </div>

              {/* Right Column (Spans 1 column, tall notifications card) */}
              <motion.div
                custom={5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-1 flex flex-col gap-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm min-h-125 mt-5"
              >
                <h3 className="font-rubik text-lg font-bold text-primary3 tracking-tight">
                  Notifications
                </h3>
                {activities.length > 0 ? (
                  <div className="flex flex-col divide-y divide-slate-100 overflow-y-auto overflow-x-hidden themed-scrollbar max-h-145 pr-1">
                    {activities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        title={activity.title}
                        description={activity.description}
                        timestamp={activity.timestamp}
                        type={activity.type}
                        isRead={activity.isRead}
                        onClick={() => handleActivityClick(activity)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="font-raleway text-sm text-slate-500">
                    You&apos;re all caught up — no notifications yet.
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
