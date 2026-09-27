"use client";

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "compact" | "roomy";
}

const VARIANTS = {
  compact: { padding: "sm:p-2", background: "#fbfeffff" },
  roomy: { padding: "p-6 sm:p-8", background: "#e6f7ff" },
};

export function GlassCard({
  children,
  className = "",
  variant = "compact",
}: GlassCardProps) {
  const { padding, background } = VARIANTS[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-[0_0_25px_rgba(0,119,170,0.25)] h-full ${className}`}
      style={{ padding: "3px" }}
    >
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background:
              "linear-gradient(90deg, #00a7ee, #45c7ff, #2dd4bf, #00a7ee)",
            backgroundSize: "200% 200%",
            animation: "move-border 3s linear infinite",
          }}
        />
        <div
          className="absolute inset-0.5 rounded-[22px]"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        />
      </div>

      <div
        className={`relative z-10 rounded-[22px] ${padding} h-full flex flex-col`}
        style={{ backgroundColor: background }}
      >
        {children}
      </div>
    </div>
  );
}
