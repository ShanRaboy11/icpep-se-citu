"use client";

import Image from "next/image";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

interface DeveloperCardProps {
  name: string;
  title: string;
  desc: string;
  imageSrc: string;
  bgSrc: string;
  details: string[];
  githubLink?: string;
  portfolioLink?: string;
}

export default function DeveloperCard({
  name,
  title,
  desc,
  imageSrc,
  bgSrc,
  details,
  githubLink,
  portfolioLink,
}: DeveloperCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const hasActivePortfolioLink = portfolioLink && portfolioLink !== "#";

  return (
    <div
      className="w-[310px] h-[330px] sm:w-[320px] sm:h-[360px] md:w-[360px] md:h-[360px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-300 ease-out transform-style-preserve-3d ${
          isHovered ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div className="absolute w-full h-full rounded-2xl overflow-hidden shadow-lg backface-hidden bg-gradient-to-b from-sky-400 to-blue-600 flex flex-col justify-between">
          <div className="absolute top-[-60px] sm:top-[-19px] lg:top-[-38px] left-0 w-full h-full z-0 hidden md:block">
            <Image
              src={bgSrc}
              alt={`${name}`}
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 360px) 250px, 300px"
            />
          </div>

          <div className="absolute top-[-15px] left-[20px] w-[120%] h-[120%] z-0 md:hidden">
            <Image
              src="/icpep logo.png"
              alt={`${name}`}
              fill
              className="object-contain object-bottom opacity-10"
              sizes="(max-width: 360px) 250px, 300px"
            />
          </div>

          <div className="relative w-[90%] ml-auto mt-1 sm:-mt-3 lg:-mt-5 -mr-8">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={`${name}`}
                width={330}
                height={330}
                className="object-contain mx-auto"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-white/30 rounded-md mx-auto" />
            )}
          </div>

          {/* FONT FIX: Changed font-raleway to font-rubik */}
          <div
            className="absolute bottom-30 left-[47%] sm:left-[48%] -translate-x-1/2 w-[78%] 
                 text-left flex flex-col text-[22px] sm:text-xl lg:text-2xl
                font-rubik font-bold text-white text-2xl"
          >
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>

          {/* FONT FIX: Added font-rubik */}
          <div className="-mt-6 bg-primary3 py-2 text-center text-white font-rubik font-bold text-[20px] sm:text-[20px] lg:text-[24px] z-10 ">
            {name}
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute px-8 sm:px-12 lg:px-12 w-full h-full rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-sky-400 to-blue-900 p-6 flex flex-col justify-between text-white rotate-y-180 backface-hidden">
          <div>
            <h2 className="font-rubik text-[20.2px] sm:text-xl lg:text-2xl text-center font-bold mt-1 sm:mt-1 lg:mt-1 mb-2 sm:mb-3 lg:mb-3">
              {name}
            </h2>
            <ul className="font-raleway text-[13.6px] sm:text-base lg:text-base list-disc list-outside space-y-1 text-md text-gray-100 mt-5 -mb-2">
              {details.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="self-end flex items-center gap-4 mr-[-20px] mt-5 py-2 px-4">
            {/* GitHub Link */}
            {githubLink && githubLink !== "#" && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                title="View GitHub Profile"
                className="text-gray-200 hover:text-white transition-all duration-200"
              >
                <FaGithub className="h-7 w-7 transition-transform duration-200 hover:scale-110 active:scale-95" />
              </a>
            )}

            {/* Portfolio Link */}
            {hasActivePortfolioLink ? (
              // If the link is active, render a clickable <a> tag
              <a
                href={portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                title="View Portfolio"
                className="text-gray-200 hover:text-white transition-all duration-200"
              >
                <ArrowTopRightOnSquareIcon className="h-7 w-7 transition-transform duration-200 hover:scale-110 active:scale-95" />
              </a>
            ) : (
              // If the link is a placeholder, render a disabled-looking <span>
              <span
                title="Portfolio not available"
                className="cursor-not-allowed opacity-40"
              >
                <ArrowTopRightOnSquareIcon className="h-7 w-7" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
