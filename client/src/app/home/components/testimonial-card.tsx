"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface TestimonialCardProps {
  name: string;
  title: string;
  imageSrc: string;
  testimonial: string;
  position: number;
}

export const TestimonialCard = ({
  name,
  title,
  imageSrc,
  testimonial,
  position,
}: TestimonialCardProps) => {
  const isCenter = position === 0;

  return (
    <div
      className={`relative h-full w-full rounded-3xl p-6 sm:p-8 transition-all duration-500
      ${
        isCenter
          ? "bg-gradient-to-b from-[#cde4fa] to-[#a9d3f9] shadow-xl shadow-primary3/20"
          : "bg-white shadow-lg shadow-gray-400/20"
      }`}
    >
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 -top-12 sm:-top-16 z-20"
        animate={{ scale: isCenter ? 1 : 0.85, y: isCenter ? 0 : 10 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
          <Image src={imageSrc} alt={name} fill className="object-cover" />
        </div>
      </motion.div>

      <div className="relative flex h-full flex-col justify-center text-center pt-12 sm:pt-16">
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-[8rem] sm:text-[12rem] font-bold text-primary1/10 leading-none">
          “
        </div>

        <p className="relative z-10 font-raleway text-base leading-relaxed sm:text-xl text-bodytext px-4 sm:px-8">
          {testimonial}
        </p>

        <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-[8rem] sm:text-[12rem] font-bold text-primary1/10 leading-none">
          ”
        </div>

        <div className="mt-12 sm:mt-16">
          <h3 className="font-rubik text-xl sm:text-2xl font-bold text-primary3">
            {name}
          </h3>
          <p className="font-raleway text-sm sm:text-base font-medium text-primary3/90">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};
