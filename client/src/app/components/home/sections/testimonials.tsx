"use client";

import CarouselArrows from "@/app/components/ui/carousel-arrows";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { TestimonialCard } from "@/app/components/home/testimonial-card";
import testimonialService from "@/app/services/testimonial";
import { toTitleCase } from "@/app/utils/officers/format-name";
import { Skeleton, SkeletonGate } from "@/app/components/feedback/skeleton";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<{ name: string; title: string; imageSrc: string; testimonial: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialService.getTestimonials();
        if (response.success && Array.isArray(response.data)) {
          const mapped = response.data.map((item) => ({
            name: toTitleCase(item.name),
            title: item.role,
            imageSrc: item.image ?? "",
            testimonial: item.quote,
          }));
          setTestimonials(mapped);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleNext = () => {
    const newIndex = Math.min(currentIndex + 1, testimonials.length - 1);
    setCurrentIndex(newIndex);
  };

  const handlePrev = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollLeft = currentIndex * scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [currentIndex, loading]);

  return (
    <section className="dark-light-background relative min-h-screen overflow-visible z-2">
      <div className="absolute inset-0 z-0 opacity-90 hidden lg:block">
        <div className="blob bg-sky-400 top-0 left-0 animate-blob-1"></div>
        <div className="blob bg-indigo-400 top-0 right-0 animate-blob-2"></div>
        <div className="blob bg-blue-300 bottom-0 left-1/4 animate-blob-3"></div>
      </div>

      <div className="absolute inset-0 z-0 opacity-60 lg:hidden">
        <div className="blob bg-sky-400 top-[5%] right-[-20%] animate-blob-1"></div>
        <div className="blob bg-indigo-400 bottom-[5%] left-[-20%] animate-blob-3"></div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center lg:overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative z-20 mb-16 sm:mb-24 text-center">
          <h2 className="font-rubik text-4xl font-bold text-primary3 sm:text-5xl leading-tight">
            Testimonials
          </h2>
          <p className="font-raleway mt-2 text-base text-bodytext sm:text-lg max-w-lg mx-auto">
            Sync with the experiences that define ICpEP SE.
          </p>
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          {loading ? (
            <SkeletonGate loading>
              <Skeleton className="relative z-20 h-105 w-full max-w-2xl rounded-3xl" />
            </SkeletonGate>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-raleway text-lg">
                No testimonials available.
              </p>
            </div>
          ) : (
            <>
              <div
                ref={scrollContainerRef}
                className="lg:hidden z-20 w-full h-112.5 flex overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth"
                style={
                  {
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  } as React.CSSProperties
                }
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="w-full shrink-0 snap-center flex justify-center pt-16 px-4 pb-4"
                  >
                    <div className="w-full max-w-md h-[90%]">
                      <TestimonialCard {...testimonial} position={0} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative z-20 h-105 w-full max-w-7xl overflow-visible hidden lg:block">
                {testimonials.map((testimonial, index) => {
                  const position = index - currentIndex;
                  let animateProps = {
                    x: "0%",
                    scale: 0.7,
                    opacity: 0,
                    zIndex: 0,
                  };
                  if (position === 0) {
                    animateProps = { x: "0%", scale: 1, opacity: 1, zIndex: 3 };
                  } else if (position === 1) {
                    animateProps = {
                      x: "40%",
                      scale: 0.85,
                      opacity: 0.7,
                      zIndex: 2,
                    };
                  } else if (position === -1) {
                    animateProps = {
                      x: "-40%",
                      scale: 0.85,
                      opacity: 0.7,
                      zIndex: 2,
                    };
                  } else {
                    animateProps = {
                      x: `${position > 0 ? 100 : -100}%`,
                      scale: 0.7,
                      opacity: 0,
                      zIndex: 1,
                    };
                  }

                  return (
                    <motion.div
                      key={index}
                      className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                      initial={false}
                      animate={animateProps}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                      }}
                    >
                      <div className="w-full max-w-2xl h-[90%]">
                        <TestimonialCard {...testimonial} position={position} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <CarouselArrows
          className="relative z-30 mt-8"
          label="testimonial"
          onPrev={handlePrev}
          onNext={handleNext}
          prevDisabled={loading || currentIndex === 0}
          nextDisabled={loading || testimonials.length === 0 || currentIndex === testimonials.length - 1}
        />
      </div>
    </section>
  );
}
