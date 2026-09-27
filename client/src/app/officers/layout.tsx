import type { Metadata } from "next";
import { pageMetadata } from "../utils/site";

export const metadata: Metadata = pageMetadata(
  "Officers",
  "Meet the council and committee officers of ICpEP.SE CIT-U Chapter, by academic year.",
  "/officers",
);

export default function OfficersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
