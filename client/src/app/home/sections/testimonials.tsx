"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TestimonialCard } from "@/app/home/components/testimonial-card";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      name: "Alyssa Cruz",
      title: "President, ICpEP.SE",
      imageSrc: "/gle.png",
      testimonial:
        "Being part of ICpEP.SE has helped me build confidence, leadership, and technical skills that go beyond the classroom.",
    },
    {
      name: "Joshua Tan",
      title: "Member",
      imageSrc: "/faculty.png",
      testimonial:
        "Through ICpEP.SE, I met amazing people who share the same passion for innovation and technology.",
    },
    {
      name: "Rina Lopez",
      title: "Event Organizer",
      imageSrc: "/gle.png",
      testimonial:
        "Organizing events under ICpEP.SE allowed me to grow as both a professional and a student leader.",
    },
    {
      name: "Mark Dela Cruz",
      title: "Treasurer",
      imageSrc: "/faculty.png",
      testimonial:
        "ICpEP.SE taught me how collaboration and discipline can build a strong tech community.",
    },
  ];

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
  }, [currentIndex]);

  return (
    <section className="dark-light-background relative min-h-screen overflow-visible z-[2]">
      {/* --- Desktop Blobs --- */}
      <div className="absolute inset-0 z-0 opacity-90 hidden lg:block">
        <div className="blob bg-sky-400 top-0 left-0 animate-blob-1"></div>
        <div className="blob bg-indigo-400 top-0 right-0 animate-blob-2"></div>
        <div className="blob bg-blue-300 bottom-0 left-1/4 animate-blob-3"></div>
      </div>

      {/* --- Mobile-only Blobs --- */}
      <div className="absolute inset-0 z-0 opacity-60 lg:hidden">
        <div className="blob bg-sky-400 top-[5%] right-[-20%] animate-blob-1"></div>
        <div className="blob bg-indigo-400 bottom-[5%] left-[-20%] animate-blob-3"></div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center lg:overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative z-20 mb-16 sm:mb-24 text-center">
          <h1 className="font-rubik text-4xl font-bold text-primary3 sm:text-5xl leading-tight">
            Testimonials
          </h1>
          <p className="font-raleway mt-2 text-base text-bodytext sm:text-lg max-w-lg mx-auto">
            Sync with the experiences that define ICpEP SE.
          </p>
        </div>

        {/* --- Mobile Carousel --- */}
        <div
          ref={scrollContainerRef}
          className="lg:hidden z-20 w-full h-[450px] flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
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
              className="w-full flex-shrink-0 snap-center flex justify-center pt-16 px-4 pb-4"
            >
              <div className="w-full max-w-md h-[90%]">
                <TestimonialCard {...testimonial} position={0} />
              </div>
            </div>
          ))}
        </div>

        {/* --- Desktop Carousel --- */}
        <div className="relative z-20 h-[420px] w-full max-w-7xl overflow-visible hidden lg:block">
          {testimonials.map((testimonial, index) => {
            const position = index - currentIndex;
            let animateProps = { x: "0%", scale: 0.7, opacity: 0, zIndex: 0 };
            if (position === 0) {
              animateProps = { x: "0%", scale: 1, opacity: 1, zIndex: 3 };
            } else if (position === 1) {
              animateProps = { x: "40%", scale: 0.85, opacity: 0.7, zIndex: 2 };
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
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <div className="w-full max-w-2xl h-[90%]">
                  <TestimonialCard {...testimonial} position={position} />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="relative z-30 mt-8 flex gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-primary1/40 bg-white/80 backdrop-blur-sm text-primary1 transition-all duration-300 hover:bg-primary1/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === testimonials.length - 1}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-primary1/40 bg-white/80 backdrop-blur-sm text-primary1 transition-all duration-300 hover:bg-primary1/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
