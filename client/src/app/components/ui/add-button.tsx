"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import Button from "./button";

interface AddButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  dashed?: boolean;
}

export default function AddButton({ onClick, children, className = "", disabled, dashed }: AddButtonProps) {
  return (
    <Button
      type="button"
      variant={dashed ? "heroDashed" : "heroOutline"}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-xs sm:px-4 sm:py-2 sm:text-xs ${className}`}
    >
      <Plus size={12} />
      {children}
    </Button>
  );
}
