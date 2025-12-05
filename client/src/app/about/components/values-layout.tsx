"use client";

import { FC } from "react";
import Image from "next/image";
import { SectionType } from "../utils/types";

const ValuesLayout: FC<{ section: SectionType }> = ({ section }) => {
  const coreValues = [
    {
      name: "Integrity",
      iconUrl: "/integrity.png",
      position: "top-[15%] left-[8%] md:top-0 md:left-[-15%]",
      animationClass: "animate-pulse-subtle",
    },
    {
      name: "Passion",
      iconUrl: "/passion.png",
      position: "top-[-5%] right-[10%] md:top-[-10%] md:right-[-5%]",
      animationClass: "animate-pulse-subtle",
    },
    {
      name: "Excellence",
      iconUrl: "/excellence.png",
      position:
        "top-[54%] -translate-y-1/2 right-[0%] md:top-1/2 md:right-[-25%]",
      animationClass: "animate-pulse-subtle",
    },
    {
      name: "Collaboration",
      iconUrl: "/collaboration.png",
      position: "bottom-[-6%] right-[8%] md:bottom-[-20%] md:right-[10%]",
      animationClass: "animate-pulse-subtle",
    },
    {
      name: "Service",
      iconUrl: "/service.png",
      position: "bottom-[8%] left-[-5%] md:bottom-[10%] md:left-[-20%]",
      animationClass: "animate-pulse-subtle",
    },
  ];

  return (
    <div className="content-fade grid md:grid-cols-2 gap-8 md:gap-24 items-start">
      <div className="relative w-full max-w-[18rem] sm:max-w-sm mx-auto h-64 sm:h-96 group order-last md:order-first mt-4 md:mt-0">
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 z-0 opacity-70 md:hidden"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M200 200 H 170 V 80 H 110"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary2"
          />
          <circle
            cx="110"
            cy="80"
            r="4"
            fill="currentColor"
            className="text-secondary2 static-glow"
          />

          <path
            d="M200 200 H 250 V 20 H 280"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary2"
          />
          <circle
            cx="280"
            cy="20"
            r="4"
            fill="currentColor"
            className="text-secondary2 static-glow"
          />

          <path
            d="M200 200 H 260 V 182 H 320"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary2"
          />
          <circle
            cx="320"
            cy="182"
            r="4"
            fill="currentColor"
            className="text-secondary2 static-glow"
          />

          <path
            d="M200 200 H 235 V 320 H 290"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary2"
          />
          <circle
            cx="290"
            cy="320"
            r="4"
            fill="currentColor"
            className="text-secondary2 static-glow"
          />

          <path
            d="M200 200 H 185 V 280 H 60"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary2"
          />
          <circle
            cx="60"
            cy="280"
            r="4"
            fill="currentColor"
            className="text-secondary2 static-glow"
          />
        </svg>

        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 z-0 opacity-70 hidden md:block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M200 200 H 170 V 70 H 60"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary2"
          />
          <circle
            cx="60"
            cy="70"
            r="4"
            fill="currentColor"
            className="text-secondary2 static-glow"
          />

          <path
            d="M200 200 H 250 V 30 H 300"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary2"
          />
          <circle
            cx="300"
            cy="30"
            r="4"
            fill="currentColor"
            className="text-secondary2 static-glow"
          />

          <path
            d="M200 200 H 380"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary2"
          />
          <circle
            cx="380"
            cy="200"
            r="4"
            fill="currentColor"
            className="text-secondary2 static-glow"
          />

          <path
            d="M200 200 H 230 V 320 H 330 V 360"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary2"
          />
          <circle
            cx="330"
            cy="360"
            r="4"
            fill="currentColor"
            className="text-secondary2 static-glow"
          />

          <path
            d="M200 200 H 150 V 300 H 40"
            stroke="currentColor"
            strokeWidth="2"
            className="text-secondary2"
          />
          <circle
            cx="40"
            cy="300"
            r="4"
            fill="currentColor"
            className="text-secondary2 static-glow"
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-48 sm:h-48 z-10">
          <Image
            src="/icpep logo.png"
            alt="ICpEP Logo"
            fill
            className="object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
          />
        </div>

        {coreValues.map((value) => (
          <div
            key={value.name}
            className={`absolute ${value.position} ${value.animationClass} z-20
              w-16 h-16 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5
              flex flex-col items-center justify-center gap-1 sm:gap-2 p-1 sm:p-4
              transition-colors duration-300 hover:bg-white/10`}
            style={{
              backgroundImage:
                "radial-gradient(circle, transparent 1px, rgba(255,255,255,0.05) 1px)",
              backgroundSize: "1rem 1rem",
            }}
          >
            <div className="relative w-6 h-6 sm:w-14 sm:h-14">
              <Image
                src={value.iconUrl}
                alt={value.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="font-rubik font-semibold text-white text-center text-[9px] sm:text-base leading-tight">
              {value.name}
            </span>
          </div>
        ))}
      </div>

      <div className="text-left md:text-left md:pt-8">
        <h3 className="font-rubik text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-secondary2">
          {section.title}
        </h3>
        <p className="font-raleway text-sm sm:text-xl leading-relaxed text-gray-300">
          {section.content}
        </p>
      </div>
    </div>
  );
};

export default ValuesLayout;
