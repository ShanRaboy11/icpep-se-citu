import { FC } from "react";
import FallbackImage from "@/app/components/fallback-image";
import { placeholderPhoto } from "@/app/utils/placeholder-photo";

interface AdvisorCardProps {
  name: string;
  position: string;
  year: string;
  imageUrl: string;
}

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E\")";

const AdvisorCard: FC<AdvisorCardProps> = ({
  name,
  position,
  year,
  imageUrl,
}) => {
  const isPlaceholder = imageUrl.startsWith("/placeholders/");

  return (
    <div className="group relative isolate h-full w-full cursor-default overflow-hidden rounded-[1.25rem] shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-blue-500/40">
      <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-sky-400 transition-transform duration-1000 group-hover:scale-105" />

      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-black/10" />

      {isPlaceholder ? (
        <>
          <div className="absolute bottom-0 left-1/2 h-[75%] w-[110%] -translate-x-1/2 rounded-t-full bg-white/20 backdrop-blur-sm" />
          <div className="absolute bottom-0 left-1/2 h-[95%] w-[130%] -translate-x-1/2">
            <FallbackImage
              src={imageUrl}
              fallback={placeholderPhoto(name)}
              alt={name}
              fill
              className="object-contain object-bottom drop-shadow-2xl"
            />
          </div>
        </>
      ) : (
        <FallbackImage
          src={imageUrl}
          fallback={placeholderPhoto(name)}
          alt={name}
          fill
          className="object-cover object-top transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/85 via-black/45 to-transparent" />

      <div className="absolute left-4 top-4 font-raleway text-xs font-semibold uppercase tracking-wider text-white sm:left-6 sm:top-6 sm:text-sm">
        {year}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8">
        <h3 className="wrap-break-words font-rubik text-xl font-bold leading-tight text-white drop-shadow-md sm:text-2xl">
          {name}
        </h3>
        <p className="wrap-break-words mt-1 font-raleway text-sm uppercase tracking-wider text-white/90 sm:mt-2 sm:text-base">
          {position}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-1 ring-inset ring-white/20" />
    </div>
  );
};

export default AdvisorCard;
