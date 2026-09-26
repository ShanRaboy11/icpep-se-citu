'use client';

import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "primary2"
    | "primary3"
    | "secondary2"
    | "hero"
    | "heroOutline"
    | "heroDanger"
    | "heroWarning"
    | "danger"
    | "confirm"
    | "cancel";
  size?: "sm" | "md" | "lg";
  // Only affects the "hero"/"heroOutline" pill variants: "full" keeps the
  // fully-rounded pill shape (default, matches existing usage everywhere),
  // "lg" swaps in a slightly-rounded rectangle so the same CTA style can be
  // reused on surfaces where a full pill doesn't fit.
  rounded?: "full" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  rounded = "full",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "font-raleway font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed disabled:active:scale-100";

  const variantStyles = {
    primary: "rounded-[10px] bg-buttonbg1 border border-primary1 px-4 py-2 text-primary1 font-manrope hover:bg-primary1 hover:text-white focus-visible:ring-primary1",
    secondary: "bg-lavender rounded-lg text-primary1 px-4 py-2 hover:bg-primary2 hover:text-white focus-visible:ring-primary1",
    outline:
      "rounded-[10px] border border-2 border-primary1 text-primary1 hover:bg-primary1 hover:text-white focus-visible:ring-primary1",
    primary2: "bg-primary1 text-white font-medium text-sm sm:text-base px-8 py-2.5 rounded-2xl border border-transparent hover:bg-white hover:text-primary1 hover:border-primary1",
    primary3: "bg-primary1 text-white font-medium text-sm sm:text-base px-8 py-2.5 rounded-2xl border border-transparent hover:bg-(--primary3) hover:text-white hover:border-primary3",
    secondary2: "bg-lavender border border-primary1 rounded-lg text-primary1 px-4 py-2 hover:bg-primary3 hover:text-white focus-visible:ring-primary1",
    // Solid CTA, matches the home hero "Join Community" button (pill by default)
    hero: `bg-primary1 hover:bg-primary2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none text-white font-raleway font-semibold px-5 py-2 text-sm sm:px-8 sm:py-3 sm:text-base ${rounded === "lg" ? "rounded-2xl" : "rounded-full"} shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer`,
    // Outline CTA, matches the home hero "Learn More" button (pill by default)
    heroOutline: `bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-buttonbg1 hover:border-primary1 hover:text-primary1 font-raleway font-semibold px-5 py-2 text-sm sm:px-8 sm:py-3 sm:text-base ${rounded === "lg" ? "rounded-2xl" : "rounded-full"} transition-all duration-300 cursor-pointer`,
    // Same CTA pill family as "hero", but red — for a destructive action that
    // still needs to sit visually consistent next to hero/heroOutline buttons
    heroDanger: `bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none text-white font-raleway font-semibold px-5 py-2 text-sm sm:px-8 sm:py-3 sm:text-base ${rounded === "lg" ? "rounded-2xl" : "rounded-full"} shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer`,
    // Same CTA pill family as "hero", but amber — for a cautionary action
    // (e.g. deactivating an account) that isn't destructive enough for red
    heroWarning: `bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none text-white font-raleway font-semibold px-5 py-2 text-sm sm:px-8 sm:py-3 sm:text-base ${rounded === "lg" ? "rounded-2xl" : "rounded-full"} shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer`,
    // Destructive action (e.g. "Delete", "Yes, Delete")
    danger: "bg-red-500 hover:bg-red-600 text-white font-rubik font-semibold rounded-xl shadow-lg shadow-red-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
    // Positive confirm/save action within compact editing UIs
    confirm: "bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 disabled:shadow-gray-200 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-white font-rubik font-bold rounded-xl shadow-md shadow-sky-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
    // Neutral "Cancel" action
    cancel: "bg-white border border-gray-200 text-gray-600 font-rubik font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 cursor-pointer",
};

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[variant], className),
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;


/*<Button> Default </Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline" size="lg">
  Outline Large
</Button>*/
