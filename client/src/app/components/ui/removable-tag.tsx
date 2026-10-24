"use client";

import { Tag, X } from "lucide-react";

interface RemovableTagProps {
  label: string;
  detail?: string;
  title?: string;
  removeLabel?: string;
  icon?: boolean;
  onRemove: () => void;
}

export default function RemovableTag({ label, detail, title, removeLabel = "Remove", icon = true, onRemove }: RemovableTagProps) {
  return (
    <span
      title={title}
      className="flex items-center gap-2 rounded-full border border-primary1/20 bg-primary1/10 py-1.5 pl-3 pr-2 font-raleway text-xs font-semibold text-primary1"
    >
      {icon && <Tag size={11} />}
      {label}
      {detail && <span className="font-normal text-gray-500">{detail}</span>}
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-red-100 hover:text-red-500"
      >
        <X size={11} />
      </button>
    </span>
  );
}
