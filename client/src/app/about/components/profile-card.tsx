"use client";

import { FC } from "react";

interface ProfileCardProps {
  name: string;
  position: string;
  imageUrl: string;
}

const ProfileCard: FC<ProfileCardProps> = ({ name, position, imageUrl }) => {
  return (
    <div className="text-center group">
      <div className="relative inline-block">
        <div className="w-40 h-40 rounded-2xl bg-gray-100 p-2">
          <img
            src={imageUrl}
            alt={`Profile of ${name}`}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
      <h3 className="font-rubik font-bold text-primary3 mt-4 text-lg">
        {name}
      </h3>
      <p className="font-raleway text-gray-500 text-sm">{position}</p>
    </div>
  );
};

export default ProfileCard;
