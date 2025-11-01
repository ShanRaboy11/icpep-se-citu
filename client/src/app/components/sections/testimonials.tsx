"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

// --- Testimonial Card ---
interface TestimonialCardProps {
  name: string;
  title: string;
  imageSrc: string;
  testimonial: string;
  position: number;
}

const TestimonialCard = ({
  name,
  title,
  imageSrc,
  testimonial,
  position,
}: TestimonialCardProps) => {
  const isCenter = position === 0;

  return (
    <div
      className={`relative h-full w-full rounded-3xl p-8 transition-all duration-500
      ${
        isCenter
          ? "bg-gradient-to-b from-[#cde4fa] to-[#a9d3f9] shadow-xl shadow-primary3/20"
          : "bg-white shadow-lg shadow-gray-400/20"
      }`}
    >
      {/* Avatar - Now floating, not clipped */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 -top-16 z-20"
        animate={{ scale: isCenter ? 1 : 0.85, y: isCenter ? 0 : 10 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="relative h-28 w-28 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
          <Image src={imageSrc} alt={name} fill className="object-cover" />
        </div>
      </motion.div>

      {/* Card Content */}
      <div className="relative flex h-full flex-col justify-center text-center pt-16">
        <div className="absolute top-4 left-4 text-[12rem] font-bold text-primary1/10 leading-none">
          “
        </div>

        <p className="relative z-10 font-raleway text-xl leading-relaxed text-bodytext px-8">
          {testimonial}
        </p>

        <div className="absolute bottom-4 right-4 text-[12rem] font-bold text-primary1/10 leading-none">
          ”
        </div>

        <div className="mt-16">
          <h3 className="font-rubik text-2xl font-bold text-primary3">
            {name}
          </h3>
          <p className="font-raleway text-base font-medium text-primary3/90">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Testimonials Section ---
export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (currentIndex < testimonials.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="dark-light-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 opacity-90">
        <div className="blob bg-sky-400 top-0 left-0 animate-blob-1"></div>
        <div className="blob bg-indigo-400 top-0 right-0 animate-blob-2"></div>
        <div className="blob bg-blue-300 bottom-0 left-1/4 animate-blob-3"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 mb-24 text-center">
        <h1 className="font-rubik text-4xl font-bold text-primary3 sm:text-5xl leading-tight">
          Testimonials
        </h1>
        <p className="font-raleway mt-2 text-base text-bodytext sm:text-lg max-w-lg mx-auto">
          Sync with the experiences that define ICpEP SE.
        </p>
      </div>

      {/* Cards */}
      <div className="relative z-20 h-[420px] w-full max-w-7xl overflow-visible">
        {testimonials.map((testimonial, index) => {
          const position = index - currentIndex;

          let animateProps = { x: "0%", scale: 0.7, opacity: 0, zIndex: 0 };
          if (position === 0) {
            animateProps = { x: "0%", scale: 1, opacity: 1, zIndex: 3 };
          } else if (position === 1) {
            animateProps = { x: "40%", scale: 0.85, opacity: 0.7, zIndex: 2 };
          } else if (position === -1) {
            animateProps = { x: "-40%", scale: 0.85, opacity: 0.7, zIndex: 2 };
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
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center overflow-visible"
              initial={false}
              animate={animateProps}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="w-full max-w-2xl h-[90%] overflow-visible">
                <TestimonialCard {...testimonial} position={position} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
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
    </section>
  );
}
