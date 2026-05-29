"use client";

import React, { useEffect, useRef } from "react";

const Grid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (gridRef.current) {
        // Calculate mouse position relative to the grid container
        // This ensures the FX stays under the mouse even when scrolling
        const rect = gridRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        requestAnimationFrame(() => {
          gridRef.current?.style.setProperty("--mouse-x", `${x}px`);
          gridRef.current?.style.setProperty("--mouse-y", `${y}px`);
        });
      }
    };

    // Attach to window to track mouse even if it leaves the specific grid area
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    /* 
       Changed 'fixed' to 'absolute'. 
       This allows 'overflow-hidden' on the parent to clip the corners.
    */
    <div ref={gridRef} className="interactive-grid absolute inset-0 z-0 pointer-events-none"></div>
  );
};

export default Grid;