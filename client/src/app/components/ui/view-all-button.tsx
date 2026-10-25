"use client";

import type { FC } from "react";
import { ChevronRight } from "lucide-react";
import Button from "./button";

interface ViewAllButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export const ViewAllButton: FC<ViewAllButtonProps> = ({ label, onClick, className = "" }) => (
  <Button variant="outlinePill" onClick={onClick} className={`w-55 sm:w-auto ${className}`}>
    <span>{label}</span>
    <ChevronRight className="h-4 w-4" />
  </Button>
);

export default ViewAllButton;
