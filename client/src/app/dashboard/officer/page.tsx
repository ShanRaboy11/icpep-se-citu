"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Grid from "../../components/grid";
import { DashboardHeader } from "../components/DashboardHeader";
import { StatCard } from "../components/StatCard";
import { QuickActionCard } from "../components/QuickActionCard";
import { ActivityCard } from "../components/ActivityCard";
import { EventCard } from "../components/EventCard";
import { AnnouncementCard } from "../components/AnnouncementCard";

import {
  officerStats,
  recentActivities,
  upcomingEvents,
  latestAnnouncements,
} from "../mock-data";

import {
  Users,
  Calendar,
  Megaphone,
  ShoppingBag,
  CalendarPlus,
  UserCheck,
  Package,
  CalendarClock,
  ArrowRight,
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

export default function OfficerDashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />
        <div className="relative z-10 flex flex-col">
          <Header />

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-[9.5rem] pb-24 flex flex-col gap-8">
            
            {/* 1. Header (Spans all 3 columns) */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <DashboardHeader
                userName="Gio"
                role="officer"
                position="Council Officer – Treasurer"
                academicYear="A.Y. 2025 – 2026"
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
                {officerStats.map((stat) => (
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <QuickActionCard
                  title="Create Event"
                  description="Publish a new event."
                  icon={<CalendarPlus className="h-4 w-4" />}
                  onClick={() => router.push("/create/events")}
                  accentColor="primary"
                />
                <QuickActionCard
                  title="Post Announcement"
                  description="Broadcast announcements."
                  icon={<Megaphone className="h-4 w-4" />}
                  onClick={() => router.push("/create/announcements")}
                  accentColor="steel"
                />
                <QuickActionCard
                  title="Verify Membership"
                  description="Approve registrations."
                  icon={<UserCheck className="h-4 w-4" />}
                  onClick={() => router.push("/users")}
                  accentColor="primary"
                />
                <QuickActionCard
                  title="Add Merchandise"
                  description="Update shop items."
                  icon={<Package className="h-4 w-4" />}
                  onClick={() => router.push("/create/merch")}
                  accentColor="steel"
                />
                <QuickActionCard
                  title="Schedule Meeting"
                  description="Set office hours."
                  icon={<CalendarClock className="h-4 w-4" />}
                  onClick={() => router.push("/commeet/availability")}
                  accentColor="primary"
                />
              </div>
            </motion.div>

            {/* 4. Bento grid bottom section: Left (Events + Announcements), Right (Tall Activities) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column (Spans 2 columns) */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* Upcoming Events */}
                <motion.div
                  custom={3}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-rubik text-lg font-bold text-primary3 tracking-tight">
                      Upcoming Events
                    </h3>
                    
                    <button
  onClick={() => router.push("/events")}
  className="flex items-center justify-center gap-2 border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white text-xs font-raleway font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer w-[220px] sm:w-auto"
>
  <span>View All Events</span>
  <ArrowRight className="h-4 w-4" />
</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {upcomingEvents.map((event) => (
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
                </motion.div>

                {/* Recent Announcements */}
                <motion.div
                  custom={4}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-rubik text-lg font-bold text-primary3 tracking-tight">
                      Recent Announcements
                    </h3>
                    <button
  onClick={() => router.push("/announcements")}
  className="flex items-center justify-center gap-2 border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white text-xs font-raleway font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer w-[220px] sm:w-auto"
>
  <span>View All</span>
  <ArrowRight className="h-4 w-4" />
</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {latestAnnouncements.slice(0, 2).map((ann) => (
    <AnnouncementCard
      key={ann.id}
      title={ann.title}
      content={ann.content}
      publishDate={ann.publishDate}
      onClick={() => router.push("/announcements")}
    />
  ))}
</div>
                </motion.div>

              </div>

              {/* Right Column (Spans 1 column, tall activity card) */}
              <motion.div
                custom={5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-1 flex flex-col gap-4 bg-white/70 border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[500px]"
              >
                <h3 className="font-rubik text-lg font-bold text-primary3 tracking-tight">
                  Recent Activities
                </h3>
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[580px] pr-1">
                  {recentActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      title={activity.title}
                      description={activity.description}
                      timestamp={activity.timestamp}
                      type={activity.type}
                    />
                  ))}
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </main>

      <div className="mt-[-35px] md:mt-[-80px] relative z-0">
        <Footer />
      </div>
    </div>
  );
}
