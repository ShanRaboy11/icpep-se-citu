"use client";

import { LoadingScreen } from "./components/feedback/loading";
import { useDelayedFlag } from "./components/feedback/skeleton";

export default function Loading() {
  const slow = useDelayedFlag(true, 350);
  return slow ? <LoadingScreen /> : null;
}
