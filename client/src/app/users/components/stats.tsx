"use client";

import { User } from "../utils/user";
import {
  Users,
  UserCheck,
  GraduationCap,
  Shield,
  Handshake,
} from "lucide-react";
import { StatCard } from "../../dashboard/components/StatCard";

interface UserStatsProps {
  users: User[];
}

export default function UserStats({ users }: UserStatsProps) {
  const totalUsers = users.length;
  const activeMembers = users.filter((u) => u.membershipStatus.isMember).length;
  const council_officers = users.filter(
    (u) => u.role === "council-officer"
  ).length;
  const committee_officers = users.filter(
    (u) => u.role === "committee-officer"
  ).length;
  const faculty = users.filter((u) => u.role === "faculty").length;

  const stats = [
    {
      id: "total",
      title: "Total Users",
      count: totalUsers,
      subtitle: "All registered accounts",
      icon: <Users className="h-4 w-4" />,
      color: "blue" as const,
    },
    {
      id: "members",
      title: "Members",
      count: activeMembers,
      subtitle: "Active local/regional members",
      icon: <UserCheck className="h-4 w-4" />,
      color: "cyan" as const,
    },
    {
      id: "committee",
      title: "Committee Officers",
      count: committee_officers,
      subtitle: "Committee leadership",
      icon: <Handshake className="h-4 w-4" />,
      color: "sky" as const,
    },
    {
      id: "council",
      title: "Council Officers",
      count: council_officers,
      subtitle: "Executive council",
      icon: <Shield className="h-4 w-4" />,
      color: "royal" as const,
    },
    {
      id: "faculty",
      title: "Faculty",
      count: faculty,
      subtitle: "Faculty advisors",
      icon: <GraduationCap className="h-4 w-4" />,
      color: "violet" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          count={stat.count}
          title={stat.title}
          subtitle={stat.subtitle}
          color={stat.color}
        />
      ))}
    </div>
  );
}
