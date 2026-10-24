import type { ReactNode } from "react";

export default function GradientCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-linear-to-br from-primary1 to-primary3 shadow-md ${className}`}>{children}</div>
  );
}
