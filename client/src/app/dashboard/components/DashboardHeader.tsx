"use client";

import type { FC } from "react";
import { Shield, Calendar, Clock } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  role: "officer" | "student";
  position?: string;
  academicYear?: string;
  membershipStatus?: "Active" | "Pending" | "Expired";
  membershipType?: string;
  renewalDate?: string;
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({
  userName,
  role,
  position = "Committee Officer",
  academicYear = "A.Y. 2025 - 2026",
  membershipStatus = "Active",
  membershipType = "All-Access Pass",
  renewalDate = "July 2027",
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#003599] via-[#0073AD] to-[#04a6ef] p-8 md:p-10 text-white shadow-xl">
      {/* Decorative blobs inside header */}
      <div className="absolute right-[-10%] top-[-50%] h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[10%] h-48 w-48 rounded-full bg-[#45c7ff]/20 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider font-raleway">
            {role === "officer" ? "Officer Portal" : "Student Dashboard"}
          </span>
          <h1 className="mt-3 font-rubik text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {getGreeting()}, {userName}!
          </h1>
          <p className="mt-2 font-raleway text-white/80 text-base sm:text-lg">
            {role === "officer"
              ? "Welcome back to the ICpEP.SE CIT-U Officer Portal."
              : "Welcome back to your member dashboard. Here's your status update."}
          </p>
        </div>

        {role === "officer" ? (
          <div className="flex flex-wrap items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#45c7ff]" />
              <div className="font-raleway">
                <p className="text-xs text-white/60">Position</p>
                <p className="text-sm font-semibold">{position}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#45c7ff]" />
              <div className="font-raleway">
                <p className="text-xs text-white/60">Academic Year</p>
                <p className="text-sm font-semibold">{academicYear}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold font-raleway ${
                  membershipStatus === "Active" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : 
                  membershipStatus === "Pending" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : 
                  "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}>
                  {membershipStatus}
                </span>
              </div>
              <div className="font-raleway">
                <p className="text-xs text-white/60">Membership Type</p>
                <p className="text-sm font-semibold">{membershipType}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#45c7ff]" />
              <div className="font-raleway">
                <p className="text-xs text-white/60">Renewal Date</p>
                <p className="text-sm font-semibold">{renewalDate}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
