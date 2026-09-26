"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Code, PenTool, BrainCircuit, Users } from "lucide-react";
import Button from "../../components/button";

const STATS = [
  { value: "200+", label: "Active Members" },
  { value: "15+", label: "Events Hosted" },
  { value: "8", label: "Years Active" },
];

const SkillBox = ({
  icon,
  text,
  className,
}: {
  icon: React.ReactNode;
  text: string;
  className: string;
}) => (
  <div
    className={`absolute flex items-center gap-1.5 rounded-lg border border-gray-200/50 bg-white/70 px-2.5 py-1.5 shadow-md backdrop-blur-md sm:gap-2 sm:px-4 sm:py-2.5 ${className}`}
  >
    <div className="text-primary1">{icon}</div>
    <span className="font-raleway text-xs font-semibold text-primary3 sm:text-[15px]">
      {text}
    </span>
  </div>
);

const Hero = () => {
  const router = useRouter();

  return (
    <section className="light-dark-background relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
      {/* grid-paper backdrop, brand-blue and faded at the bottom so it
          blends into the section below instead of cutting off */}
      <div className="interactive-grid-fade pointer-events-none absolute inset-0 z-0" />

      {/* floating skill pills — a fixed gutter from the edge (not a
          percentage) so they never clip on a narrow phone, pulled in just
          enough to sit near the content without covering it */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        <SkillBox
          icon={<Code size={16} />}
          text="Programming"
          className="top-[15%] left-3 md:top-1/3 md:left-[8%] animate-float-slow"
        />
        <SkillBox
          icon={<PenTool size={16} />}
          text="UI/UX Design"
          className="top-[15%] right-3 md:top-[24%] md:right-[8%] animate-float-medium"
        />
        <SkillBox
          icon={<BrainCircuit size={16} />}
          text="Arduino"
          className="bottom-[15%] left-3 md:bottom-1/4 md:left-[10%] animate-float-fast"
        />
        <SkillBox
          icon={<Users size={16} />}
          text="COMPanions"
          className="bottom-[15%] right-3 md:bottom-1/4 md:right-[10%] animate-float-slow"
        />
      </div>

      <div className="relative z-20 mx-auto -mt-6 flex w-full max-w-5xl flex-col items-center px-4 py-24 text-center sm:-mt-10 sm:py-32">
        <div className="group relative mb-6 h-20 w-20 sm:h-28 sm:w-28">
          <Image
            src="/brand/icpep-logo.png"
            alt="ICpEP Logo"
            fill
            priority
            className="object-contain drop-shadow-[0_15px_25px_rgba(0,53,153,0.3)] transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1">
          <span className="font-raleway text-sm font-semibold text-primary1">
            ICpEP.SE · Region 7 · CIT-U Chapter
          </span>
        </div>

        <h1 className="font-rubik text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="block text-primary1">Unlocking Potential,</span>
          <span className="block text-secondary1">One Bit at a Time</span>
        </h1>

        <p className="mt-6 max-w-2xl font-raleway text-base text-bodytext sm:text-xl">
          The official chapter of the Institute of Computer Engineers of the
          Philippines — Student Edition, empowering scholars through
          innovation, leadership, and community.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            variant="hero"
            className="group w-64 px-8 py-3 sm:w-auto"
            onClick={() => router.push("/login")}
          >
            <span className="inline-flex items-center gap-2">
              Join Community
              <ChevronRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Button>
          <Button
            variant="heroOutline"
            className="w-64 px-8 py-3 sm:w-auto"
            onClick={() => router.push("/about")}
          >
            Learn More
          </Button>
        </div>

        <div className="mt-16 flex gap-8 sm:gap-16">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-rubik text-2xl font-bold text-primary1 sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 font-raleway text-xs text-bodytext sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
