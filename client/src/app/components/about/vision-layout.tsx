"use client";

import { FC } from "react";
import Image from "next/image";
import { SectionType } from "../../utils/about/types";

const VisionLayout: FC<{ section: SectionType }> = ({ section }) => {
  const visionPoints = [
    {
      iconUrl: "/icons/illustrations/rocket.avif",
      title: "Fostering Innovators",
      description: "Leading and inspiring technological advancement.",
      sizeClass: "w-[85%] h-[85%] md:w-3/4 md:h-3/4",
    },
    {
      iconUrl: "/icons/illustrations/target.avif",
      title: "Ethical Leadership",
      description: "Impacting society with technical prowess and integrity.",
      sizeClass: "w-[85%] h-[85%] md:w-3/4 md:h-3/4",
    },
    {
      iconUrl: "/icons/illustrations/megaphone.avif",
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
            className="flex flex-row md:flex-col items-center gap-3 md:gap-0 group p-3 md:p-5 rounded-2xl md:rounded-3xl
                       border border-white/20 transition-colors duration-300 hover:border-secondary2/70"
          >
            <div
              className="w-12 h-12 md:w-full md:h-40 shrink-0 md:mb-4
                         flex items-center justify-center"
            >
              <div className={`relative ${point.sizeClass}`}>
                <Image
                  src={point.iconUrl}
                  alt={point.title}
                  fill
                  sizes="(min-width: 768px) 256px, 128px"
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
