"use client";

import { motion } from "framer-motion";
import FacultyOfficerCard from "@/app/home/components/faculty-officer-card";
import { useState, useEffect } from "react";

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

// Mirrors the FacultyOfficerCard dimensions (120px wide card)
function FacultyOfficerCardSkeleton() {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-2 w-[120px]">
      {/* Avatar circle */}
      <SkeletonBlock className="w-[80px] h-[80px] rounded-full" />
      {/* Name line */}
      <SkeletonBlock className="w-[90px] h-3 rounded-md" />
      {/* Title line */}
      <SkeletonBlock className="w-[70px] h-3 rounded-md" />
    </div>
  );
}

function FacultyOfficersSkeleton() {
  const CARD_COUNT = 9;

  return (
    <section className="light-dark-background relative pt-28 pb-16 sm:pt-36 sm:pb-20">
      <style>{shimmerStyle}</style>

      {/* Header skeleton */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 md:mb-16 text-center flex flex-col items-center gap-3">
          {/* Mobile: two-line title */}
          <div className="flex flex-col items-center gap-2 sm:hidden">
            <SkeletonBlock className="w-44 h-9 rounded-md" />
            <SkeletonBlock className="w-28 h-9 rounded-md" />
          </div>
          {/* Desktop: single-line title */}
          <SkeletonBlock className="hidden sm:block w-72 h-10 rounded-md" />
          {/* Subtitle */}
          <SkeletonBlock className="w-52 h-5 rounded-md" />
        </div>
      </div>

      {/* Mobile skeleton rows */}
      <div className="relative z-10 w-full overflow-hidden block sm:hidden">
        <div className="flex gap-6 px-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <FacultyOfficerCardSkeleton key={`mob-top-${i}`} />
          ))}
        </div>
        <div className="flex gap-6 px-5 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <FacultyOfficerCardSkeleton key={`mob-bot-${i}`} />
          ))}
        </div>
      </div>

      {/* Desktop skeleton rows */}
      <div className="relative z-10 w-full overflow-hidden hidden sm:block">
        <div className="flex gap-6 p-5">
          {Array.from({ length: CARD_COUNT }).map((_, i) => (
            <FacultyOfficerCardSkeleton key={`desk-top-${i}`} />
          ))}
        </div>
        <div className="flex gap-6 p-5 -mt-5">
          {Array.from({ length: CARD_COUNT }).map((_, i) => (
            <FacultyOfficerCardSkeleton key={`desk-bot-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FacultyOfficersSection() {
  const [loading, setLoading] = useState(true);

  const facultyAndOfficers = [
    {
      name: "Dr. Maria L. Dizon",
      title: "Faculty Adviser",
      image: "/faculty.png",
    },
    {
      name: "Engr. Rafael P. Cruz",
      title: "Co-Adviser",
      image: "/faculty.png",
    },
    {
      name: "Gio Christian Macatual",
      title: "President",
      image: "/faculty.png",
    },
    {
      name: "Alyssa Mae Reyes",
      title: "Vice President",
      image: "/faculty.png",
    },
    { name: "Daniel Perez", title: "Secretary", image: "/faculty.png" },
    { name: "Hannah Lopez", title: "Treasurer", image: "/faculty.png" },
    { name: "Kevin Torres", title: "Auditor", image: "/faculty.png" },
    { name: "Isabelle Ramos", title: "PRO", image: "/faculty.png" },
    { name: "Luis Mendoza", title: "PIO", image: "/faculty.png" },
    { name: "Rachel Tan", title: "Assistant Secretary", image: "/faculty.png" },
    { name: "Mark Villanueva", title: "Logistics Head", image: "/faculty.png" },
    { name: "Jessa Lim", title: "Creative Director", image: "/faculty.png" },
    { name: "Ethan Cruz", title: "Events Coordinator", image: "/faculty.png" },
    { name: "Nina Santos", title: "Outreach Head", image: "/faculty.png" },
    {
      name: "Mikael Dela Cruz",
      title: "Program Officer",
      image: "/faculty.png",
    },
    { name: "Cheska Uy", title: "Finance Officer", image: "/faculty.png" },
    {
      name: "Jordan Pascual",
      title: "Research Coordinator",
      image: "/faculty.png",
    },
    { name: "Kyla Fernandez", title: "Technical Lead", image: "/faculty.png" },
  ];

  // Simulate a brief loading state so skeleton is visible during hydration/mount
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  const MINIMUM_BASE_LENGTH = 15;
  let extendedList = [...facultyAndOfficers];
  if (extendedList.length > 0 && extendedList.length < MINIMUM_BASE_LENGTH) {
    const repeatsNeeded = Math.ceil(MINIMUM_BASE_LENGTH / extendedList.length);
    extendedList = Array.from(
      { length: repeatsNeeded },
      () => facultyAndOfficers,
    ).flat();
  }
  const duplicated = [...extendedList, ...extendedList];

  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const half = Math.ceil(facultyAndOfficers.length / 2);
  const topRowOfficers = facultyAndOfficers.slice(0, half);
  const bottomRowOfficers = facultyAndOfficers.slice(half);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setActiveMobileSlide((prev) => (prev + 1) % topRowOfficers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [topRowOfficers.length, loading]);

  const MOBILE_CARD_WIDTH = 120;
  const MOBILE_GAP = 24;
  const SLIDE_OFFSET = MOBILE_CARD_WIDTH + MOBILE_GAP;

  if (loading) {
    return <FacultyOfficersSkeleton />;
  }

  return (
    <section className="light-dark-background relative pt-28 pb-16 sm:pt-36 sm:pb-20">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 md:mb-16 text-center">
          <h1 className="relative block sm:hidden font-rubik text-4xl font-bold text-primary3 leading-tight">
            Council Officers
            <br />& Faculty
          </h1>
          <h1 className="relative hidden sm:block font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight">
            Council Officers & Faculty
          </h1>
          <p className="relative font-raleway text-base sm:text-lg text-bodytext mt-2 max-w-lg mx-auto">
            Meet the framework of our community.
          </p>
        </div>
      </div>

      {/* Mobile marquee */}
      <div className="relative z-10 w-full overflow-hidden block sm:hidden">
        <motion.div
          className="flex w-max gap-6 px-5"
          animate={{ x: -activeMobileSlide * SLIDE_OFFSET }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {topRowOfficers.map((officer, i) => (
            <FacultyOfficerCard
              key={`mobile-top-${i}`}
              {...officer}
              forceHoverState={i === activeMobileSlide}
            />
          ))}
        </motion.div>
        <motion.div
          className="flex w-max gap-6 px-5 mt-6"
          animate={{ x: -activeMobileSlide * SLIDE_OFFSET }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.1,
          }}
        >
          {bottomRowOfficers.map((officer, i) => (
            <FacultyOfficerCard
              key={`mobile-bottom-${i}`}
              {...officer}
              forceHoverState={i === activeMobileSlide}
            />
          ))}
        </motion.div>
      </div>

      {/* Desktop marquee */}
      <div className="relative z-10 w-full overflow-hidden hidden sm:block">
        <motion.div
          className="flex w-max gap-6 p-5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
        >
          {duplicated.map((o, i) => (
            <div key={`desktop-top-${i}`} className="flex-shrink-0">
              <FacultyOfficerCard {...o} />
            </div>
          ))}
        </motion.div>
        <motion.div
          className="flex w-max gap-6 p-5 -mt-5"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
        >
          {duplicated.map((o, i) => (
            <div key={`desktop-bottom-${i}`} className="flex-shrink-0">
              <FacultyOfficerCard {...o} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
