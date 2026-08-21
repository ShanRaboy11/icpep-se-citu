"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Grid from "../../components/grid";
import { DashboardHeader } from "../components/DashboardHeader";
import { EventCard } from "../components/EventCard";
import { AnnouncementCard } from "../components/AnnouncementCard";
import { MerchandiseCard } from "../components/MerchandiseCard";
import { ProfileSummary } from "../components/ProfileSummary";

import {
  studentEvents,
  latestAnnouncements,
  featuredMerch,
} from "../mock-data";

import { ArrowRight } from "lucide-react";

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" as const },
  }),
};

export default function StudentDashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />
        <div className="relative z-10 flex flex-col">
          <Header />

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-[9.5rem] pb-24">
            
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
                  userName="Gio"
                  role="student"
                  membershipStatus="Active"
                  membershipType="All-Access Pass"
                  renewalDate="July 2027"
                />
              </motion.div>

              {/* 2. My Events (Spans 2 columns, Left Column Row 2) */}
              <motion.div
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-2 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-rubik text-lg font-bold text-primary3 tracking-tight">
                    My Registered Events
                  </h3>
            
                  <button
  onClick={() => router.push("/events")}
  className="flex items-center justify-center gap-2 border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white text-xs font-raleway font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer w-[220px] sm:w-auto"
>
  <span>Explore More Events</span>
  <ArrowRight className="h-4 w-4" />
</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
                  {studentEvents.map((event) => (
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

              {/* 3. Profile Summary (Spans 1 column, Right Column Row 2) */}
              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="lg:col-span-1"
              >
                <ProfileSummary
                  name="Gio Macatual"
                  studentNumber="23-4149-813"
                  program="BS Computer Engineering"
                  yearLevel="3rd Year"
                  imageUrl="/gle.png"
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
  className="flex items-center justify-center gap-2 border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white text-xs font-raleway font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer w-[220px] sm:w-auto"
>
  <span>View All Announcements</span>
  <ArrowRight className="h-4 w-4" />
</button>
                </div>
                <div className="flex flex-col gap-3">
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
                    className="inline-flex items-center gap-1 font-raleway text-xs font-semibold text-primary1 hover:text-primary3 transition-colors duration-300"
                  >
                    Visit Shop
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {featuredMerch.slice(0, 2).map((item) => (
                    <MerchandiseCard
                      key={item.id}
                      name={item.name}
                      price={item.price}
                      imageUrl={item.imageUrl}
                      availableSizes={item.availableSizes}
                      onClick={() => router.push("/merch")}
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
