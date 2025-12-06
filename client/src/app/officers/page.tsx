"use client";

import { FC } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Imports from your components structure
import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";

// Reusable card component
interface SelectionCardProps {
  title: string;
  gradient: string;
  shadowColorClass: string;
  onClick: () => void;
}

const SelectionCard: FC<SelectionCardProps> = ({
  title,
  gradient,
  shadowColorClass,
  onClick,
}) => {
  return (
    // Outer wrapper
    <div
      className={`
        relative w-full h-48 sm:h-80 rounded-3xl
        shadow-lg 
        transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:scale-[1.02]
        ${shadowColorClass}
        group cursor-default
      `}
      onClick={onClick}
    >
      {/* Inner container */}
      <div
        className={`relative w-full h-full rounded-3xl ${gradient} flex items-center justify-center overflow-hidden`}
      >
        {/* Button */}
        <button
          className="absolute z-10 top-4 left-4 h-10 w-10 sm:top-8 sm:left-8 sm:h-16 sm:w-16 border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:backdrop-blur-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
          aria-label={`View ${title}`}
        >
          <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
        </button>

        {/* Visible Title */}
        <span className="font-rubik font-bold text-3xl sm:text-5xl text-white drop-shadow-md z-0 pointer-events-none">
          {title}
        </span>
      </div>
    </div>
  );
};

const OfficerSelectionPage: FC = () => {
  const router = useRouter();

  const pillText = "Department Selection";
  const title = "Select Department";
  const subtitle =
    "Please select a category to view the student leaders dedicated to serving our chapter.";

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Background Grid Animation */}
      <Grid />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="flex-grow">
          {/* Main Content Container */}
          <div className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem]">
            
            {/* Title Section */}
            <div className="mb-20 text-center">
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

            {/* Cards Grid */}
            <section className="w-full max-w-4xl mx-auto flex flex-col gap-8 mb-24">
              
              {/* Council Card */}
              <SelectionCard
                title="Council"
                gradient="bg-gradient-to-br from-blue-600 to-cyan-500"
                shadowColorClass="hover:shadow-blue-600/40" 
                onClick={() => router.push("/council-list")}
              />

              {/* Committees Card */}
              <SelectionCard
                title="Committees"
                gradient="bg-gradient-to-br from-purple-700 to-pink-500"
                shadowColorClass="hover:shadow-purple-600/40" 
                onClick={() => router.push("/committee-list")}
              />
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default OfficerSelectionPage;