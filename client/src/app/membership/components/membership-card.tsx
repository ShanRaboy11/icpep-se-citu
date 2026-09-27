"use client";

import { CheckCircle2, User, Globe, Zap, ChevronRight } from "lucide-react";
import type { FC } from "react";

type AccentColor = "primary" | "steel" | "sky";

interface MembershipCardProps {
  planLabel: string;
  title: string;
  price: string;
  description: string;
  benefits: string[];
  isHighlighted?: boolean;
  accentColor: AccentColor;
  isOpen?: boolean;
  registrationUrl?: string;
}

// Each accent color has a fixed icon identity, so admins pick a color
// rather than needing to manage icon assets from the database.
const accentIcon: Record<AccentColor, typeof User> = {
  primary: Zap,
  steel: User,
  sky: Globe,
};

const accentClasses: Record<
  AccentColor,
  { text: string; border: string; glow: string; bg: string; button: string }
> = {
  primary: {
    text: "text-[#003599]",
    border: "border-blue-300",
    glow: "shadow-[inset_0_0_15px_rgba(147,197,253,0.5)] lg:shadow-none lg:group-hover:shadow-[inset_0_0_15px_rgba(147,197,253,0.5)]",
    bg: "bg-linear-to-b from-blue-50 to-blue-300",
    button:
      "bg-[#003599] text-white shadow-lg shadow-blue-500/30 hover:bg-[#004ab3] hover:-translate-y-1 cursor-pointer",
  },
  steel: {
    text: "text-[#006fa1]",
    border: "border-cyan-300",
    glow: "shadow-[inset_0_0_15px_rgba(103,232,249,0.5)] lg:shadow-none lg:group-hover:shadow-[inset_0_0_15px_rgba(103,232,249,0.5)]",
    bg: "bg-linear-to-b from-cyan-50 to-cyan-300",
    button:
      "bg-[#006fa1] text-white shadow-lg shadow-cyan-500/30 lg:shadow-none lg:bg-transparent lg:text-[#006fa1] lg:border lg:border-[#006fa1] hover:-translate-y-1 lg:hover:bg-[#006fa1]/15 cursor-pointer",
  },
  sky: {
    text: "text-[#0073AD]",
    border: "border-sky-300",
    glow: "shadow-[inset_0_0_15px_rgba(125,211,252,0.5)] lg:shadow-none lg:group-hover:shadow-[inset_0_0_15px_rgba(125,211,252,0.5)]",
    bg: "bg-linear-to-b from-sky-50 to-sky-300",
    button:
      "bg-[#0073AD] text-white shadow-lg shadow-sky-500/30 lg:shadow-none lg:bg-transparent lg:text-[#0073AD] lg:border lg:border-[#0073AD] hover:-translate-y-1 lg:hover:bg-[#0073AD]/15 cursor-pointer",
  },
};

const disabledClasses = {
  text: "text-gray-400",
  border: "border-gray-300",
  glow: "",
  bg: "bg-gray-100",
  button: "bg-gray-300 text-gray-500 cursor-not-allowed",
};

const MembershipCard: FC<MembershipCardProps> = ({
  planLabel,
  price,
  description,
  benefits,
  isHighlighted = false,
  accentColor,
  isOpen = true,
  registrationUrl,
}) => {
  const styles = isOpen ? accentClasses[accentColor] : disabledClasses;
  const Icon = accentIcon[accentColor];
  const ButtonIcon = isHighlighted ? Zap : ChevronRight;

  const cardClasses = `
    flex flex-col rounded-3xl p-8 h-full border relative group
    transition-all duration-300 ${styles.bg} ${styles.border}
    ${isHighlighted && isOpen ? "shadow-md lg:shadow-xl" : "shadow-md"}
    ${!isOpen ? "grayscale-[50%]" : ""}
  `;

  const buttonClasses = `
    mt-auto w-full rounded-lg py-3 font-rubik font-semibold text-lg flex items-center justify-center gap-2
    transform transition-all duration-300 ${styles.button}
  `;

  return (
    <div className={cardClasses}>
      <div
        className={`absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full border ${styles.border} bg-white flex items-center justify-center`}
      >
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center ${styles.text} bg-slate-50 transition-shadow duration-300 ${styles.glow}`}
        >
          <Icon size={24} />
        </div>
      </div>

      <div className="text-center mt-10 mb-6">
        <span
          className={`inline-block rounded-full border ${styles.border} px-4 py-1 text-sm font-semibold ${styles.text} font-raleway bg-white/60`}
        >
          {planLabel}
        </span>
      </div>

      {isOpen ? (
        <div className="text-center mb-2 h-17">
          <span className="font-rubik text-5xl font-bold text-slate-900">
            {price}
          </span>
          <span className="font-raleway text-slate-500 text-lg">/ year</span>
        </div>
      ) : (
        <div className="text-center mb-2 h-17 flex items-center justify-center">
          <span className="font-rubik text-xl font-bold text-gray-400">
            Not Available
          </span>
        </div>
      )}

      <p className="font-raleway text-gray-500 text-center mb-8 h-10">
        {description}
      </p>

      <ul className="space-y-3 font-raleway text-gray-600 grow mb-8">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2
              className={`h-5 w-5 shrink-0 mt-0.5 ${styles.text}`}
            />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <button
        className={buttonClasses}
        disabled={!isOpen}
        onClick={() => {
          if (isOpen && registrationUrl) {
            window.open(registrationUrl, "_blank");
          }
        }}
      >
        {isOpen ? (
          <>
            <ButtonIcon size={20} />
            <span>Get Started</span>
          </>
        ) : (
          <>
            <span>Registration Closed</span>
          </>
        )}
      </button>

      {isHighlighted && isOpen && (
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
