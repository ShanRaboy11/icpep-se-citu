"use client";

import type { FC } from "react";
import Image from "next/image";
import { ShoppingBag, Eye } from "lucide-react";

interface MerchandiseCardProps {
  name: string;
  price: string;
  imageUrl: string;
  availableSizes?: string[];
  onClick?: () => void;
}

export const MerchandiseCard: FC<MerchandiseCardProps> = ({
  name,
  price,
  imageUrl,
  availableSizes = [],
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group cursor-pointer"
    >
      <div className="relative h-35 w-full overflow-hidden bg-slate-50">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/gle.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white/90 backdrop-blur-sm text-primary1 text-xs font-semibold font-raleway shadow">
          <Eye className="h-3 w-3" />
          View
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h5 className="font-rubik text-sm font-bold text-slate-800 truncate group-hover:text-primary1 transition-colors duration-300">
          {name}
        </h5>


        <div className="mt-3 flex items-center justify-between">
          <span className="font-rubik text-base font-bold text-primary3">
            {price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MerchandiseCard;
