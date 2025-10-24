"use client";

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    // main container is now `relative` and `overflow-hidden` ---
    <div
      className={`relative overflow-hidden rounded-3xl p-8 shadow-2xl ${className}`}
    >
      {/* the Animated Glowing Border --- */}
      {/* This pseudo-element is a large, rotating gradient positioned behind the content */}
      <div
        className="absolute inset-0 z-0 animate-[rotate-border_8s_linear_infinite]
                   bg-[conic-gradient(from_90deg_at_50%_50%,#00a7ee_0%,#45c7ff_50%,#00a7ee_100%)]
                   opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* The Glass Background Layer */}
      {/* It's inset slightly to let the glowing border show around the edges */}
      <div className="absolute inset-px rounded-[22px] bg-primary1/10 backdrop-blur-lg"></div>

      {/* The Content Layer (on top of everything) */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
