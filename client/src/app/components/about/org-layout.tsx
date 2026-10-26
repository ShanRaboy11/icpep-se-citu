"use client";

import { FC } from "react";
import Image from "next/image";
import FallbackImage from "@/app/components/ui/fallback-image";
import { SectionType } from "../../utils/about/types";

const OrgLayout: FC<{ section: SectionType }> = ({ section }) => {
  const images = Array.isArray(section.imageUrls)
    ? section.imageUrls
    : [section.imageUrls];

  const allSixImages = Array.from({ length: 6 }, (_, i) => images[i % images.length]);

  const iconSquares = [
    "/icons/illustrations/tools.avif",
    "/icons/illustrations/camera.avif",
    "/icons/illustrations/calculator.avif",
    "/icons/illustrations/coffee.avif",
  ];

  const CubeFace = ({ src, transform }: { src: string; transform: string }) => (
    <div
      className="absolute inset-0 overflow-hidden bg-primary3"
      style={{ transform, backfaceVisibility: "hidden" }}
    >
      <FallbackImage
        src={src}
        alt={section.title}
        fill
        sizes="(min-width: 640px) 18rem, 10rem"
        loading="eager"
        className="object-cover"
      />
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

        <div className="mt-4 sm:mt-10 flex items-center gap-3 sm:gap-4 flex-wrap">
          {iconSquares.map((iconUrl, index) => (
            <div
              key={index}
              className="w-12 h-12 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl border border-white/20 transition-colors duration-300 hover:border-secondary2/70 flex items-center justify-center "
            >
              <div className="relative w-8 h-8 sm:w-16 sm:h-16">
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

      <div className="w-full h-64 sm:h-96 flex items-center justify-center [perspective:1000px] mt-4 sm:mt-0">
        <div
          className="relative w-40 h-40 sm:w-72 sm:h-72 [transform-style:preserve-3d] 
                     animate-spin-3d will-change-transform hover:[animation-play-state:paused]
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
