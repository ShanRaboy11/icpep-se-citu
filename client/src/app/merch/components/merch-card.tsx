"use client";

import { ShoppingBag } from "lucide-react";
import type { FC } from "react";
import Link from "next/link";

type MerchStatus = "Available" | "Coming Soon" | "Sold Out";

interface MerchCardProps {
  name: string;
  price: string;
  description: string;
  status: MerchStatus;
  buyLink?: string;
}

const MerchCard: FC<MerchCardProps> = ({
  name,
  price,
  description,
  status,
  buyLink,
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case "Coming Soon":
        return { overlayText: "Coming Soon", showOverlay: true };
      case "Sold Out":
        return { overlayText: "Sold Out", showOverlay: true };
      default:
        return { overlayText: "", showOverlay: false };
    }
  };

  const { overlayText, showOverlay } = getStatusInfo();
  const isAvailable = status === "Available";

  return (
    <Link
      href={isAvailable ? buyLink || "#" : "#"}
      onClick={(e) => !isAvailable && e.preventDefault()}
      className={`group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:shadow-primary1/40 hover:-translate-y-1 overflow-hidden h-full ${
        !isAvailable ? "cursor-default" : "cursor-pointer"
      }`}
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden rounded-t-2xl">
        <img
          src="/gle.png"
          alt={name}
          className={`absolute inset-0 h-full w-full object-cover rounded-t-2xl transition-transform duration-300 ${
            isAvailable ? "group-hover:scale-105" : "group-hover:scale-105"
          }`}
          loading="lazy"
        />
        {showOverlay && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-2xl">
            <span className="bg-slate-900 text-white px-4 py-2 rounded-full font-semibold font-raleway">
              {overlayText}
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

        <p className="font-raleway text-gray-600 mb-4 text-sm flex-grow">
          {description}
        </p>

        {/* Button */}
        <div className="relative mt-auto w-full h-[48px] font-rubik font-semibold text-base overflow-hidden rounded-lg">
          {!isAvailable ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500 select-none">
              <span>{status}</span>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 h-full w-[calc(100%-56px)] rounded-lg bg-primary1 text-white flex items-center transform group-hover:translate-x-[56px] transition-transform duration-500 ease-out">
                <span className="px-5 text-left w-full">Buy Merch</span>
              </div>
              <div className="absolute top-0 right-0 h-full w-[48px] rounded-lg bg-primary1 text-white flex items-center justify-center transform group-hover:translate-x-[56px] transition-transform duration-500 ease-out overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-black/10">
                  <ShoppingBag size={18} />
                </div>
              </div>
              <div className="absolute top-0 left-0 h-full w-[48px] rounded-lg bg-primary1 text-white flex items-center justify-center transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-black/10">
                  <ShoppingBag size={18} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MerchCard;
