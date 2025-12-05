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
      sizeClass: "w-[90%] h-[90%]",
    },
    {
      iconUrl: "/target.png",
      title: "Ethical Leadership",
      description: "Impacting society with technical prowess and integrity.",
      sizeClass: "w-[90%] h-[90%]",
    },
    {
      iconUrl: "/megaphone.png",
      title: "Community Driven",
      description: "Building a collaborative and supportive student network.",
      sizeClass: "w-[85%] h-[85%]",
    },
  ];

  return (
    <div className="content-fade text-left sm:text-center">
      <div className="max-w-3xl mx-0 sm:mx-auto">
        <h3 className="font-rubik text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-secondary2">
          {section.title}
        </h3>
        <p className="font-raleway text-sm sm:text-xl leading-relaxed text-gray-300">
          {section.content}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-3 sm:gap-6 mt-6 sm:mt-10">
        {visionPoints.map((point, index) => (
          <div key={index} className="text-left sm:text-center group">
            <div
              className="w-full h-16 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden bg-white/5 mb-2 border border-white/10 transition-colors duration-300 group-hover:bg-white/10
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

            <h4 className="font-rubik text-sm sm:text-lg font-bold text-white mb-1">
              {point.title}
            </h4>

            <p className="font-raleway text-[10px] sm:text-sm text-gray-300 leading-tight">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisionLayout;
