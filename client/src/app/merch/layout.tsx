import type { Metadata } from "next";
import { pageMetadata } from "../utils/site";

export const metadata: Metadata = pageMetadata(
  "Merch",
  "Official ICpEP.SE CIT-U Chapter merchandise.",
  "/merch",
);

export default function MerchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
