'use client';
import Image from 'next/image';

interface FacultyCardProps {
  name: string;
  position: string;
  image?: string;
  onClick?: () => void;
}

export default function FacultyCard({
  name,
  position,
  image,
  onClick,
}: FacultyCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-10 flex flex-col items-center text-center cursor-pointer transform hover:-translate-y-1 w-full max-w-xs"
    >
      {/* Officer Image */}
      <div className="w-50 h-50 rounded-full bg-primary1 overflow-hidden mb-4 flex items-center justify-center">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-white text-lg font-semibold">No Img</div>
        )}
      </div>

      {/* Officer Info */}
      <h3 className="font-rubik font-semibold text-gray-900 text-2xl whitespace-nowrap mt-5 mx-10">{name}</h3>
      <p className="font-raleway text-lg text-gray-700 font-medium mt-1">{position}</p>
    </div>
  );
}
