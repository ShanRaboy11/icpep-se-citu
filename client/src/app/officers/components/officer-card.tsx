import React, { FC } from "react";
import Image from "next/image";

interface OfficerCardProps {
  position: string;
  role?: string;
  name: string;
  image?: string;
  gradient: string;
  shadow: string;
}

const OfficerCard: FC<OfficerCardProps> = ({
  position,
  role,
  name,
  image,
  gradient,
  shadow,
}) => {
  const nameParts = name.includes(",") ? name.split(",") : [name, ""];
  const lastName = nameParts[0].trim();
  const firstName = nameParts[1] ? nameParts[1].trim() : "";

  return (
    <div
      className={`
        relative w-full aspect-[3/4] 
        max-w-[280px]
        rounded-2xl sm:rounded-3xl 
        shadow-lg 
        ${shadow} 
        group overflow-hidden isolate
        cursor-default
        transition-all duration-300 ease-out hover:scale-[1.02]
        flex flex-col
      `}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 ${gradient} transition-transform duration-1000 group-hover:scale-105`}
      />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Lighting Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none z-0" />

      {/* Glass Border */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none z-20" />

      {/* Content */}
      <div className="relative w-full h-full flex flex-col z-10">
        
        <div className="pt-4 px-2 sm:pt-6 sm:px-4 z-20">
          <h2 className="font-rubik text-xs sm:text-2xl font-bold uppercase leading-tight tracking-tight text-white drop-shadow-md text-center">
            {position}
          </h2>
          {role && (
            <p className="font-rubik text-[0.6rem] sm:text-base font-medium uppercase mt-0.5 sm:mt-1 opacity-90 tracking-widest text-white text-center">
              {role}
            </p>
          )}
        </div>

        <div className="relative flex-grow mt-1 sm:mt-2 w-full">
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-[90%] bg-white/20 rounded-t-full backdrop-blur-sm z-0" />

          {image && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[110%] z-10">
              <Image
                src={image}
                alt={name}
                fill
                className="object-contain object-bottom drop-shadow-2xl"
              />
            </div>
          )}
        </div>

        <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 text-left z-20">
          <h3 className="font-raleway text-base sm:text-2xl font-bold leading-none text-white drop-shadow-md">
            {lastName},
          </h3>
          <p className="font-raleway text-xs sm:text-lg font-medium leading-tight opacity-90 text-white">
            {firstName || "Officer"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficerCard;