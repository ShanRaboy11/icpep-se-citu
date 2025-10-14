'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface AdminCardProps {
  image: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

const AdminCard: React.FC<AdminCardProps> = ({ image, title, subtitle, onClick }) => {
  return (
    <div
      className="w-full max-w-md bg-sky-100 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 active:scale-95"
    >
      {/* Image section */}
      <div className="relative w-full h-40 sm:h-48 md:h-56">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      {/* Text section */}
      <div className="p-8 flex items-center justify-between px-10">
        <div>
          <h2 className="font-rubik text-lg sm:text-xl font-semibold text-black">
            {title}
          </h2>
          <p className="font-raleway text-gray-700 text-sm sm:text-base">{subtitle}</p>
        </div>

        {/* Arrow Button */}
        <div onClick={onClick}
        className="bg-sky-500 p-3 rounded-full hover:bg-sky-600 transition-all">
          <ArrowRight size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default AdminCard;
