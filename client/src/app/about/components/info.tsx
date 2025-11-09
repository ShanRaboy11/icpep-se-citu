"use client";

import { useState, useEffect, FC } from "react";
import Image from "next/image";
import { Building2, Binoculars, Rocket, Gem } from "lucide-react";

// --- UPDATED DATA ---
// Palette is now all blue, and icons are new.
const sections = [
  {
    id: "org",
    tabLabel: "ICPEP.SE CIT-U",
    icon: <Building2 size={22} />,
    title: "Our Organization",
    content:
      "The Institute of Computer Engineers of the Philippines, Student Edition (ICPEP.SE) at Cebu Institute of Technology - University is a dynamic student body dedicated to the holistic development of future computer engineers.",
    imageUrl: "/gle.png",
    accentColor: "bg-blue-100",
    progressColor: "bg-blue-200",
    textColor: "text-blue-800",
  },
  {
    id: "vision",
    tabLabel: "Vision",
    icon: <Binoculars size={22} />,
    title: "Our Vision",
    content:
      "To be the center of excellence in computer engineering, fostering innovators who lead technological advancement for a better society and are recognized for their technical prowess and ethical leadership.",
    imageUrl: "/gle.png",
    accentColor: "bg-blue-100",
    progressColor: "bg-blue-200",
    textColor: "text-blue-800",
  },
  {
    id: "mission",
    tabLabel: "Mission",
    icon: <Rocket size={22} />,
    title: "Our Mission",
    content:
      "To provide holistic development for students through academic support, skills training, and community engagement, preparing them to be globally competent professionals who can solve complex problems.",
    imageUrl: "/gle.png",
    accentColor: "bg-blue-100",
    progressColor: "bg-blue-200",
    textColor: "text-blue-800",
  },
  {
    id: "values",
    tabLabel: "Core Values",
    icon: <Gem size={22} />,
    title: "Our Core Values",
    content:
      "We uphold Integrity, Passion, Excellence, Collaboration, and Service in all our endeavors. These values shape engineers with strong character, a drive for innovation, and a commitment to competence.",
    imageUrl: "/gle.png",
    accentColor: "bg-blue-100",
    progressColor: "bg-blue-200",
    textColor: "text-blue-800",
  },
];

const TAB_DURATION = 7000; // 7 seconds per tab

const InfoSection: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % sections.length);
    }, TAB_DURATION);
    return () => clearInterval(interval);
  }, []);

  const activeSection = sections[activeIndex];

  return (
    // Use a fragment to return two separate sibling elements
    <>
      {/* 1. Tab Navigation Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setActiveIndex(index)}
            className={`w-full relative overflow-hidden flex items-center gap-3 p-2 rounded-xl text-left transition-all duration-300
              ${
                activeIndex === index
                  ? "bg-white shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200/60"
              }`}
          >
            {/* PROGRESS BAR - Fills the entire tab */}
            {activeIndex === index && (
              <div
                key={activeIndex} // Restarts the animation
                className={`absolute left-0 top-0 bottom-0 h-full ${section.progressColor} opacity-50 animate-progress`}
                style={{ animationDuration: `${TAB_DURATION}ms` }}
              />
            )}

            {/* Icon with rounded square background */}
            <div
              className={`relative z-10 flex-shrink-0 p-3 rounded-lg ${
                activeIndex === index ? section.accentColor : "bg-gray-200"
              }`}
            >
              <span
                className={`${
                  activeIndex === index ? section.textColor : "text-gray-600"
                }`}
              >
                {section.icon}
              </span>
            </div>

            {/* Text */}
            <span
              className={`relative z-10 font-raleway text-sm font-semibold ${
                activeIndex === index ? "text-primary3" : "text-gray-600"
              }`}
            >
              {section.tabLabel}
            </span>
          </button>
        ))}
      </div>

      {/* 2. Main Content Card */}
      <section
        key={activeIndex} // Re-trigger the fade-in animation
        className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-12 shadow-md animate-fade-in"
      >
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div className="text-left">
            <h3 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 mb-4">
              {activeSection.title}
            </h3>
            <p className="font-raleway text-gray-600 leading-relaxed">
              {activeSection.content}
            </p>
          </div>

          {/* Image Content */}
          <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm">
            <Image
              src={activeSection.imageUrl}
              alt={activeSection.title}
              layout="fill"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default InfoSection;
