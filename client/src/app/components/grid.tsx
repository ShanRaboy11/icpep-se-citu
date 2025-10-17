"use client";

import React, { useEffect, useRef } from 'react';

const Grid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (gridRef.current) {
        // We use requestAnimationFrame for a smoother, more performant animation
        requestAnimationFrame(() => {
          // Set CSS custom properties (--mouse-x and --mouse-y) to the cursor's position
          gridRef.current?.style.setProperty('--mouse-x', `${event.clientX}px`);
          gridRef.current?.style.setProperty('--mouse-y', `${event.clientY}px`);
        });
      }
    };

    // Add the event listener to the window
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div ref={gridRef} className="interactive-grid fixed inset-0 z-0"></div>
  );
};

export default Grid;