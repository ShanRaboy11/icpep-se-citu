// In a new file, e.g., app/components/interactive-aurora-background.tsx

"use client";

import React, { useRef, useEffect } from "react";

export default function InteractiveAuroraBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      container.style.setProperty("--mouse-x", `${x}px`);
      container.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden">
      {/* This div creates the interactive spotlight that follows the mouse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(0,167,238,0.15)_0%,transparent_30%)] transition-all duration-300 ease-out" />

      {/* These are the slow, autonomously moving blobs */}
      <div className="absolute top-0 left-0 h-[30rem] w-[30rem] rounded-full bg-blue-500/30 opacity-30 filter blur-3xl animate-blobby-1" />
      <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-sky-400/30 opacity-30 filter blur-3xl animate-blobby-2" />
    </div>
  );
}
