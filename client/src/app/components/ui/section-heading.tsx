import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  as?: "h2" | "h3" | "h4";
  size?: "md" | "lg";
  className?: string;
}

const SIZES = {
  md: "text-lg sm:text-xl",
  lg: "text-xl sm:text-2xl",
};

export default function SectionHeading({ children, as: Tag = "h2", size = "lg", className = "" }: SectionHeadingProps) {
  return (
    <Tag className={`flex items-center gap-3 font-rubik font-bold text-primary3 ${SIZES[size]} ${className}`}>
      <span className="h-6 w-1.5 shrink-0 rounded-full bg-primary1" />
      {children}
    </Tag>
  );
}
