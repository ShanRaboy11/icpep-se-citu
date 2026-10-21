"use client";

import type { FC, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Button from "@/app/components/button";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
  actionLabel?: string;
}

export const QuickActionCard: FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  onClick,
  actionLabel = "Open",
}) => (
  <div
    onClick={onClick}
    className="group flex h-full w-full cursor-pointer flex-col rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50 hover:shadow-md"
  >
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100/80 text-[#0073AD] transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="font-rubik text-base font-bold leading-snug text-primary3">{title}</h4>
        <p className="mt-1 font-raleway text-sm leading-relaxed text-gray-500">{description}</p>
      </div>
    </div>

    <Button variant="hero" className="mt-auto w-full px-4 py-2.5 text-sm sm:px-4 sm:py-2.5">
      <span className="inline-flex items-center justify-center gap-1.5">
        {actionLabel}
        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Button>
  </div>
);

export default QuickActionCard;
