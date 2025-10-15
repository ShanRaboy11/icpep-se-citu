"use client";

import { useEffect, useRef } from "react";
import TestimonialCard from "@/app/components/cards/testimonialcard";

export function TestimonialsSection() {
  const containerRef = useRef(null);

  const testimonials = [
    {
      name: "Alyssa Cruz",
      title: "President, ICpEP.SE",
      imageSrc: "/faculty.png",
      testimonial: "Being part of ICpEP.SE has helped me build confidence, leadership, and technical skills that go beyond the classroom.",
    },
    {
      name: "Joshua Tan",
      title: "Member",
      imageSrc: "/faculty.png",
      testimonial: "Through ICpEP.SE, I met amazing people who share the same passion for innovation and technology.",
    },
    {
      name: "Rina Lopez",
      title: "Event Organizer",
      imageSrc: "/faculty.png",
      testimonial: "Organizing events under ICpEP.SE allowed me to grow as both a professional and a student leader.",
    },
    {
      name: "Mark Dela Cruz",
      title: "Treasurer",
      imageSrc: "/faculty.png",
      testimonial: "ICpEP.SE taught me how collaboration and discipline can build a strong tech community.",
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

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(center - (card.offsetLeft + card.offsetWidth / 2));
        const maxDistance = container.clientWidth / 2;
        const scale = Math.max(0.8, 1.10 - distance / maxDistance);
        card.style.transform = `scale(${scale})`;
        card.style.zIndex = String(scale > 1.0 ? 10 : 1);
      });
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center py-12 overflow-visible mb-20 bg-white">
      <div className="absolute inset-0 -z-0 overflow-visible">
        <div className="blob bg-primary1 top-[-10%] left-[-10%] animate-blob-slow" />
        <div className="blob bg-steel-blue-200 top-[-15%] right-[15%] animate-blob-medium" />
        <div className="blob bg-secondary2 top-1/3 left-1/3 animate-blob-fast" />
        <div className="blob bg-primary1 bottom-[-20%] left-[-10%] animate-blob-medium" />
        <div className="blob bg-steel-blue-200 bottom-[-15%] right-[1%] animate-blob-slow" />
        <div className="blob bg-secondary2 top-[40%] right-[35%] opacity-40 animate-blob-fast" />
      </div>

      <div className="text-center max-w-4xl mx-auto mb-15 relative z-10">
        <h2 className="font-rubik text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-black">
          TESTIMONIALS
        </h2>
        <p className="font-raleway text-gray-700 text-base md:text-lg leading-relaxed mt-5">
          Discover how ICpEP.SE has impacted students through their stories and feedback.
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex gap-8 h-120 items-center overflow-x-auto scroll-smooth snap-x snap-mandatory px-10 md:px-20 pb-8 hide-scrollbar relative z-10"
        style={{ scrollbarWidth: "none" }}
      >
        {extendedTestimonials.map((t, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-center w-[80%] sm:w-[60%] md:w-[33%] flex justify-center items-center"
          >
            <div className="testimonial-card transition-transform duration-300 ease-in-out origin-center">
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
    </div>
  );
}