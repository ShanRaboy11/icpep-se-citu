import { FC } from "react";
import { ChevronRight } from "lucide-react";

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

export default SelectionCard;
