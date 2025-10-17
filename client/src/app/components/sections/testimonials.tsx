"use client";

import { useEffect, useRef } from "react";
import TestimonialCard from "@/app/components/cards/testimonialcard";

export function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const testimonials = [
    {
      name: "Alyssa Cruz",
      title: "President, ICpEP.SE",
      imageSrc: "/faculty.png",
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
      imageSrc: "/faculty.png",
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

  const extendedTestimonials = [
    testimonials[testimonials.length - 1],
    ...testimonials,
    testimonials[0],
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = container.querySelectorAll(".testimonial-card");
      const center = container.scrollLeft + container.clientWidth / 2;

      cards.forEach((card: Element) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const distance = Math.abs(center - (rect.left + rect.width / 2));
        const maxDistance = container.clientWidth / 2;
        const scale = Math.max(0.8, 1.1 - distance / maxDistance);
        (card as HTMLElement).style.transform = `scale(${scale})`;
        (card as HTMLElement).style.zIndex = String(scale > 1.0 ? 10 : 1);
      });
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative w-full flex flex-col items-center py-8 sm:py-12 md:py-16 lg:py-20 overflow-visible mb-10 sm:mb-15"
      style={{ backgroundColor: "#FEFEFF" }}
    >
      <div className="absolute inset-0 z-0 opacity-90">
        <div className="orbit animate-blob-1">
          <div className="blob bg-sky-400"></div>
        </div>
        <div className="orbit animate-blob-2">
          <div className="blob bg-indigo-400"></div>
        </div>
        <div className="orbit animate-blob-2">
          <div className="blob bg-blue-300"></div>
        </div>
      </div>

      <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-15 px-4 sm:px-6 md:px-8 relative z-10">
        <h2 className="font-rubik text-3xl sm:text-5xl font-extrabold mb-3 sm:mb-4 tracking-tight text-black">
          TESTIMONIALS
        </h2>
        <p className="font-raleway text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mt-3 sm:mt-4 md:mt-5">
          Discover how ICpEP.SE has impacted students through their stories and
          feedback.
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex gap-4 h-130 sm:gap-6 md:gap-8 items-center overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 sm:px-6 md:px-10 lg:px-20 pb-6 sm:pb-8 hide-scrollbar relative z-10 w-full"
        style={{
          scrollbarWidth: "none",
          minHeight: "clamp(300px, 40vh, 500px)",
        }}
      >
        {extendedTestimonials.map((t, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-center w-[95%] sm:w-[75%] md:w-[60%] lg:w-[45%] xl:w-[33%] flex justify-center items-center"
          >
            <div className="testimonial-card transition-transform duration-300 ease-in-out origin-center w-full">
              <TestimonialCard
                name={t.name}
                title={t.title}
                imageSrc={t.imageSrc}
                testimonial={t.testimonial}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .blob {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.7;
          mix-blend-mode: multiply;
        }

        .orbit {
          position: absolute;
          top: 40%;
          left: 40%;
          transform-origin: center;
        }

        @keyframes orbit-1 {
          0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }

        @keyframes orbit-2 {
          0% { transform: rotate(0deg) translateX(180px) rotate(0deg); }
          100% { transform: rotate(-360deg) translateX(180px) rotate(360deg); }
        }

        .animate-blob-1 { animation: orbit-1 8s linear infinite; }
        .animate-blob-2 { animation: orbit-2 8s linear infinite; }
      `}</style>
    </div>
  );
}
