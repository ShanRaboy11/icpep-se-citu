"use client";

import type { ReactNode } from "react";

interface PageHeaderProps {
  badge: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  subtitleClassName?: string;
  className?: string;
}

export default function PageHeader({
  badge,
  title,
  subtitle,
  subtitleClassName = "max-w-2xl",
  className = "mb-12 text-center",
}: PageHeaderProps) {
  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
        <span className="font-raleway text-sm font-semibold text-primary1">
          {badge}
        </span>
      </div>

      <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
        {title}
      </h1>

      {subtitle && (
        <p
          className={`font-raleway text-gray-600 text-base sm:text-lg mx-auto ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
