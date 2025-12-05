import { FC } from "react";
import Image from "next/image";

interface AdvisorCardProps {
  name: string;
  position: string;
  year: string;
  imageUrl: string;
}

const AdvisorCard: FC<AdvisorCardProps> = ({
  name,
  position,
  year,
  imageUrl,
}) => {
  return (
    <div className="relative w-full h-full rounded-[1.25rem] shadow-lg">
      {/* Gradient border layer */}
      <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-b from-primary1/60 to-primary2/60 p-[2px]">
        {/* Content layer */}
        <div className="relative w-full h-full rounded-[1.1rem] overflow-hidden bg-primary3 text-white cursor-pointer group">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 font-raleway text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/80">
            {year}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 h-1/2 sm:h-2/5 bg-gradient-to-t from-[#002231] via-[#002231e6] to-transparent flex flex-col justify-end">
            <h3 className="font-rubik text-xl sm:text-2xl font-bold leading-tight break-words">
              {name}
            </h3>
            <p className="font-raleway text-sm sm:text-base uppercase tracking-wider text-white/80 mt-1 sm:mt-2 break-words">
              {position}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorCard;
