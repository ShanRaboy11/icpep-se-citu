"use client";

import type { DragEvent } from "react";
import { Upload } from "lucide-react";
import RemoveButton from "./remove-button";
import { swapToFallback } from "./fallback-image";

interface ImageUploadFieldProps {
  preview: string | null;
  alt: string;
  title: string;
  hint: string;
  isDragging: boolean;
  invalid?: boolean;
  fit?: "cover" | "contain";
  onBrowse: () => void;
  onRemove: () => void;
  onDragChange: (dragging: boolean) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

export default function ImageUploadField({
  preview,
  alt,
  title,
  hint,
  isDragging,
  invalid = false,
  fit = "cover",
  onBrowse,
  onRemove,
  onDragChange,
  onDrop,
}: ImageUploadFieldProps) {
  if (preview) {
    return (
      <div className="relative group h-56 overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-50">
        <img
          src={preview}
          onError={swapToFallback}
          alt={alt}
          className={`h-full w-full ${fit === "contain" ? "object-contain p-6" : "object-cover"}`}
        />
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
          <button
            type="button"
            onClick={onBrowse}
            className="cursor-pointer rounded-full bg-white px-4 py-2 font-rubik text-xs font-bold text-primary3 shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            Replace
          </button>
          <RemoveButton variant="overlay" onClick={onRemove} />
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onBrowse}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onBrowse();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragChange(true);
      }}
      onDragLeave={() => onDragChange(false)}
      onDrop={onDrop}
      className={`flex h-56 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
        isDragging
          ? "scale-[1.01] border-primary2 bg-primary2/5"
          : invalid
            ? "border-red-300 bg-red-50/50"
            : "border-gray-200 bg-gray-50/80 hover:border-primary2/60 hover:bg-primary2/3"
      }`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
          isDragging ? "bg-primary2 text-white" : "bg-white text-primary2 shadow-md"
        }`}
      >
        <Upload size={22} strokeWidth={2.5} />
      </div>
      <div className="text-center">
        <p className="font-rubik text-sm font-bold text-gray-700">{isDragging ? "Drop it!" : title}</p>
        <p className="mt-1 font-raleway text-xs text-gray-400">{hint}</p>
      </div>
    </div>
  );
}
