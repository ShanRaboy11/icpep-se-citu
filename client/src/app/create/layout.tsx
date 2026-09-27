import type { Metadata } from "next";
import RequireOfficer from "../components/require-officer";

export const metadata: Metadata = {
  title: "Content Management",
  robots: { index: false },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireOfficer>{children}</RequireOfficer>;
}
