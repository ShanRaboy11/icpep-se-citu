"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  label: string;
  className?: string;
}

const ARROW =
  "flex h-14 w-14 items-center justify-center rounded-full border border-primary1/40 bg-white/80 backdrop-blur-sm text-primary1 transition-all duration-300 hover:bg-primary1/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer";

export default function CarouselArrows({
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  label,
  className = "",
}: CarouselArrowsProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      <button onClick={onPrev} disabled={prevDisabled} aria-label={`Previous ${label}`} className={ARROW}>
        <ChevronLeft size={24} />
      </button>
      <button onClick={onNext} disabled={nextDisabled} aria-label={`Next ${label}`} className={ARROW}>
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
