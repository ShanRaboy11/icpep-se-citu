"use client";

import { ShoppingBag, Pencil } from "lucide-react"; // Imported Pencil for visual cue
import type { FC } from "react";
import Link from "next/link";

type MerchStatus = "Available" | "Coming Soon" | "Sold Out";

interface MerchCardProps {
  name: string;
  price: string;
  description: string;
  status: MerchStatus;
  imageSrc: string;
  buyLink?: string;
  edit?: boolean;
  index?: number;
}

const MerchCard: FC<MerchCardProps> = ({
  name,
  price,
  description,
  status,
  imageSrc,
  buyLink,
  edit,
  index = 0,
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

  // LOGIC CHANGE 1: Determine the destination URL
  // If edit is true, go to create page. Otherwise, use buy link or #
  const finalHref = edit ? "/create/merch" : isAvailable ? buyLink || "#" : "#";

  // LOGIC CHANGE 2: Cursor logic
  // If edit is true, it's always a pointer.
  const cursorClass = edit || isAvailable ? "cursor-pointer" : "cursor-default";

  // Calculate delay for the float animation
  const animationStyle = edit ? { animationDelay: `${index * 0.1}s` } : {};

  return (
    <Link
      href={finalHref}
      // LOGIC CHANGE 3: Click Handler
      // If edit is true, allow the click. If false, block click if not available.
      onClick={(e) => {
        if (edit) return; // Allow navigation
        if (!isAvailable) e.preventDefault(); // Block navigation
      }}
      draggable="false"
      style={animationStyle}
      className={`group select-none flex flex-col rounded-2xl border border-slate-200 bg-white shadow-md  transition-all duration-500 ease-in-out hover:shadow-primary1/40 hover:-translate-y-1 overflow-hidden h-full ${cursorClass} ${
        edit ? "edit" : ""
      }`}
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden rounded-t-2xl">
        <img
          src={imageSrc}
          alt={name}
          draggable="false"
          className={`absolute inset-0 h-full w-full object-cover rounded-t-2xl transition-transform duration-300 ${
            isAvailable || edit ? "group-hover:scale-105" : ""
          }`}
          loading="lazy"
        />

        {/* EDIT OVERLAY: Visual cue that this is editable */}
        {edit && (
          <div className="absolute inset-0 bg-primary1/40 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="bg-white text-primary1 p-3 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
              <Pencil size={24} />
            </div>
          </div>
        )}

        {/* Regular Overlay (Sold Out / Coming Soon) - Only show if NOT editing */}
        {!edit && showOverlay && (
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

        {/* Button Area */}
        <div className="relative mt-auto w-full h-[48px] font-rubik font-semibold text-base overflow-hidden rounded-lg">
          {/* If Editing: Show Edit Button */}
          {edit ? (
            <div className="w-full h-full flex items-center justify-center bg-primary1 text-white select-none">
              <span>Edit Item</span>
            </div>
          ) : (
            // If Normal Mode: Show Standard Logic
            <>
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
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MerchCard;
