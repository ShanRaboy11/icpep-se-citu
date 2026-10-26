"use client";

import type { FC, ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  count: string | number;
  title: string;
  subtitle?: string;
  color?: "blue" | "cyan" | "sky" | "royal" | "violet";
}

const colorStyles = {
  blue: {
    bg: "bg-white hover:bg-blue-50 border-blue-100 hover:border-blue-200",
    iconBg: "bg-blue-50 border-blue-100 group-hover:bg-white group-hover:border-blue-200 text-primary3",
    badge: "text-primary3 border-blue-200 bg-white/70",
  },
  cyan: {
    bg: "bg-white hover:bg-cyan-50 border-cyan-100 hover:border-cyan-200",
    iconBg: "bg-cyan-50 border-cyan-100 group-hover:bg-white group-hover:border-cyan-200 text-steelblue-200",
    badge: "text-steelblue-200 border-cyan-200 bg-white/70",
  },
  sky: {
    bg: "bg-white hover:bg-sky-50 border-sky-100 hover:border-sky-200",
    iconBg: "bg-sky-50 border-sky-100 group-hover:bg-white group-hover:border-sky-200 text-ocean",
    badge: "text-ocean border-sky-200 bg-white/70",
  },
  royal: {
    bg: "bg-white hover:bg-indigo-50 border-indigo-100 hover:border-indigo-200",
    iconBg: "bg-indigo-50 border-indigo-100 group-hover:bg-white group-hover:border-indigo-200 text-primary3",
    badge: "text-primary3 border-indigo-200 bg-white/70",
  },
  violet: {
    bg: "bg-white hover:bg-purple-50 border-purple-100 hover:border-purple-200",
    iconBg: "bg-purple-50 border-purple-100 group-hover:bg-white group-hover:border-purple-200 text-purple-600",
    badge: "text-purple-600 border-purple-200 bg-white/70",
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
      className={`flex flex-col rounded-3xl p-4 border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group ${styles.bg}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-block rounded-md py-0.5 text-[14px] font-semibold font-raleway transition-all duration-300 `}
        >
          {title}
        </span>
        <div
          className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${styles.iconBg}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-1">
        <h3 className="font-rubik text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          {count}
        </h3>
        {subtitle && (
          <p className="mt-0.5 font-raleway text-slate-600 text-xs truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
