"use client";

import { useState, useEffect, FC, ReactElement } from "react";
import Image from "next/image";
import { Box, Lightbulb, Rocket, Ribbon } from "lucide-react";

interface SectionType {
  id: string;
  tabLabel: string;
  icon: ReactElement;
  title: string;
  content: string;
  imageUrls: string | string[];
}

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
    <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
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

const VisionLayout: FC<{ section: SectionType }> = ({ section }) => {
  const visionPoints = [
    {
      iconUrl: "/rocket.png",
      title: "Fostering Innovators",
      description: "Leading and inspiring technological advancement.",
      sizeClass: "w-3/4 h-3/4",
    },
    {
      iconUrl: "/target.png",
      title: "Ethical Leadership",
      description: "Impacting society with technical prowess and integrity.",
      sizeClass: "w-3/4 h-3/4",
    },
    {
      iconUrl: "/megaphone.png",
      title: "Community Driven",
      description: "Building a collaborative and supportive student network.",
      sizeClass: "w-2/3 h-2/3",
    },
  ];

  return (
    <div className="text-center">
      <div className="max-w-3xl mx-auto">
        <h3 className="font-rubik text-3xl sm:text-4xl font-bold mb-4 text-secondary2">
          {section.title}
        </h3>
        <p className="font-raleway text-lg sm:text-xl leading-relaxed text-gray-300">
          {section.content}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {visionPoints.map((point, index) => (
          <div key={index} className="text-center group">
            <div
              className="w-full h-40 rounded-2xl overflow-hidden bg-white/5 mb-4 border border-white/10 transition-colors duration-300 group-hover:bg-white/10
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
            <h4 className="font-rubik text-xl font-bold text-white">
              {point.title}
            </h4>
            <p className="font-raleway text-gray-300">{point.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-center">
      <div className="text-left max-w-xs flex-shrink-0">
        <h3 className="font-rubik text-3xl sm:text-4xl font-bold mb-3 text-secondary2">
          {section.title}
        </h3>
        <p className="font-raleway text-base sm:text-lg leading-relaxed text-gray-300">
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

const ValuesLayout: FC<{ section: SectionType }> = ({ section }) => {
  const coreValues = [
    {
      name: "Integrity",
      iconUrl: "/integrity.png",
      position: "top-0 left-[-15%]",
      animationClass: "animate-pulse-subtle",
    },
    {
      name: "Passion",
      iconUrl: "/passion.png",
      position: "top-[-10%] right-[-5%]",
      animationClass: "animate-pulse-subtle",
    },
    {
      name: "Excellence",
      iconUrl: "/excellence.png",
      position: "top-1/2 -translate-y-1/2 right-[-25%]",
      animationClass: "animate-pulse-subtle",
    },
    {
      name: "Collaboration",
      iconUrl: "/collaboration.png",
      position: "bottom-[-20%] right-[10%]",
      animationClass: "animate-pulse-subtle",
    },
    {
      name: "Service",
      iconUrl: "/service.png",
      position: "bottom-[10%] left-[-20%]",
      animationClass: "animate-pulse-subtle",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-start">
      <div className="relative w-full max-w-sm mx-auto h-80 sm:h-96 group">
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 z-0 opacity-70"
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

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-48 sm:h-48 z-10">
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
              w-32 h-32 rounded-2xl border border-white/10 bg-white/5
              flex flex-col items-center justify-center gap-2 p-4
              transition-colors duration-300 hover:bg-white/10`}
            style={{
              backgroundImage:
                "radial-gradient(circle, transparent 1px, rgba(255,255,255,0.05) 1px)",
              backgroundSize: "1rem 1rem",
            }}
          >
            <div className="relative w-14 h-14">
              <Image
                src={value.iconUrl}
                alt={value.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="font-rubik font-semibold text-white text-center text-base">
              {value.name}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center md:text-left md:pt-8">
        <h3 className="font-rubik text-3xl sm:text-4xl font-bold mb-4 text-secondary2">
          {section.title}
        </h3>
        <p className="font-raleway text-lg sm:text-xl leading-relaxed text-gray-300">
          {section.content}
        </p>
      </div>
    </div>
  );
};

const sections: SectionType[] = [
  {
    id: "org",
    tabLabel: "ICpEP SE CIT-U",
    icon: <Box size={22} />,
    title: "Engineered for Impact",
    content:
      "The Institute of Computer Engineers of the Philippines (ICpEP) Student Edition at Cebu Institute of Technology-University is a dynamic student body dedicated to the holistic development of future computer engineers.",
    imageUrls: ["/gle.png", "/meeting.png", "/whyicpep.png"],
  },
  {
    id: "vision",
    tabLabel: "Vision",
    icon: <Lightbulb size={22} />,
    title: "Leading Innovation Forward",
    content:
      "To be a community-driven center of excellence in computer engineering, fostering innovators who lead technological advancement and are recognized for their technical prowess and ethical leadership.",
    imageUrls: "/gle.png",
  },
  {
    id: "mission",
    tabLabel: "Mission",
    icon: <Rocket size={22} />,
    title: "Empowering Change-Makers",
    content:
      "To provide holistic development for students through academic support, skills training, and community engagement, preparing them to be globally competent professionals who can solve complex problems.",
    imageUrls: "/gle.png",
  },
  {
    id: "values",
    tabLabel: "Core Values",
    icon: <Ribbon size={22} />,
    title: "Values That Inspire",
    content:
      "We uphold a steadfast commitment and a passion for technology, collaborating to achieve excellence and serve our community, turning innovative ideas into impactful realities.",
    imageUrls: "/gle.png",
  },
];

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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {sections.map((section, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={section.id}
              onClick={() => setActiveIndex(index)}
              className={`group w-full relative overflow-hidden flex items-center gap-3 p-2 rounded-xl text-left transition-all duration-300
          cursor-pointer
          ${
            isActive
              ? "bg-gradient-to-br from-primary3 to-secondary1 shadow-md"
              : "bg-white border-2 border-secondary3 text-black hover:bg-gradient-to-br hover:from-primary3/85 hover:to-secondary1/85"
          }`}
            >
              {isActive && (
                <div
                  key={activeIndex}
                  className="absolute left-0 top-0 bottom-0 h-full bg-white/20 animate-progress"
                  style={{ animationDuration: `${TAB_DURATION}ms` }}
                />
              )}
              <div
                className={`relative z-10 flex-shrink-0 p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-secondary2"
                    : "bg-secondary3/10 text-secondary2"
                }`}
              >
                {section.icon}
              </div>
              <span
                className={`relative z-10 font-raleway text-sm font-semibold ${
                  isActive
                    ? "text-gray-300"
                    : "text-black group-hover:text-gray-100"
                }`}
              >
                {section.tabLabel}
              </span>
            </button>
          );
        })}
      </div>

      <section
        className="rounded-3xl mt-8 bg-gradient-to-br from-primary3 to-secondary1
    px-10 sm:px-16 py-16 sm:py-20 shadow-2xl text-white flex flex-col justify-center min-h-[40rem]"
      >
        <div key={activeIndex} className="animate-fade-in">
          {activeSection.id === "vision" ? (
            <VisionLayout section={activeSection} />
          ) : activeSection.id === "mission" ? (
            <MissionLayout section={activeSection} />
          ) : activeSection.id === "values" ? (
            <ValuesLayout section={activeSection} />
          ) : activeSection.id === "org" ? (
            <OrgLayout section={activeSection} />
          ) : (
            <OrgLayout section={activeSection} />
          )}
        </div>
      </section>
    </>
  );
};

export default InfoSection;
