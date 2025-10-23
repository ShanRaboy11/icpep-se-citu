"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Code, PenTool, BrainCircuit, Users } from "lucide-react";

const Hero = () => {
  const router = useRouter();

  // Reusable rectangular skill box
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
      className={`absolute flex items-center gap-2 rounded-lg border border-gray-200/50 bg-white/70 px-4 py-2.5 shadow-md backdrop-blur-md ${className}`}
    >
      <div className="text-primary1">{icon}</div>
      <span className="font-raleway text-[15px] font-semibold text-primary3">
        {text}
      </span>
    </div>
  );

  return (
    <section className="hero-themed-background relative min-h-screen flex items-center justify-center overflow-hidden -mt-16 z-0">
      {/* Floating skill boxes */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <SkillBox
          icon={<Code size={20} />}
          text="Programming"
          className="top-[15%] left-[5%] md:top-1/3 md:left-1/4 animate-float-slow"
        />
        <SkillBox
          icon={<PenTool size={20} />}
          text="UI/UX Design"
          className="top-[20%] right-[5%] md:top-1/3 md:right-1/4 animate-float-medium"
        />
        <SkillBox
          icon={<BrainCircuit size={20} />}
          text="Arduino"
          className="bottom-[20%] left-[8%] md:bottom-1/3 md:left-1/3 animate-float-fast"
        />
        <SkillBox
          icon={<Users size={20} />}
          text="COMPanions"
          className="bottom-[15%] right-[8%] md:bottom-1/3 md:right-1/3 animate-float-slow"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="inline-block bg-buttonbg1 border border-primary1/30 rounded-full px-6 py-2">
            <p className="text-primary1 text-sm font-raleway font-medium tracking-wide">
              Welcome to the community
            </p>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-rubik font-bold mb-4 leading-tight">
          <span className="bg-gradient-to-r from-black via-primary1 to-black bg-clip-text text-transparent animate-gradient-flow">
            ICpEP SE CIT-U Chapter
          </span>
        </h1>

        <p className="text-lg md:text-2xl font-raleway text-bodytext mb-6 max-w-2xl mx-auto leading-relaxed">
          Unlocking Potential, One Bit at a Time
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            className="bg-primary1 hover:bg-primary2 text-white font-raleway font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Join Community
          </button>
          <button
            onClick={() => {
              const aboutSection = document.getElementById("about");
              if (aboutSection) {
                const yOffset = -80;
                const y =
                  aboutSection.getBoundingClientRect().top +
                  window.pageYOffset +
                  yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
            }}
            className="bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-buttonbg1 hover:border-primary1 hover:text-primary1 font-raleway font-semibold px-8 py-3 rounded-full transition-all duration-300 cursor-pointer"
          >
            Learn More
          </button>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-lg">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-rubik font-bold text-primary1 mb-1">
                200+
              </div>
              <div className="text-sm font-raleway text-bodytext">
                Active Members
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-rubik font-bold text-primary1 mb-1">
                15+
              </div>
              <div className="text-sm font-raleway text-bodytext">
                Events Hosted
              </div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-2xl md:text-3xl font-rubik font-bold text-primary1 mb-1">
                8
              </div>
              <div className="text-sm font-raleway text-bodytext">
                Years Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
