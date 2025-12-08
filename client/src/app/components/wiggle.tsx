"use client";
import { useState, useRef } from "react";

export default function WiggleWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wiggle, setWiggle] = useState(false);
  const lastTap = useRef<number>(0);

  const handleDoubleClick = () => {
    setWiggle((prev) => !prev);
  };

  const handleTouchEnd = () => {
    const now = Date.now();
    const delay = 300;

    if (now - lastTap.current < delay) {
      setWiggle((prev) => !prev);
    }

    lastTap.current = now;
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}
      className={wiggle ? "wiggle" : ""}
    >
      {children}
    </div>
  );
}
