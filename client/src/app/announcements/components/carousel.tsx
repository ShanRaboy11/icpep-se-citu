"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  imageUrls: string[];
}

export default function CarouselGallery({ imageUrls }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      delay: 5000,
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
    <div className="relative group bg-white rounded-2xl shadow-md overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {imageUrls.map((url, index) => (
            <div className="embla__slide" key={index}>
              <img
                src={url}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-64 sm:h-96 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        aria-label="Previous image"
        disabled={!emblaApi}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 text-primary3 rounded-full p-2 
                   transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary2 cursor-pointer"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next image"
        disabled={!emblaApi}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 text-primary3 rounded-full p-2 
                   transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary2 cursor-pointer"
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
