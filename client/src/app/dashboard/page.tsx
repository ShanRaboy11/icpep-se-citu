"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Dashboard index — auto-routes to the appropriate dashboard
 * based on the user's role stored in localStorage.
 *
 * Officer roles   → /dashboard/officer
 * Student/Member  → /dashboard/student
 * Unauthenticated → /login
 */
export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const token    = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (!token || !userRole) {
      router.replace("/login");
      return;
    }

    const officerRoles = ["council-officer", "committee-officer", "faculty"];
    if (officerRoles.includes(userRole)) {
      router.replace("/dashboard/officer");
    } else {
      router.replace("/dashboard/student");
    }
  }, [router]);

  // Brief loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-primary1 border-t-transparent animate-spin" />
        <p className="font-raleway text-sm text-slate-500">Loading your dashboard…</p>
      </div>
    </div>
  );
}
