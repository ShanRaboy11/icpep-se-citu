"use client";

import { FC } from "react";
import Image from "next/image";
import { SectionType } from "../utils/types";

const MissionLayout: FC<{ section: SectionType }> = ({ section }) => {
  const missionPoints = [
    {
      imageUrl: "/trophy.png",
      title: "Academic Support",
      description:
        "Excel in your studies with targeted resources and mentorship.",
    },
    {
      imageUrl: "/computer.png",
      title: "Skills Training",
      description:
        "Master in-demand tech with hands-on workshops and projects.",
    },
    {
      imageUrl: "/shield.png",
      title: "Global Competence",
      description:
        "Prepare for an international career solving complex problems.",
    },
    {
      imageUrl: "/notify.png",
      title: "Community Engagement",
      description: "Connect and collaborate with a vibrant network of peers.",
    },
  ];

  return (
    <div className="content-fade flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-center">
      <div className="text-left max-w-xs flex-shrink-0">
        <h3 className="font-rubik text-3xl sm:text-4xl font-bold mb-3 text-secondary2">
          {section.title}
        </h3>
        <p className="font-raleway text-lg sm:text-xl leading-relaxed text-gray-300">
          {section.content}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
        {missionPoints.map((point, index) => (
          <div
            key={index}
            className="flex items-center gap-6 px-5 py-6 rounded-2xl border border-white/10
                       bg-white/5 transition-all duration-300 group hover:bg-white/10"
            style={{
              backgroundImage:
                "radial-gradient(circle, transparent 1px, rgba(255,255,255,0.05) 1px)",
              backgroundSize: "1rem 1rem",
            }}
          >
            <div className="relative flex-shrink-0 w-24 h-24">
              <Image
                src={point.imageUrl}
                alt={point.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col justify-center text-left">
              <h4 className="font-rubik text-xl font-bold text-white leading-snug">
                {point.title}
              </h4>
              <p className="font-raleway text-base text-gray-300 mt-1 leading-relaxed">
                {point.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionLayout;
