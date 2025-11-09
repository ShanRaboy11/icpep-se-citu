"use client";

import { useState, useEffect, FC } from "react";
import Image from "next/image";
import { Building2, Binoculars, Rocket, Gem } from "lucide-react";

const sections = [
  {
    id: "org",
    tabLabel: "ICPEP.SE CIT-U",
    icon: <Building2 size={22} />,
    title: "Our Organization",
    content:
      "The Institute of Computer Engineers of the Philippines, Student Edition (ICPEP.SE) at Cebu Institute of Technology - University is a dynamic student body dedicated to the holistic development of future computer engineers.",
    imageUrl: "/gle.png",
  },
  {
    id: "vision",
    tabLabel: "Vision",
    icon: <Binoculars size={22} />,
    title: "Our Vision",
    content:
      "To be the center of excellence in computer engineering, fostering innovators who lead technological advancement for a better society and are recognized for their technical prowess and ethical leadership.",
    imageUrl: "/gle.png",
  },
  {
    id: "mission",
    tabLabel: "Mission",
    icon: <Rocket size={22} />,
    title: "Our Mission",
    content:
      "To provide holistic development for students through academic support, skills training, and community engagement, preparing them to be globally competent professionals who can solve complex problems.",
    imageUrl: "/gle.png",
  },
  {
    id: "values",
    tabLabel: "Core Values",
    icon: <Gem size={22} />,
    title: "Our Core Values",
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
  }, []);

  const activeSection = sections[activeIndex];

  return (
    <>
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {sections.map((section, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={section.id}
              onClick={() => setActiveIndex(index)}
              className={`w-full relative overflow-hidden flex items-center gap-3 p-2 rounded-xl text-left transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-br from-primary3 to-secondary1 shadow-md text-white"
                    : "bg-white hover:bg-gray-100 text-black"
                }`}
            >
              {/* Progress animation */}
              {isActive && (
                <div
                  key={activeIndex}
                  className="absolute left-0 top-0 bottom-0 h-full bg-white/20 animate-progress"
                  style={{ animationDuration: `${TAB_DURATION}ms` }}
                />
              )}

              {/* Icon — plain white square */}
              <div className="relative z-10 flex-shrink-0 p-3 rounded-lg bg-white">
                <span
                  className={`${isActive ? "text-primary3" : "text-blue-800"}`}
                >
                  {section.icon}
                </span>
              </div>

              {/* Label */}
              <span
                className={`relative z-10 font-raleway text-sm font-semibold ${
                  isActive ? "text-white" : "text-black"
                }`}
              >
                {section.tabLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main content card */}
      <section
        key={activeIndex}
        className={`rounded-3xl mt-8 bg-gradient-to-br from-primary3 to-secondary1 
          px-10 sm:px-16 py-16 sm:py-20 shadow-2xl 
          transition-transform duration-300 ease-out 
          transform-style-preserve-3d text-white animate-fade-in`}
      >
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text side */}
          <div className="text-left">
            <h3 className="font-rubik text-3xl sm:text-4xl font-bold mb-4 text-secondary2">
              {activeSection.title}
            </h3>
            <p className="font-raleway leading-relaxed text-gray-100">
              {activeSection.content}
            </p>
          </div>

          {/* Image side with hover animation */}
          <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-lg group">
            <Image
              src={activeSection.imageUrl}
              alt={activeSection.title}
              layout="fill"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default InfoSection;
