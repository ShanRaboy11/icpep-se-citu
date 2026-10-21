"use client";

import type { FC } from "react";
import { ChevronRight } from "lucide-react";

interface ViewAllButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export const ViewAllButton: FC<ViewAllButtonProps> = ({ label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex w-55 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-primary1 px-6 py-2 font-raleway text-xs font-semibold text-primary1 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary1 hover:text-white active:scale-95 sm:w-auto ${className}`}
  >
    <span>{label}</span>
    <ChevronRight className="h-4 w-4" />
  </button>
);

export default ViewAllButton;
