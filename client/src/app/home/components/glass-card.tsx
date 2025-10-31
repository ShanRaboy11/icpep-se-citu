"use client";

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
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
          className="absolute inset-[2px] rounded-[22px]"
          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
        />
      </div>

      <div
        className="relative z-10 rounded-[22px] p-6 sm:p-8 h-full flex flex-col"
        style={{ backgroundColor: "#e6f7ff" }}
      >
        {children}
      </div>
    </div>
  );
}
