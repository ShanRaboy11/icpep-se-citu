"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  imageUrls: string[];
  className?: string;
}

export default function CarouselGallery({ imageUrls }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnFocusIn: true,
    }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    // --- the container is now transparent. The `group` is on the parent. ---
    <div className="group relative h-full w-full overflow-hidden rounded-2xl">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container h-full">
          {imageUrls.map((url, index) => (
            <div className="embla__slide" key={index}>
              <img
                src={url}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - now hidden until the parent card is hovered */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 text-primary3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-2 text-primary3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 cursor-pointer"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {imageUrls.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-all cursor-pointer duration-300 ${
              index === selectedIndex ? "w-6 bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
