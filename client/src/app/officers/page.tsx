"use client";

import { FC } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";

const committeeData = [
  {
    title: "Committee on Internal Affairs",
    slug: "internal-affairs",
    // #00A7EE
    gradient: "bg-gradient-to-br from-[#00A7EE] to-blue-600",
    shadow: "hover:shadow-sky-500/40",
  },
  {
    title: "Committee on External Affairs",
    slug: "external-affairs",
    // #9333ea
    gradient: "bg-gradient-to-br from-[#9333ea] to-purple-900",
    shadow: "hover:shadow-purple-600/40",
  },
  {
    title: "Committee on Finance", 
    slug: "finance",
    // #ca8a04
    gradient: "bg-gradient-to-br from-[#ca8a04] to-yellow-700",
    shadow: "hover:shadow-yellow-600/40",
  },
  {
    title: "Committee on Public Relations",
    slug: "public-relations",
    // #ea580c
    gradient: "bg-gradient-to-br from-[#ea580c] to-red-600",
    shadow: "hover:shadow-orange-600/40",
  },
  {
    title: "Research and Development Committee",
    slug: "research-and-development",
    // #2563eb
    gradient: "bg-gradient-to-br from-[#2563eb] to-indigo-800",
    shadow: "hover:shadow-blue-600/40",
  },
  {
    title: "Training and Seminar Committee", 
    slug: "training-and-seminar",
    // #16a34a
    gradient: "bg-gradient-to-br from-[#16a34a] to-green-800",
    shadow: "hover:shadow-green-600/40",
  },
  {
    title: "Sports and Cultural Committee",
    slug: "sports-and-cultural",
    // #dc2626
    gradient: "bg-gradient-to-br from-[#dc2626] to-red-900",
    shadow: "hover:shadow-red-600/40",
  },
  {
    title: "Media and Documentation Committee",
    slug: "media-and-documentation",
    // #4f46e5
    gradient: "bg-gradient-to-br from-[#4f46e5] to-indigo-900",
    shadow: "hover:shadow-indigo-600/40",
  },
];

interface SelectionCardProps {
  title: string;
  gradient: string;
  shadowColorClass: string;
  onClick: () => void;
  className?: string;
  paddingClass?: string;
}

const SelectionCard: FC<SelectionCardProps> = ({
  title,
  gradient,
  shadowColorClass,
  onClick,
  className = "h-48 sm:h-64", 
  paddingClass = "px-6 pt-12 sm:pt-16 pb-6",
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative w-full rounded-3xl
        shadow-lg 
        transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:scale-[1.02]
        ${shadowColorClass} ${className}
        group cursor-default
      `}
    >
      <div
        className={`relative w-full h-full rounded-3xl ${gradient} flex items-center justify-center overflow-hidden ${paddingClass}`}
      >
        <button
          className="absolute z-10 top-4 left-4 h-10 w-10 sm:top-6 sm:left-6 sm:h-14 sm:w-14 border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:backdrop-blur-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
          aria-label={`View ${title}`}
        >
          <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
        </button>

        <span className="font-rubik font-bold text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-md z-0 pointer-events-none text-center leading-tight">
          {title}
        </span>
      </div>
    </div>
  );
};

const OfficerSelectionPage: FC = () => {
  const router = useRouter();

  const pillText = "Organizational Structure";
  const title = "Council & Committees";
  const subtitle =
    "Select a department to view the officers and members dedicated to serving our chapter.";

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="flex-grow">
          <div className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem]">
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
                <div className="h-2 w-2 rounded-full bg-primary1"></div>
                <span className="font-raleway text-sm font-semibold text-primary1">
                  {pillText}
                </span>
              </div>

              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                {title}
              </h1>

              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
                {subtitle}
              </p>
            </div>

            <section className="w-full max-w-6xl mx-auto flex flex-col gap-8 mb-24">
              
              <div className="w-full">
                <SelectionCard
                  title="Executive Council"
                  gradient="bg-gradient-to-br from-primary3 to-secondary1"
                  shadowColorClass="hover:shadow-primary3/40"
                  className="h-48 sm:h-80" 
                  paddingClass="px-6 pt-12 sm:pt-8 pb-6"
                  onClick={() => router.push("/officers/council")}
                />
              </div>

              <div className="flex items-center gap-4 py-8">
                <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-primary3 to-secondary1 shadow-sm"></div>
                <div className="flex flex-col">
                   <h2 className="text-2xl sm:text-3xl font-rubik font-bold text-primary3 tracking-tight">
                    Committees
                  </h2>
                  <span className="text-xs sm:text-sm font-raleway text-gray-400 font-medium">
                    Departmental Teams
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {committeeData.map((committee) => (
                  <SelectionCard
                    key={committee.slug}
                    title={committee.title}
                    gradient={committee.gradient}
                    shadowColorClass={committee.shadow}
                    onClick={() => router.push(`/officers/${committee.slug}`)}
                  />
                ))}
              </div>

            </section>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default OfficerSelectionPage;