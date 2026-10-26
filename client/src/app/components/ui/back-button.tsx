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
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-12 w-12 cursor-pointer items-center justify-center
        rounded-full border-[1.5px] border-primary1 bg-transparent text-primary1
        transition-all duration-300 ease-in-out hover:bg-primary1/10
        active:scale-95 focus:outline-none focus-visible:ring-2
        focus-visible:ring-primary1 focus-visible:ring-offset-2 ${className}`}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
