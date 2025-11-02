// app/membership/components/membership-card.tsx
"use client";

import { CheckCircle2 } from "lucide-react";
import type { FC, ReactNode } from "react";

type AccentColor = "primary" | "steel" | "sky";

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
  { text: string; border: string; glow: string; bg: string; button: string }
> = {
  primary: {
    text: "text-[#003599]",
    border: "border-blue-300",
    glow: "group-hover:shadow-[inset_0_0_15px_rgba(147,197,253,0.5)]",
    bg: "bg-gradient-to-b from-blue-50 to-blue-300",
    button:
      "bg-[#003599] text-white shadow-lg shadow-blue-500/30 hover:bg-[#004ab3] hover:-translate-y-1",
  },
  steel: {
    text: "text-[#006fa1]",
    border: "border-cyan-300",
    glow: "group-hover:shadow-[inset_0_0_15px_rgba(103,232,249,0.5)]",
    bg: "bg-gradient-to-b from-cyan-50 to-cyan-300",
    button:
      "bg-transparent text-[#006fa1] border border-[#006fa1] hover:bg-[#006fa1]/15 hover:-translate-y-1",
  },
  sky: {
    // --- ADJUSTED --- Darkened the base color one more step for final balance.
    text: "text-[#0073AD]",
    border: "border-sky-300",
    glow: "group-hover:shadow-[inset_0_0_15px_rgba(125,211,252,0.5)]",
    bg: "bg-gradient-to-b from-sky-50 to-sky-300",
    // --- ADJUSTED --- Button colors updated to match the new darker shade.
    button:
      "bg-transparent text-[#0073AD] border border-[#0073AD] hover:bg-[#0073AD]/15 hover:-translate-y-1",
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
  const currentAccent = accentClasses[accentColor];

  const cardClasses = `
    flex flex-col rounded-3xl p-8 h-full border relative group
    transition-all duration-300 ${currentAccent.bg} ${currentAccent.border}
    ${isHighlighted ? "shadow-xl" : "shadow-md"}
  `;

  const buttonClasses = `
    mt-auto w-full rounded-lg py-3 font-rubik font-semibold text-lg flex items-center justify-center gap-2
    transform transition-all duration-300 cursor-pointer ${currentAccent.button}
  `;

  return (
    <div className={cardClasses}>
      {/* Icon */}
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
          className={`inline-block rounded-full border ${currentAccent.border} px-4 py-1 text-sm font-semibold ${currentAccent.text} font-raleway bg-white/60`}
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
      <p className="font-raleway text-[#373d47] text-center mb-8 h-10">
        {description}
      </p>

      {/* Benefits */}
      <ul className="space-y-3 font-raleway text-[#373d47] flex-grow mb-8">
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