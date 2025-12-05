"use client";

import { useState, useEffect, FC } from "react";
import { sections } from "../utils/info";
import OrgLayout from "../components/org-layout";
import VisionLayout from "../components/vision-layout";
import MissionLayout from "../components/mission-layout";
import ValuesLayout from "../components/values-layout";

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
      <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
        {sections.map((section, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={section.id}
              onClick={() => setActiveIndex(index)}
              className={`group w-full relative overflow-hidden items-center gap-3 p-2 rounded-xl text-left transition-all duration-300
              cursor-pointer
              ${isActive ? "flex" : "hidden sm:flex"}
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
                className={`relative z-10 flex-shrink-0 p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-secondary2"
                    : "bg-secondary3/10 text-secondary2"
                }`}
              >
                {section.icon}
              </div>
              <span
                className={`relative z-10 font-raleway text-xs sm:text-sm font-semibold ${
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
        className="rounded-3xl mt-4 sm:mt-8 bg-gradient-to-br from-primary3 to-secondary1
    px-6 sm:px-16 py-10 sm:py-20 shadow-2xl text-white flex flex-col justify-center min-h-[30rem] sm:min-h-[40rem]"
      >
        <div key={activeIndex} className="animate-fade-in">
          {activeSection.id === "org" && <OrgLayout section={activeSection} />}
          {activeSection.id === "vision" && (
            <VisionLayout section={activeSection} />
          )}
          {activeSection.id === "mission" && (
            <MissionLayout section={activeSection} />
          )}
          {activeSection.id === "values" && (
            <ValuesLayout section={activeSection} />
          )}
        </div>
      </section>
    </>
  );
};

export default InfoSection;
