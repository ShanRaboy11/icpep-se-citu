import type { Metadata } from "next";
import { pageMetadata } from "../utils/site";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Get in touch with ICpEP.SE CIT-U Chapter for questions about membership, events, or the organization.",
  "/contact",
);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
