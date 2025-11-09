// app/about/components/ProfileCard.tsx
import Image from "next/image";
import { FC } from "react";

interface ProfileCardProps {
  name: string;
  position: string;
  imageUrl: string;
}

const ProfileCard: FC<ProfileCardProps> = ({ name, position, imageUrl }) => (
  <div className="text-center group">
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 border border-gray-200 shadow-sm group-hover:shadow-lg transition-shadow">
      <Image src={imageUrl} alt={name} layout="fill" className="object-cover" />
    </div>
    <h4 className="font-rubik font-bold text-lg text-primary3">{name}</h4>
    <p className="font-raleway text-sm text-gray-500">{position}</p>
  </div>
);

export default ProfileCard;
