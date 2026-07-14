"use client";

import type { FC, ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  count: string | number;
  title: string;
  subtitle: string;
  color?: "blue" | "cyan" | "sky" | "royal";
}

const colorStyles = {
  blue: {
    bg: "bg-blue-50/50 hover:bg-blue-50 border-blue-100 hover:border-blue-200",
    iconBg: "bg-blue-100/80 text-[#003599]",
    badge: "text-[#003599] border-blue-200 bg-white/70",
  },
  cyan: {
    bg: "bg-cyan-50/50 hover:bg-cyan-50 border-cyan-100 hover:border-cyan-200",
    iconBg: "bg-cyan-100/80 text-[#006fa1]",
    badge: "text-[#006fa1] border-cyan-200 bg-white/70",
  },
  sky: {
    bg: "bg-sky-50/50 hover:bg-sky-50 border-sky-100 hover:border-sky-200",
    iconBg: "bg-sky-100/80 text-[#0073AD]",
    badge: "text-[#0073AD] border-sky-200 bg-white/70",
  },
  royal: {
    bg: "bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100 hover:border-indigo-200",
    iconBg: "bg-indigo-100/80 text-[#003599]",
    badge: "text-[#003599] border-indigo-200 bg-white/70",
  },
};

export const StatCard: FC<StatCardProps> = ({
  icon,
  count,
  title,
  subtitle,
  color = "blue",
}) => {
  const styles = colorStyles[color];

  return (
    <div
      className={`flex flex-col rounded-2xl p-4 border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group ${styles.bg}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold font-raleway transition-all duration-300 ${styles.badge}`}
        >
          {title}
        </span>
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${styles.iconBg}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-1">
        <h3 className="font-rubik text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          {count}
        </h3>
        <p className="mt-0.5 font-raleway text-slate-600 text-xs truncate">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
