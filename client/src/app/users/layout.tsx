import type { Metadata } from "next";
import RequireOfficer from "../components/require-officer";

export const metadata: Metadata = {
  title: "User Management",
  robots: { index: false },
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireOfficer>{children}</RequireOfficer>;
}
