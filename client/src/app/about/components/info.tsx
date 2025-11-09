"use client";

import { useState, useEffect, FC, ReactElement } from "react";
import Image from "next/image";
import {
  Box,
  Lightbulb,
  Rocket,
  Ribbon,
  // Lucide icons are no longer used in VisionLayout
} from "lucide-react";
// --- NEW HEROICONS IMPORT ---
import {
  Cog6ToothIcon,
  ScaleIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

interface SectionType {
  id: string;
  tabLabel: string;
  icon: ReactElement;
  title: string;
  content: string;
  imageUrl: string;
}

const DefaultLayout: FC<{ section: SectionType }> = ({ section }) => (
  <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
    <div className="text-left">
      <h3 className="font-rubik text-3xl sm:text-4xl font-bold mb-4 text-secondary2">
        {section.title}
      </h3>
      <p className="font-raleway text-lg sm:text-xl leading-relaxed text-gray-300">
        {section.content}
      </p>
    </div>
    <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-lg group">
      <Image
        src={section.imageUrl}
        alt={section.title}
        layout="fill"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>
  </div>
);

// --- MODIFIED VisionLayout STARTS HERE ---
const VisionLayout: FC<{ section: SectionType }> = ({ section }) => (
  <div className="text-center">
    <div className="max-w-3xl mx-auto">
      <h3 className="font-rubik text-3xl sm:text-4xl font-bold mb-4 text-secondary2">
        {section.title}
      </h3>
      <p className="font-raleway text-lg sm:text-xl leading-relaxed text-gray-300">
        {section.content}
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8 mt-12">
      {/* Card 1: Fostering Innovators */}
      <div className="text-center group">
        <div
          className="relative w-full h-40 rounded-2xl overflow-hidden bg-white/5 p-4 mb-4 border border-white/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-white/10"
          style={{
            backgroundImage:
              "radial-gradient(circle, transparent 1px, rgba(255,255,255,0.05) 1px)",
            backgroundSize: "1rem 1rem",
          }}
        >
          <Cog6ToothIcon className="h-16 w-16 text-secondary2 opacity-80 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <h4 className="font-rubik text-xl font-bold text-white">
          Fostering Innovators
        </h4>
        <p className="font-raleway text-gray-300">
          Leading and inspiring technological advancement.
        </p>
      </div>

      {/* Card 2: Ethical Leadership */}
      <div className="text-center group">
        <div
          className="relative w-full h-40 rounded-2xl overflow-hidden bg-white/5 p-4 mb-4 border border-white/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-white/10"
          style={{
            backgroundImage:
              "radial-gradient(circle, transparent 1px, rgba(255,255,255,0.05) 1px)",
            backgroundSize: "1rem 1rem",
          }}
        >
          <ScaleIcon className="h-16 w-16 text-secondary2 opacity-80 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <h4 className="font-rubik text-xl font-bold text-white">
          Ethical Leadership
        </h4>
        <p className="font-raleway text-gray-300">
          Impacting society with technical prowess and integrity.
        </p>
      </div>

      {/* Card 3: Community Driven */}
      <div className="text-center group">
        <div
          className="relative w-full h-40 rounded-2xl overflow-hidden bg-white/5 p-4 mb-4 border border-white/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-white/10"
          style={{
            backgroundImage:
              "radial-gradient(circle, transparent 1px, rgba(255,255,255,0.05) 1px)",
            backgroundSize: "1rem 1rem",
          }}
        >
          <GlobeAltIcon className="h-16 w-16 text-secondary2 opacity-80 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <h4 className="font-rubik text-xl font-bold text-white">
          Community Driven
        </h4>
        <p className="font-raleway text-gray-300">
          Building a collaborative and supportive student network.
        </p>
      </div>
    </div>
  </div>
);
// --- MODIFIED VisionLayout ENDS HERE ---

// --- NO CHANGES BELOW THIS LINE ---

const sections: SectionType[] = [
  {
    id: "org",
    tabLabel: "ICpEP SE CIT-U",
    icon: <Box size={22} />,
    title: "Engineered for Impact",
    content:
      "The Institute of Computer Engineers of the Philippines (ICpEP) Student Edition at Cebu Institute of Technology-University is a dynamic student body dedicated to the holistic development of future computer engineers.",
    imageUrl: "/gle.png",
  },
  {
    id: "vision",
    tabLabel: "Vision",
    icon: <Lightbulb size={22} />,
    title: "Leading Innovation Forward",
    content:
      "To be a community-driven center of excellence in computer engineering, fostering innovators who lead technological advancement and are recognized for their technical prowess and ethical leadership.",
    imageUrl: "/gle.png",
  },
  {
    id: "mission",
    tabLabel: "Mission",
    icon: <Rocket size={22} />,
    title: "Empowering Change-Makers",
    content:
      "To provide holistic development for students through academic support, skills training, and community engagement, preparing them to be globally competent professionals who can solve complex problems.",
    imageUrl: "/gle.png",
  },
  {
    id: "values",
    tabLabel: "Core Values",
    icon: <Ribbon size={22} />,
    title: "Values That Inspire",
    content:
      "We uphold Integrity, Passion, Excellence, Collaboration, and Service in all our endeavors. These values shape engineers with strong character, a drive for innovation, and a commitment to competence.",
    imageUrl: "/gle.png",
  },
];

const TAB_DURATION = 7000;

const InfoSection: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % sections.length);
    }, TAB_DURATION);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const activeSection = sections[activeIndex];

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {sections.map((section, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={section.id}
              onClick={() => setActiveIndex(index)}
              className={`group w-full relative overflow-hidden flex items-center gap-3 p-2 rounded-xl text-left transition-all duration-300
          cursor-pointer
          ${
            isActive
              ? "bg-gradient-to-br from-primary3 to-secondary1 shadow-md"
              : "bg-white border-2 border-secondary3 text-black hover:bg-gradient-to-br hover:from-primary3/85 hover:to-secondary1/85"
          }`}
            >
              {isActive && (
                <div
                  key={activeIndex}
                  className="absolute left-0 top-0 bottom-0 h-full bg-white/20 animate-progress"
                  style={{ animationDuration: `${TAB_DURATION}ms` }}
                />
              )}
              <div
                className={`relative z-10 flex-shrink-0 p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-secondary2"
                    : "bg-secondary3/10 text-secondary2"
                }`}
              >
                {section.icon}
              </div>
              <span
                className={`relative z-10 font-raleway text-sm font-semibold ${
                  isActive
                    ? "text-gray-300"
                    : "text-black group-hover:text-gray-100"
                }`}
              >
                {section.tabLabel}
              </span>
            </button>
          );
        })}
      </div>

      <section
        className="rounded-3xl mt-8 bg-gradient-to-br from-primary3 to-secondary1
    px-10 sm:px-16 py-16 sm:py-20 shadow-2xl text-white flex flex-col justify-center min-h-[40rem]"
      >
        <div key={activeIndex} className="animate-fade-in">
          {activeSection.id === "vision" ? (
            <VisionLayout section={activeSection} />
          ) : (
            <DefaultLayout section={activeSection} />
          )}
        </div>
      </section>
    </>
  );
};

export default InfoSection;