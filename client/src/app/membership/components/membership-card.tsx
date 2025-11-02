"use client";

import { CheckCircle2 } from "lucide-react";
import type { FC, ReactNode } from "react";

type AccentColor = "indigo" | "cyanDark" | "green";

interface MembershipCardProps {
  planLabel: string;
  title: string;
  price: string;
  description: string;
  benefits: string[];
  isHighlighted?: boolean;
  accentColor: AccentColor;
  icon: ReactNode;
  buttonIcon: ReactNode;
}

// THEME SWAP: All colors updated for a light mode theme.
const accentClasses: Record<
  AccentColor,
  { text: string; border: string; glow: string; bg: string; buttonBg: string }
> = {
  indigo: {
    text: "text-indigo-600",
    border: "border-indigo-200",
    glow: "group-hover:shadow-[inset_0_0_15px_rgba(99,102,241,0.4)]",
    bg: "bg-gradient-to-b from-slate-50 to-indigo-100",
    buttonBg: "bg-indigo-500 hover:bg-indigo-600 text-white",
  },
  cyanDark: {
    text: "text-cyan-600",
    border: "border-cyan-200",
    glow: "group-hover:shadow-[inset_0_0_15px_rgba(8,145,178,0.4)]",
    bg: "bg-gradient-to-b from-slate-50 to-cyan-100",
    buttonBg: "bg-cyan-600 hover:bg-cyan-700 text-white",
  },
  green: {
    text: "text-green-600",
    border: "border-green-200",
    glow: "group-hover:shadow-[inset_0_0_15px_rgba(22,163,74,0.4)]",
    bg: "bg-gradient-to-b from-slate-50 to-green-100",
    buttonBg: "bg-green-500 hover:bg-green-600 text-white",
  },
};

const MembershipCard: FC<MembershipCardProps> = ({
  planLabel,
  title,
  price,
  description,
  benefits,
  isHighlighted = false,
  accentColor,
  icon,
  buttonIcon,
}) => {
  const currentAccent = accentClasses[accentColor] || accentClasses.cyanDark;

  const cardClasses = `
    flex flex-col rounded-3xl p-8 h-full border relative group
    transition-all duration-300 ${currentAccent.bg} ${currentAccent.border}
    ${isHighlighted ? "shadow-xl" : "shadow-md"}
  `;

  const buttonClasses = `
    mt-auto w-full rounded-lg py-3 font-rubik font-semibold text-lg flex items-center justify-center gap-2
    transition-all duration-300 cursor-pointer ${currentAccent.buttonBg}
  `;

  return (
    <div className={cardClasses}>
      {/* Icon container */}
      <div
        className={`absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full border ${currentAccent.border} bg-white flex items-center justify-center`}
      >
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center ${currentAccent.text} bg-slate-50 transition-shadow duration-300 ${currentAccent.glow}`}
        >
          {icon}
        </div>
      </div>

      {/* Plan label */}
      <div className="text-center mt-10 mb-6">
        <span
          className={`inline-block rounded-full border ${currentAccent.border} px-4 py-1 text-sm font-semibold ${currentAccent.text} font-raleway bg-white/50`}
        >
          {planLabel}
        </span>
      </div>

      {/* Price */}
      <div className="text-center mb-2">
        <span className="font-rubik text-5xl font-bold text-slate-900">
          {price}
        </span>
        <span className="font-raleway text-slate-500 text-lg">/ year</span>
      </div>

      {/* Description */}
      <p className="font-raleway text-slate-600 text-center mb-8 h-10">
        {description}
      </p>

      {/* Benefits */}
      <ul className="space-y-3 font-raleway text-slate-700 flex-grow mb-8">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2
              className={`h-5 w-5 flex-shrink-0 mt-0.5 ${currentAccent.text}`}
            />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button className={buttonClasses}>
        {buttonIcon}
        <span>Get Started</span>
      </button>

      {/* Highlight note */}
      {isHighlighted && (
        <div className="text-center mt-4">
          <span className="font-raleway text-xs text-slate-500">
            The Ultimate Value Package
          </span>
        </div>
      )}
    </div>
  );
};

export default MembershipCard;
