"use client";

import { Trash2, X } from "lucide-react";

interface RemoveButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  variant?: "inline" | "overlay" | "icon";
  disabled?: boolean;
  title?: string;
  className?: string;
}

const STYLES = {
  inline:
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2 font-raleway text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500",
  overlay:
    "inline-flex items-center justify-center gap-1.5 rounded-full bg-white/95 px-4 py-2 font-raleway text-xs font-semibold text-red-500 shadow-lg hover:bg-red-50",
  icon: "inline-flex shrink-0 items-center justify-center rounded-full border-2 border-gray-200 px-3 py-2 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500",
};

export default function RemoveButton({
  onClick,
  label = "Remove",
  variant = "inline",
  disabled = false,
  title,
  className = "",
}: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title ?? label}
      aria-label={label}
      className={`cursor-pointer transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${STYLES[variant]} ${className}`}
    >
      {variant === "icon" ? (
        <X size={12} />
      ) : (
        <>
          <Trash2 size={variant === "overlay" ? 14 : 16} /> {label}
        </>
      )}
    </button>
  );
}
