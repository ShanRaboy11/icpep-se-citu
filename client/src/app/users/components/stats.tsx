"use client";

import { User } from "../utils/user";
import { Users, UserCheck, GraduationCap, Shield } from "lucide-react";

interface UserStatsProps {
  users: User[];
}

export default function UserStats({ users }: UserStatsProps) {
  const totalUsers = users.length;
  const activeMembers = users.filter((u) => u.membershipStatus.isMember).length;
  const officers = users.filter((u) => u.role === "council-officer" || u.role === "committee-officer").length;
  const faculty = users.filter((u) => u.role === "faculty").length;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "from-primary1 to-primary1/80",
      bgColor: "bg-primary1/10",
      textColor: "text-primary1",
    },
    {
      label: "Active Members",
      value: activeMembers,
      icon: UserCheck,
      color: "from-secondary2 to-secondary2/80",
      bgColor: "bg-secondary2/10",
      textColor: "text-secondary2",
    },
    {
      label: "Officers",
      value: officers,
      icon: Shield,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Faculty",
      value: faculty,
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary1/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-raleway text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className="font-rubik text-3xl font-bold text-primary3">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.bgColor} p-3 rounded-lg transition-transform group-hover:scale-110`}
              >
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
            ></div>
          </div>
        );
      })}
    </div>
  );
}