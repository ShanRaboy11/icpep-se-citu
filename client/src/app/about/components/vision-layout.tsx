"use client";

import { FC } from "react";
import Image from "next/image";
import { SectionType } from "../utils/types";

const VisionLayout: FC<{ section: SectionType }> = ({ section }) => {
  const visionPoints = [
    {
      iconUrl: "/rocket.png",
      title: "Fostering Innovators",
      description: "Leading and inspiring technological advancement.",
      sizeClass: "w-[85%] h-[85%] md:w-3/4 md:h-3/4",
    },
    {
      iconUrl: "/target.png",
      title: "Ethical Leadership",
      description: "Impacting society with technical prowess and integrity.",
      sizeClass: "w-[85%] h-[85%] md:w-3/4 md:h-3/4",
    },
    {
      iconUrl: "/megaphone.png",
      title: "Community Driven",
      description: "Building a collaborative and supportive student network.",
      sizeClass: "w-[80%] h-[80%] md:w-2/3 md:h-2/3",
    },
  ];

  return (
    <div className="content-fade text-left md:text-center">
      <div className="max-w-3xl mx-0 md:mx-auto">
        <h3 className="font-rubik text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-secondary2 leading-tight">
          {section.title}
        </h3>
        <p className="font-raleway text-sm md:text-xl leading-relaxed text-gray-300">
          {section.content}
        </p>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
        {visionPoints.map((point, index) => (
          <div
            key={index}
            className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-0 group"
          >
            <div
              className="w-12 h-12 md:w-full md:h-40 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-white/5 md:mb-4 border border-white/10 transition-colors duration-300 group-hover:bg-white/10
                         flex items-center justify-center"
              style={{
                backgroundImage:
                  "radial-gradient(circle, transparent 1px, rgba(255,255,255,0.05) 1px)",
                backgroundSize: "1rem 1rem",
              }}
            >
              <div className={`relative ${point.sizeClass}`}>
                <Image
                  src={point.iconUrl}
                  alt={point.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col text-left md:text-center">
              <h4 className="font-rubik text-sm md:text-xl font-bold text-white leading-snug md:mb-1">
                {point.title}
              </h4>
              <p className="font-raleway text-[10px] md:text-base text-gray-300 leading-relaxed">
                {point.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisionLayout;
