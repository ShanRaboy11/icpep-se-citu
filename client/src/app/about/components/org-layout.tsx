"use client";

import { FC } from "react";
import Image from "next/image";
import { SectionType } from "../utils/types";

const OrgLayout: FC<{ section: SectionType }> = ({ section }) => {
  const images = Array.isArray(section.imageUrls)
    ? section.imageUrls
    : [section.imageUrls];

  const allSixImages = [...images, ...images];
  const cubeSize = "18rem";

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
    <div className="content-fade grid md:grid-cols-2 gap-12 md:gap-16 items-start">
      <div className="text-left flex flex-col">
        <div>
          <h3 className="font-rubik text-3xl sm:text-4xl font-bold mb-4 text-secondary2">
            {section.title}
          </h3>
          <p className="font-raleway text-lg sm:text-xl leading-relaxed text-gray-300">
            {section.content}
          </p>
        </div>

        <div className="mt-10 flex items-center gap-4 flex-wrap">
          {iconSquares.map((iconUrl, index) => (
            <div
              key={index}
              className="w-24 h-24 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center transition-colors duration-300 hover:bg-white/10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, transparent 1px, rgba(255,255,255,0.05) 1px)",
                backgroundSize: "1rem 1rem",
              }}
            >
              <div className="relative w-14 h-14">
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

      <div className="w-full h-96 flex items-center justify-center [perspective:1000px]">
        <div
          className="relative w-56 h-56 sm:w-72 sm:h-72 [transform-style:preserve-3d] 
                     animate-spin-3d hover:[animation-play-state:paused]"
        >
          <CubeFace
            src={allSixImages[2]}
            transform={`translateZ(calc(${cubeSize} / 2))`}
          />
          <CubeFace
            src={allSixImages[5]}
            transform={`rotateY(180deg) translateZ(calc(${cubeSize} / 2))`}
          />
          <CubeFace
            src={allSixImages[0]}
            transform={`rotateX(90deg) translateZ(calc(${cubeSize} / 2))`}
          />
          <CubeFace
            src={allSixImages[3]}
            transform={`rotateX(-90deg) translateZ(calc(${cubeSize} / 2))`}
          />
          <CubeFace
            src={allSixImages[1]}
            transform={`rotateY(-90deg) translateZ(calc(${cubeSize} / 2))`}
          />
          <CubeFace
            src={allSixImages[4]}
            transform={`rotateY(90deg) translateZ(calc(${cubeSize} / 2))`}
          />
        </div>
      </div>
    </div>
  );
};

export default OrgLayout;
