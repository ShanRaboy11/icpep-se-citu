"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TestimonialCard } from "@/app/home/components/testimonial-card";
import testimonialService from "@/app/services/testimonial";

// Shimmer animation style
const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -800px 0; }
    100% { background-position: 800px 0; }
  }
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 0px,
      rgba(255,255,255,0.10) 40px,
      rgba(255,255,255,0.04) 80px
    );
    background-size: 800px 100%;
    animation: shimmer 1.6s infinite linear;
  }
`;

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton-shimmer rounded-lg bg-white/5 ${className}`} />
  );
}

// Mirrors TestimonialCard layout: avatar top-center, quote body, name + title at bottom
function TestimonialCardSkeleton({
  scale = 1,
  opacity = 1,
}: {
  scale?: number;
  opacity?: number;
}) {
  return (
    <div
      className="w-full h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col items-center justify-between p-8 gap-6"
      style={{
        transform: `scale(${scale})`,
        opacity,
        transition: "transform 0.3s, opacity 0.3s",
      }}
    >
      {/* Quote icon placeholder */}
      <SkeletonBlock className="w-8 h-8 rounded-md self-start" />

      {/* Quote lines */}
      <div className="flex flex-col gap-3 w-full flex-1 justify-center">
        <SkeletonBlock className="w-full h-4 rounded-md" />
        <SkeletonBlock className="w-full h-4 rounded-md" />
        <SkeletonBlock className="w-4/5 h-4 rounded-md" />
        <SkeletonBlock className="w-3/5 h-4 rounded-md" />
      </div>

      {/* Avatar + name + title */}
      <div className="flex items-center gap-4 w-full mt-2 pt-4 border-t border-white/10">
        <SkeletonBlock className="w-14 h-14 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonBlock className="w-32 h-4 rounded-md" />
          <SkeletonBlock className="w-24 h-3 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function TestimonialsSkeleton() {
  return (
    <section className="dark-light-background relative min-h-screen overflow-visible z-[2]">
      <style>{shimmerStyle}</style>

      {/* Blobs — keep them so layout feels consistent */}
      <div className="absolute inset-0 z-0 opacity-90 hidden lg:block">
        <div className="blob bg-sky-400 top-0 left-0 animate-blob-1"></div>
        <div className="blob bg-indigo-400 top-0 right-0 animate-blob-2"></div>
        <div className="blob bg-blue-300 bottom-0 left-1/4 animate-blob-3"></div>
      </div>
      <div className="absolute inset-0 z-0 opacity-60 lg:hidden">
        <div className="blob bg-sky-400 top-[5%] right-[-20%] animate-blob-1"></div>
        <div className="blob bg-indigo-400 bottom-[5%] left-[-20%] animate-blob-3"></div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-20">
        {/* Header skeleton */}
        <div className="relative z-20 mb-16 sm:mb-24 text-center flex flex-col items-center gap-3">
          <SkeletonBlock className="w-48 h-10 rounded-md" />
          <SkeletonBlock className="w-64 h-5 rounded-md" />
        </div>

        {/* Mobile: single card skeleton */}
        <div className="lg:hidden z-20 w-full h-[450px] flex justify-center items-start pt-16 px-4">
          <div className="w-full max-w-md h-[90%]">
            <TestimonialCardSkeleton />
          </div>
        </div>

        {/* Desktop: center card + two side ghost cards */}
        <div className="relative z-20 h-[420px] w-full max-w-7xl overflow-visible hidden lg:flex items-center justify-center">
          {/* Left ghost card */}
          <div
            className="absolute top-0 w-full h-full flex items-center justify-center"
            style={{ transform: "translateX(-40%) scale(0.85)", opacity: 0.4 }}
          >
            <div className="w-full max-w-2xl h-[90%]">
              <TestimonialCardSkeleton />
            </div>
          </div>

          {/* Center card */}
          <div
            className="absolute top-0 w-full h-full flex items-center justify-center"
            style={{ zIndex: 3 }}
          >
            <div className="w-full max-w-2xl h-[90%]">
              <TestimonialCardSkeleton />
            </div>
          </div>

          {/* Right ghost card */}
          <div
            className="absolute top-0 w-full h-full flex items-center justify-center"
            style={{ transform: "translateX(40%) scale(0.85)", opacity: 0.4 }}
          >
            <div className="w-full max-w-2xl h-[90%]">
              <TestimonialCardSkeleton />
            </div>
          </div>
        </div>

        {/* Navigation button skeletons */}
        <div className="relative z-30 mt-8 flex gap-4">
          <SkeletonBlock className="w-14 h-14 rounded-full" />
          <SkeletonBlock className="w-14 h-14 rounded-full" />
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const staticTestimonials = [
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

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialService.getTestimonials();
        if (
          response.success &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const mapped = response.data.map((item: any) => ({
            name: item.name,
            title: item.role,
            imageSrc: item.image || "/placeholder.png",
            testimonial: item.quote,
          }));
          setTestimonials(mapped);
        } else {
          setTestimonials(staticTestimonials);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials, using static data", error);
        setTestimonials(staticTestimonials);
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
  }, [currentIndex]);

  if (loading) {
    return <TestimonialsSkeleton />;
  }

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

        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-raleway text-lg">
              No testimonials available.
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
}
