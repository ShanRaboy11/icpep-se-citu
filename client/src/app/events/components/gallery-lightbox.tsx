"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryLightboxProps {
  imageUrls: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function GalleryLightbox({
  imageUrls,
  index,
  onClose,
  onIndexChange,
}: GalleryLightboxProps) {
  const total = imageUrls.length;

  const goPrev = useCallback(
    () => onIndexChange((index - 1 + total) % total),
    [index, total, onIndexChange],
  );
  const goNext = useCallback(
    () => onIndexChange((index + 1) % total),
    [index, total, onIndexChange],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  if (total === 0) return null;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <button
        onClick={onClose}
        aria-label="Close"
        className="group absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 cursor-pointer active:scale-90"
      >
        <X className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:rotate-90" />
      </button>

      <div className="absolute top-4 left-4 z-10 rounded-full bg-white/10 px-4 py-2 font-raleway text-sm font-semibold text-white">
        {index + 1} / {total}
      </div>

      {total > 1 && (
        <button
          onClick={goPrev}
          aria-label="Previous photo"
          className="absolute left-2 sm:left-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 cursor-pointer active:scale-90"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      <div
        className="relative z-0 flex h-full w-full items-center justify-center px-4 py-16 sm:px-20"
        onClick={onClose}
      >
        <Image
          src={imageUrls[index]}
          alt={`Event photo ${index + 1}`}
          fill
          sizes="100vw"
          onClick={(e) => e.stopPropagation()}
          className="rounded-lg object-contain shadow-2xl"
        />
      </div>

      {total > 1 && (
        <button
          onClick={goNext}
          aria-label="Next photo"
          className="absolute right-2 sm:right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-white/20 cursor-pointer active:scale-90"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 overflow-x-auto px-4 py-1 max-w-full">
          {imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => onIndexChange(i)}
              className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                i === index
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={url}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="3rem"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
