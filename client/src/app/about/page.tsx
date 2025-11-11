"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import InfoSection from "./sections/info";
import OfficerTermCard from "./components/term-card";
import ProfileCard from "./components/profile-card";
import { FC, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

// --- START: New Carousel Components for Guiding Leadership ---

// Helper component for individual profiles (Head/Advisor)
const LeadershipProfile: FC<{
  person: { name: string; imageUrl: string } | null;
  role: string;
  isCenter: boolean;
}> = ({ person, role, isCenter }) => {
  if (!person) {
    return (
      <div className="flex flex-col items-center text-center w-48">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gray-200 border-2 border-dashed border-gray-300" />
        <h3 className="font-rubik font-bold text-lg sm:text-xl text-primary3 mt-4">
          {role}
        </h3>
        <p className="font-raleway text-sm text-gray-500 mt-1">N/A</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center w-48">
      <div className="relative mb-4">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gray-300 overflow-hidden">
          <Image
            src={person.imageUrl}
            alt={person.name}
            width={176}
            height={176}
            className="w-full h-full object-cover"
          />
        </div>
        {isCenter && (
          <div className="absolute -inset-1 rounded-full border-2 border-blue-400 opacity-80" />
        )}
      </div>
      <h3 className="font-rubik font-bold text-lg sm:text-xl text-primary3">
        {role}
      </h3>
      <p className="font-raleway text-sm text-gray-500 mt-1">{person.name}</p>
    </div>
  );
};

// Component for a single slide in the carousel
const LeadershipCard: FC<{
  year: string;
  head: { name: string; imageUrl: string } | null;
  adviser: { name: string; imageUrl: string } | null;
  position: number;
}> = ({ year, head, adviser, position }) => {
  const isCenter = position === 0;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-white rounded-2xl p-6">
      <div className="text-center mb-8">
        <h2 className="font-rubik text-2xl font-semibold text-primary3">
          {year}
        </h2>
        <div className="w-48 h-px bg-primary1/50 mx-auto mt-2"></div>
      </div>
      <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-16">
        <LeadershipProfile person={head} role="Head" isCenter={isCenter} />
        <LeadershipProfile
          person={adviser}
          role="Advisor"
          isCenter={isCenter}
        />
      </div>
    </div>
  );
};

// Main Carousel component
interface LeadershipItem {
  year: string;
  head: { name: string; imageUrl: string } | null;
  adviser: { name: string; imageUrl: string } | null;
}

const LeadershipCarousel: FC<{ items: LeadershipItem[] }> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
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
    <div className="relative flex flex-col items-center justify-center">
      {/* --- Mobile Carousel --- */}
      <div
        ref={scrollContainerRef}
        className="lg:hidden z-20 w-full h-[500px] flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={
          {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties
        }
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 snap-center flex justify-center p-4"
          >
            <div className="w-full max-w-md h-full">
              <LeadershipCard {...item} position={0} />
            </div>
          </div>
        ))}
      </div>

      {/* --- Desktop Carousel --- */}
      <div className="relative z-20 h-[450px] w-full max-w-7xl overflow-hidden hidden lg:block">
        {items.map((item, index) => {
          const getPosition = (
            index: number,
            currentIndex: number,
            length: number
          ) => {
            const diff = index - currentIndex;
            if (Math.abs(diff) <= Math.floor(length / 2)) return diff;
            return diff > 0 ? diff - length : diff + length;
          };

          const pos = getPosition(index, currentIndex, items.length);
          let animateProps;

          if (pos === 0) {
            animateProps = { x: "0%", scale: 1, opacity: 1, zIndex: 3 };
          } else if (pos === 1) {
            animateProps = { x: "50%", scale: 0.85, opacity: 0.7, zIndex: 2 };
          } else if (pos === -1) {
            animateProps = { x: "-50%", scale: 0.85, opacity: 0.7, zIndex: 2 };
          } else {
            animateProps = {
              x: pos > 0 ? "100%" : "-100%",
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
              <div className="w-full max-w-3xl h-full py-4">
                <LeadershipCard {...item} position={pos} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-30 mt-8 flex gap-4">
        <button
          onClick={handlePrev}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-primary1/40 bg-white/80 backdrop-blur-sm text-primary1 transition-all duration-300 hover:bg-primary1/10 active:scale-90 cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-primary1/40 bg-white/80 backdrop-blur-sm text-primary1 transition-all duration-300 hover:bg-primary1/10 active:scale-90 cursor-pointer"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

// --- END: New Carousel Components ---

// Re-structured data for the new carousel component
const leadershipHistory: LeadershipItem[] = [
  {
    year: "2022 - Present",
    head: {
      name: "Dr. Jane Doe",
      imageUrl: "/gle.png",
    },
    adviser: {
      name: "Prof. Emily White",
      imageUrl: "/gle.png",
    },
  },
  {
    year: "2021 - 2022",
    head: {
      name: "Engr. John Smith",
      imageUrl: "/gle.png",
    },
    adviser: {
      name: "Prof. Emily White",
      imageUrl: "/gle.png",
    },
  },
  {
    year: "2020 - 2021",
    head: {
      name: "Engr. John Smith",
      imageUrl: "/gle.png",
    },
    adviser: null, // Handles cases where a role might be vacant
  },
];

const officerHistory = [
  {
    term: "A.Y. 2023 - 2024",
    council: [
      {
        name: "Juan Dela Cruz",
        position: "President",
        imageUrl: "/gle.png",
      },
      {
        name: "Maria Clara",
        position: "Vice President",
        imageUrl: "/gle.png",
      },
      {
        name: "Crisostomo Ibarra",
        position: "Secretary",
        imageUrl: "/gle.png",
      },
    ],
    committees: [
      {
        name: "Pedro Penduko",
        position: "Creatives Committee Head",
        imageUrl: "/gle.png",
      },
      {
        name: "Darna",
        position: "Events Committee Head",
        imageUrl: "/gle.png",
      },
      {
        name: "Captain Barbell",
        position: "Logistics Committee Head",
        imageUrl: "/gle.png",
      },
    ],
  },
];

const departmentFaculty = [
  {
    name: "Dr. Richard Roe",
    position: "Professor, AI & Machine Learning",
    imageUrl: "/gle.png",
  },
  {
    name: "Engr. Susan Bones",
    position: "Instructor, Digital Logic Design",
    imageUrl: "/gle.png",
  },
  {
    name: "Prof. Peter Pan",
    position: "Lecturer, Embedded Systems",
    imageUrl: "/gle.png",
  },
  {
    name: "Dr. Wendy Darling",
    position: "Associate Professor, Networking",
    imageUrl: "/gle.png",
  },
];

const AboutPage: FC = () => {
  const pillText = "About Our Chapter";
  const title = "The ICpEP SE CIT-U Story";
  const subtitle =
    "Get to know our mission, values, and the dedicated individuals who bring ICPEP SE CIT-U Chapter to life and carry its legacy forward.";

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24 flex-grow">
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                {pillText}
              </span>
            </div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              {title}
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>

          <InfoSection />

          <section className="mt-32">
            <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 text-center mb-4">
              Pillars of Guidance
            </h2>
            <p className="font-raleway text-gray-600 text-center text-base sm:text-lg max-w-3xl mx-auto mb-16">
              A look back at the dedicated faculty whose steadfast support has
              strengthened our organization through the years.
            </p>
            <LeadershipCarousel items={leadershipHistory} />
          </section>

          <section className="mt-24">
            <h2 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 text-center mb-4">
              Our Student Leaders
            </h2>
            <p className="font-raleway text-gray-600 text-center max-w-2xl mx-auto mb-16">
              Meet the passionate and driven officers leading our chapter,
              fostering innovation and community among students.
            </p>
            <div className="space-y-20">
              {officerHistory.map((termData) => (
                <OfficerTermCard key={termData.term} {...termData} />
              ))}
            </div>
          </section>

          <section className="mt-24">
            <h2 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 text-center mb-4">
              CPE Department Faculty
            </h2>
            <p className="font-raleway text-gray-600 text-center max-w-2xl mx-auto mb-16">
              The esteemed faculty members of the Computer Engineering
              department who mentor and inspire the next generation.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {departmentFaculty.map((faculty) => (
                <ProfileCard key={faculty.name} {...faculty} />
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
