"use client";

import type { MouseEvent, ReactNode } from "react";

interface TextButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  tone?: "danger" | "link";
  disabled?: boolean;
  className?: string;
}

const TONES = {
  danger: "text-gray-500 hover:text-red-500",
  link: "text-primary1",
};

export default function TextButton({ onClick, children, tone = "danger", disabled, className = "" }: TextButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer font-raleway text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50 ${TONES[tone]} ${className}`}
    >
      {children}
    </button>
  );
}
