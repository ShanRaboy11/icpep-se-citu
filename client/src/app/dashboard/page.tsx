"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/app/components/feedback/loading";
import { OFFICER_DASHBOARD_ROLES } from "./roles";
import OfficerDashboard from "../components/dashboard/officer-dashboard";
import StudentDashboard from "../components/dashboard/student-dashboard";

/**
 * Dashboard — renders the officer or student dashboard based on the user's
 * role, without moving to a role-named route (so the URL always just reads
 * /dashboard, not /dashboard/officer or /dashboard/student).
 */
export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (!token || !userRole) {
      router.replace("/login");
      return;
    }

    setRole(userRole);
  }, [router]);

  if (!role) {
    return <LoadingScreen />;
  }

  if (role === "admin") return <OfficerDashboard variant="admin" />;

  return OFFICER_DASHBOARD_ROLES.includes(role) ? (
    <OfficerDashboard />
  ) : (
    <StudentDashboard />
  );
}
