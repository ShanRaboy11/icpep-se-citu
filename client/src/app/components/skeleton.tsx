"use client";

import { useEffect, useState } from "react";

export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden style={style} className={`skeleton-block rounded-lg ${className}`} />;
}

export function useDelayedFlag(active: boolean, delay = 450) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [active, delay]);

  return visible;
}

export function SkeletonGate({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  const visible = useDelayedFlag(loading);
  return (
    <div
      style={{ display: "contents" }}
      data-skeleton-hidden={visible ? undefined : ""}
    >
      {children}
    </div>
  );
}
