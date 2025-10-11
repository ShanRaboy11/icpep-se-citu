"use client";
import Image from "next/image";

interface TestimonialCardProps {
  name: string;
  title: string;
  imageSrc: string;
  testimonial: string;
}

export default function TestimonialCard({
  name,
  title,
  imageSrc,
  testimonial,
}: TestimonialCardProps) {
  return (
    <div className="relative flex flex-col items-center text-center bg-gradient-to-b from-[#cde4fa] to-[#a9d3f9] rounded-3xl shadow-md p-6 sm:p-8 max-w-md w-full mx-auto transition-transform duration-200 cursor-default">
      {/* Profile Image */}
      <div className="absolute -top-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
        <Image
          src={imageSrc}
          alt={name}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Spacer for image */}
      <div className="mt-12" />

      {/* Testimonial text */}
      <p className="font-raleway text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed mt-2 px-2">
        {testimonial}
      </p>

      {/* Name and title */}
      <h3 className="font-rubik mt-5 font-bold text-primary3 text-base sm:text-lg md:text-xl">
        {name}
      </h3>
      <p className="font-raleway text-primary3 font-medium text-sm sm:text-base opacity-90">
        {title}
      </p>
    </div>
  );
}
