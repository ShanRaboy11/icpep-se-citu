import type { Metadata } from "next";
import { pageMetadata } from "../utils/site";

export const metadata: Metadata = pageMetadata(
  "About",
  "The story of ICpEP.SE CIT-U Chapter — our mission, values, faculty advisers, and the officers who lead the organization.",
  "/about",
);

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
