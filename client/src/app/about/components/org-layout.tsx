"use client";

import { FC } from "react";
import Image from "next/image";
import { SectionType } from "../utils/types";

const OrgLayout: FC<{ section: SectionType }> = ({ section }) => {
  const images = Array.isArray(section.imageUrls)
    ? section.imageUrls
    : [section.imageUrls];

  const allSixImages = [...images, ...images];

  const iconSquares = [
    "/tools.png",
    "/camera.png",
    "/calculator.png",
    "/coffee.png",
  ];

  const CubeFace = ({ src, transform }: { src: string; transform: string }) => (
    <div className="absolute w-full h-full" style={{ transform }}>
      <Image src={src} alt={section.title} fill className="object-cover" />
    </div>
  );

  return (
    <div className="content-fade grid md:grid-cols-2 gap-8 md:gap-16 items-start">
      <div className="text-left flex flex-col">
        <div>
          <h3 className="font-rubik text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-secondary2">
            {section.title}
          </h3>
          <p className="font-raleway text-sm sm:text-xl leading-relaxed text-gray-300">
            {section.content}
          </p>
        </div>

        <div className="mt-6 sm:mt-10 flex items-center gap-3 sm:gap-4 flex-wrap">
          {iconSquares.map((iconUrl, index) => (
            <div
              key={index}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center transition-colors duration-300 hover:bg-white/10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, transparent 1px, rgba(255,255,255,0.05) 1px)",
                backgroundSize: "1rem 1rem",
              }}
            >
              <div className="relative w-8 h-8 sm:w-14 sm:h-14">
                <Image
                  src={iconUrl}
                  alt={`Feature icon ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-64 sm:h-96 flex items-center justify-center [perspective:1000px] mt-8 sm:mt-0">
        <div
          className="relative w-40 h-40 sm:w-72 sm:h-72 [transform-style:preserve-3d] 
                     animate-spin-3d hover:[animation-play-state:paused]
                     [--cube-size:10rem] sm:[--cube-size:18rem]"
        >
          <CubeFace
            src={allSixImages[2]}
            transform={`translateZ(calc(var(--cube-size) / 2))`}
          />
          <CubeFace
            src={allSixImages[5]}
            transform={`rotateY(180deg) translateZ(calc(var(--cube-size) / 2))`}
          />
          <CubeFace
            src={allSixImages[0]}
            transform={`rotateX(90deg) translateZ(calc(var(--cube-size) / 2))`}
          />
          <CubeFace
            src={allSixImages[3]}
            transform={`rotateX(-90deg) translateZ(calc(var(--cube-size) / 2))`}
          />
          <CubeFace
            src={allSixImages[1]}
            transform={`rotateY(-90deg) translateZ(calc(var(--cube-size) / 2))`}
          />
          <CubeFace
            src={allSixImages[4]}
            transform={`rotateY(90deg) translateZ(calc(var(--cube-size) / 2))`}
          />
        </div>
      </div>
    </div>
  );
};

export default OrgLayout;