import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commeet",
  robots: { index: false },
};

export default function CommeetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
