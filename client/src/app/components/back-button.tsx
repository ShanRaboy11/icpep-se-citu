"use client";

import { ChevronLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  title?: string;
  icon?: LucideIcon;
  className?: string;
}

export default function BackButton({
  onClick,
  title = "Go Back",
  icon: Icon = ChevronLeft,
  className = "",
}: BackButtonProps) {
  const isChevronLeft = Icon === ChevronLeft;

  return (
    <button
      onClick={onClick}
      title={title}
      className={`relative flex h-12 w-12 cursor-pointer items-center justify-center
        rounded-full border-2 border-primary1 text-primary1
        overflow-hidden transition-all duration-300 ease-in-out
        active:scale-95 focus:outline-none focus-visible:ring-2
        focus-visible:ring-primary1 focus-visible:ring-offset-2
        before:absolute before:inset-0
        before:bg-linear-to-r before:from-transparent
        before:via-white/40 before:to-transparent
        before:-translate-x-full hover:before:translate-x-full
        before:transition-transform before:duration-700 ${className}`}
    >
      <Icon
        className={`h-6 w-6 ${isChevronLeft ? "animate-nudge-left translate-x-0.5" : ""}`}
      />
    </button>
  );
}
