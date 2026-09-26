"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "./loading";

// Shows the entrance animation once, on the very first load of a session,
// then gets out of the way. Split out of the root layout so that layout can
// stay a server component (metadata export, no client JS on the initial
// response).
export default function FirstVisitLoader() {
  const [showFirstVisit, setShowFirstVisit] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowFirstVisit(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!showFirstVisit) return null;
  return <LoadingScreen showEntrance={true} />;
}
