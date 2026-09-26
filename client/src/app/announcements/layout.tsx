import type { Metadata } from "next";
import { pageMetadata } from "../utils/site";

export const metadata: Metadata = pageMetadata(
  "Announcements",
  "The latest news, meetings, and achievements from ICpEP Student Edition Region 7 CIT-U Chapter.",
  "/announcements",
);

export default function AnnouncementsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
