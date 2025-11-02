"use client";

import { CheckCircle2, ShoppingBag } from "lucide-react";
import type { FC } from "react";
import Image from "next/image";

interface MerchCardProps {
  name: string;
  imageSrc: string;
  price: string;
  description: string;
  features: string[];
  buyLink: string;
  isAvailable: boolean;
}

const MerchCard: FC<MerchCardProps> = ({
  name,
  imageSrc,
  price,
  description,
  features,
  buyLink,
  isAvailable,
}) => {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden h-full">
      {/* Image */}
      <div className="relative w-full aspect-square bg-slate-100">
        <Image src={imageSrc} alt={name} fill className="object-cover" />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-slate-900 text-white px-4 py-2 rounded-full font-semibold font-raleway">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-rubik font-bold text-xl text-primary3">{name}</h3>
          <span className="font-rubik font-semibold text-lg text-primary1 whitespace-nowrap ml-4">
            {price}
          </span>
        </div>
        <p className="font-raleway text-gray-600 mb-4 text-sm">{description}</p>

        {/* Features */}
        <ul className="space-y-2 font-raleway text-gray-700 flex-grow mb-6 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary1" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Buy Button */}
        <a
          href={isAvailable ? buyLink : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            mt-auto w-full rounded-lg py-3 font-rubik font-semibold text-base flex items-center justify-center gap-2
            transform transition-all duration-300 cursor-pointer
            ${
              isAvailable
                ? "bg-primary1 text-white hover:bg-primary2"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }
          `}
        >
          <ShoppingBag size={18} />
          <span>{isAvailable ? "Buy Now" : "Unavailable"}</span>
        </a>
      </div>
    </div>
  );
};

export default MerchCard;
