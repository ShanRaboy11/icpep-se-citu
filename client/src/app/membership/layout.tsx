import type { Metadata } from "next";
import { pageMetadata } from "../utils/site";

export const metadata: Metadata = pageMetadata(
  "Membership",
  "Join ICpEP.SE CIT-U Chapter — membership tiers, benefits, and how to become a member.",
  "/membership",
);

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
