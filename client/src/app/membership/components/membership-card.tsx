// app/membership/components/membership-card.tsx
"use client";

import { CheckCircle2 } from "lucide-react";
import type { FC, ReactNode } from "react";

// THE FIX: Replaced 'cyanLight' with a more distinct 'indigo'
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

const accentClasses: Record<
  AccentColor,
  { text: string; border: string; glow: string; bg: string }
> = {
  // New indigo theme
  indigo: {
    text: "text-indigo-400",
    border: "border-indigo-500/60",
    glow: "group-hover:shadow-[inset_0_0_15px_rgba(129,140,248,0.6)]",
    bg: "bg-gradient-to-b from-indigo-950 to-slate-950",
  },
  cyanDark: {
    text: "text-cyan-500",
    border: "border-cyan-600/60",
    glow: "group-hover:shadow-[inset_0_0_15px_rgba(6,182,212,0.6)]",
    bg: "bg-gradient-to-b from-cyan-950 to-slate-950",
  },
  green: {
    text: "text-green-400",
    border: "border-green-500/60",
    glow: "group-hover:shadow-[inset_0_0_15px_rgba(34,197,94,0.6)]",
    bg: "bg-gradient-to-b from-green-950 to-slate-950",
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
  `;

  const buttonClasses = `
    mt-auto w-full rounded-lg py-3 font-rubik font-semibold text-lg flex items-center justify-center gap-2
    transition-all duration-300 border border-slate-700 text-slate-200
    hover:border-slate-500 hover:bg-slate-800/50 cursor-pointer
    ${isHighlighted ? `bg-slate-800` : "bg-slate-900 border-slate-800"}
  `;

  return (
    <div className={cardClasses}>
      <div
        className={`absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full border ${currentAccent.border} bg-slate-900 flex items-center justify-center`}
      >
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center ${currentAccent.text} bg-slate-950 transition-shadow duration-300 ${currentAccent.glow}`}
        >
          {icon}
        </div>
      </div>

      <div className="text-center mt-10 mb-6">
        <span
          className={`inline-block rounded-full border ${currentAccent.border} px-4 py-1 text-sm font-semibold ${currentAccent.text} font-raleway`}
        >
          {planLabel}
        </span>
      </div>

      <div className="text-center mb-2">
        <span className="font-rubik text-5xl font-bold text-slate-100">
          {price}
        </span>
        <span className="font-raleway text-slate-400 text-lg">/ year</span>
      </div>

      <p className="font-raleway text-slate-400 text-center mb-8 h-10">
        {description}
      </p>

      <ul className="space-y-3 font-raleway text-slate-300 flex-grow mb-8">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2
              className={`h-5 w-5 flex-shrink-0 mt-0.5 ${currentAccent.text}`}
            />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <button className={buttonClasses}>
        {buttonIcon}
        <span>Get Started</span>
      </button>

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