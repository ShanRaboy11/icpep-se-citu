import type { Metadata } from "next";
import { pageMetadata } from "../utils/site";

export const metadata: Metadata = pageMetadata(
  "Events",
  "Upcoming and past ICpEP.SE CIT-U Chapter events — workshops, seminars, and activities open to computer engineering students.",
  "/events",
);

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
