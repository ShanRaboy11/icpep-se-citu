"use client";

import { FC } from "react";
import { ChevronRight } from "lucide-react";

interface YearCardProps {
  termData: { term: string };
}

const YearCard: FC<YearCardProps> = ({ termData }) => {
  return (
    <div className="h-36 sm:h-72">
      <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary3 to-secondary1 shadow-2xl flex items-center justify-center overflow-hidden">
        <button
          className="absolute top-4 left-4 h-10 w-10 sm:top-8 sm:left-8 sm:h-16 sm:w-16 border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:backdrop-blur-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
          aria-label={`View officers for ${termData.term}`}
        >
          <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
        </button>
        <h3
          className="absolute -bottom-3 -right-4 sm:-bottom-6 sm:-right-8 font-rubik font-black text-[6.8rem] sm:text-[13rem] leading-none text-transparent select-none [-webkit-text-stroke:1px_theme(colors.secondary2)] sm:[-webkit-text-stroke:2px_theme(colors.secondary2)]"
          aria-hidden="true"
        >
          {termData.term.slice(-4)}
        </h3>
      </div>
    </div>
  );
};

export default YearCard;
