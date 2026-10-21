"use client";

import { LoadingScreen } from "./components/loading";
import { useDelayedFlag } from "./components/skeleton";

export default function Loading() {
  const slow = useDelayedFlag(true, 350);
  return slow ? <LoadingScreen /> : null;
}
