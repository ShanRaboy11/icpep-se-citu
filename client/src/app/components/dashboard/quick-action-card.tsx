"use client";

import type { FC, ReactNode } from "react";
import ViewAllButton from "@/app/components/ui/view-all-button";

interface QuickActionCardProps {
  title: string;
  description: string;
  badge?: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
  actionLabel?: string;
}

export const QuickActionCard: FC<QuickActionCardProps> = ({
  title,
  description,
  badge,
  icon,
  onClick,
  actionLabel = "Open",
}) => (
  <div className="group flex h-full w-full flex-col gap-4 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:gap-5">
    <div className="flex min-w-0 items-start gap-3 sm:items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-primary3 transition-colors duration-300 group-hover:border-blue-200 group-hover:bg-white">
        {icon}
      </div>
      <div className="min-w-0 font-raleway">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-rubik text-base font-bold leading-snug text-primary3">{title}</h4>
          {badge}
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-gray-500">{description}</p>
      </div>
    </div>

    <ViewAllButton label={actionLabel} onClick={onClick ?? (() => undefined)} className="w-full shrink-0 sm:w-auto" />
  </div>
);

export default QuickActionCard;
