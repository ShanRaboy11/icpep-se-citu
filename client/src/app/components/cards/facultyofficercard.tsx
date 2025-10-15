'use client';

import Image from 'next/image';
import { useState } from 'react';

interface FacultyOfficerCardProps {
  name: string;
  title: string;
  image: string;
  onClick?: () => void;
}

export default function FacultyOfficerCard({
  name,
  title,
  image,
  onClick,
}: FacultyOfficerCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`relative flex items-center justify-start overflow-hidden rounded-2xl bg-buttonbg1 cursor-pointer border-2 shadow-md transition-all duration-500 ease-in-out
        ${hovered ? 'w-[450px] border-primary1 shadow-xl' : 'w-[150px] border-buttonbg1'}`}
      style={{ height: '280px' }}
    >
      {/* Background Logo */}
      <Image
  src="/icpep logo.png"
  alt="ICPEP Logo"
  width={300}
  height={300}
  className={`absolute -mt-50 -ml-6 transition-opacity duration-700 ease-in-out pointer-events-none transform-none ${
    hovered ? 'opacity-10' : 'opacity-0'
  }`}
/>

      {/* Image */}
      <div
        className={`flex-shrink-0 transform transition-transform duration-500 ${
          hovered ? 'translate-x-4 scale-105' : 'translate-x-0 scale-100'
        }`}
      >
        <Image
          src={image}
          alt={name}
          width={200}
          height={300}
          className="rounded-xl -mb-10 sm:-mb-5 object-cover h-[300px] w-[200px] sm:h-[320px] sm:w-[220px]"
        />
      </div>

      {/* Info Text */}
      <div
        className={`absolute right-6 px-6 py-4 rounded-xl text-right max-w-[220px] transition-all duration-500 ease-in-out ${
          hovered
            ? 'opacity-100 translate-x-0 backdrop-blur-sm bg-white/10'
            : 'opacity-0 translate-x-4'
        }`}
      >
        <h3 className="whitespace-nowrap font-rubik text-2xl font-bold text-black drop-shadow-sm">
          {title}
        </h3>
        <p className="font-raleway text-lg text-gray-800 leading-tight">{name}</p>
      </div>
    </div>
  );
}
