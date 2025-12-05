"use client";

import { useState, useEffect, FC } from "react";
import { sections } from "../utils/info";
import { motion } from "framer-motion";
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
      <div className="flex flex-row gap-2 sm:gap-4 mb-4 sm:mb-6 w-full h-full">
        {sections.map((section, index) => {
          const isActive = activeIndex === index;

          return (
            <motion.button
              key={section.id}
              layout
              onClick={() => setActiveIndex(index)}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`
                group relative overflow-hidden flex items-center text-left cursor-pointer
                
                /* UNIFORM PADDING & ALIGNMENT */
                p-2 sm:p-3 justify-start gap-2 rounded-xl
                
                /* MOBILE SIZING: Active grows, Inactive shrinks */
                ${isActive ? "flex-[2]" : "flex-none"}
                
                /* DESKTOP SIZING: Equal width */
                sm:flex-1
                
                ${
                  isActive
                    ? "bg-gradient-to-br from-primary3 to-secondary1 shadow-md"
                    : "bg-white border-2 border-secondary3 text-black hover:bg-gradient-to-br hover:from-primary3/85 hover:to-secondary1/85"
                }
              `}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-0 bottom-0 h-full bg-white/20 animate-progress"
                  style={{ animationDuration: `${TAB_DURATION}ms` }}
                />
              )}

              <motion.div
                layout="position"
                className={`relative z-10 flex-shrink-0 p-2 rounded-lg transition-colors duration-300 ${
                  isActive
                    ? "bg-white/10 text-secondary2"
                    : "bg-secondary3/10 text-secondary2"
                }`}
              >
                {section.icon}
              </motion.div>

              <motion.div
                initial={false}
                animate={{
                  width: isActive ? "auto" : "0px",
                  opacity: isActive ? 1 : 0,
                }}
                className={`
                   relative z-10 overflow-hidden flex flex-col justify-center
                   sm:!w-auto sm:!opacity-100 
                `}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <span
                  className={`
                    block font-raleway font-semibold whitespace-normal leading-none text-left pl-1
                    
                    /* TEXT SIZE */
                    text-[0.65rem] xs:text-xs sm:text-sm
                    
                    /* PREVENT WRAPPING ISSUES DURING ANIMATION */
                    min-w-[80px] sm:min-w-0
                    
                    ${
                      isActive
                        ? "text-gray-300"
                        : "text-black group-hover:text-gray-100"
                    }
                  `}
                >
                  {section.id === "org" ? (
                    <>
                      ICPEP SE
                      <br />
                      CIT-U
                    </>
                  ) : section.id === "values" ? (
                    <>
                      Core
                      <br />
                      Values
                    </>
                  ) : (
                    section.tabLabel
                  )}
                </span>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <section
        className="rounded-3xl mt-2 sm:mt-8 bg-gradient-to-br from-primary3 to-secondary1
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
