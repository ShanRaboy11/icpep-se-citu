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
  paddingClass = "px-4 sm:px-6 pt-12 sm:pt-16 pb-6",
}) => {
  return (
    <div
      className={`
        relative w-full rounded-3xl
        shadow-lg 
        ${shadowColorClass} ${className}
        group overflow-hidden isolate
        cursor-default
      `}
    >
      {/* 1. Base Gradient Background */}
      {/* Kept background zoom for life, but card stays still */}
      <div className={`absolute inset-0 ${gradient} transition-transform duration-1000 group-hover:scale-105`} />

      {/* 2. Texture: Grainy Noise */}
      <div 
        className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none z-0"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` 
        }}
      />

      {/* 3. Lighting: Soft Sheen from top-left */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none z-0" />

      {/* 4. Glassy Inner Border */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none z-20" />

      {/* Content Container */}
      <div className={`relative w-full h-full flex items-center justify-center ${paddingClass} z-10`}>
        
        {/* Button Icon 
            - bg-transparent: No whitish highlight initially
            - hover:bg-white/20: Highlights only on hover
            - Removed all scale/transform animations
            - Only this element has cursor-pointer
        */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="
            absolute top-4 left-4 h-10 w-10 sm:top-6 sm:left-6 sm:h-14 sm:w-14 
            border border-white/30 
            bg-transparent 
            rounded-full flex items-center justify-center text-white 
            transition-colors duration-300 
            shadow-sm z-30 cursor-pointer 
            hover:bg-white/20
          "
          aria-label={`View ${title}`}
        >
          <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
        </button>

        {/* Title Text */}
        <span className="font-rubik font-bold text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-lg text-center leading-tight tracking-tight break-words max-w-full sm:max-w-[90%] pointer-events-none">
          {title}
        </span>
      </div>
    </div>
  );
};

export default SelectionCard;