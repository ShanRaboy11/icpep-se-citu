"use client";

import type { FC, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
  accentColor?: "primary" | "steel" | "sky";
}

const accentStyles = {
  primary: {
    border: "border-blue-100 hover:border-blue-300",
    bg: "bg-white hover:bg-blue-50/80",
    icon: "text-[#003599] bg-blue-100/60",
    button: "bg-[#003599] hover:bg-[#004ab3] text-white",
  },
  steel: {
    border: "border-cyan-100 hover:border-cyan-300",
    bg: "bg-white hover:bg-cyan-50/80",
    icon: "text-[#006fa1] bg-cyan-100/60",
    button: "bg-[#006fa1] hover:bg-[#007fb8] text-white",
  },
  sky: {
    border: "border-sky-100 hover:border-sky-300",
    bg: "bg-sky-50/30 hover:bg-sky-50/80",
    icon: "text-[#0073AD] bg-sky-100/60",
    button: "bg-[#0073AD] hover:bg-[#0086c9] text-white",
  },
};

export const QuickActionCard: FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  onClick,
  accentColor = "primary",
}) => {
  const styles = accentStyles[accentColor];

  return (
    <button
      onClick={onClick}
      className={`flex flex-col text-left rounded-2xl p-4 pt-5 border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group w-full ${styles.bg} ${styles.border}`}
    >
      <div className="flex items-center gap-3 mb-2 w-full">
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${styles.icon}`}
        >
          {icon}
        </div>
        <h4 className="font-rubik text-sm font-medium text-slate-800 tracking-tight truncate">
          {title}
        </h4>
      </div>
      <div
        className={`w-full py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 font-raleway font-semibold text-[11px] transition-all duration-300 ${styles.button}`}
      >
        <span>Execute</span>
        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </button>
  );
};

export default QuickActionCard;
