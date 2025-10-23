"use client";

import React, { useRef, useEffect } from "react";

const ScrollingText = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.75;
      const scrollPercent = (triggerPoint - rect.top) / rect.height;
      const clampedPercent = Math.max(0, Math.min(1, scrollPercent));

      const totalWords = wordRefs.current.length;
      const wordsToShow = Math.floor(clampedPercent * totalWords);

      wordRefs.current.forEach((word, index) => {
        word.style.opacity = index < wordsToShow ? "1" : "0.2";
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="max-w-5xl text-[1.5rem] md:text-[1.9rem] font-raleway font-regular leading-relaxed text-center text-gray-700 flex flex-wrap justify-center"
    >
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) wordRefs.current[i] = el;
          }}
          className="transition-opacity duration-500 ease-out mx-1 opacity-20"
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export function AboutSection() {
  return (
    <section
      id="about"
      className="about-themed-background relative flex min-h-screen items-center justify-center overflow-hidden p-6"
    >
      <div className="relative z-10 flex flex-col items-center text-center -translate-y-16">
        <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-10">
          Who We Are
        </h1>

        <ScrollingText text="We are the Institute of Computer Engineers of the Philippines (ICpEP) Student Edition at Cebu Institute of Technology-University (CIT-U), a dynamic community of aspiring computer engineers dedicated to innovation, leadership, and shaping the future of technology through impactful, student-led initiatives." />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#FEFEFF] via-[#fbfdff] to-transparent z-20 pointer-events-none"></div>
    </section>
  );
}
