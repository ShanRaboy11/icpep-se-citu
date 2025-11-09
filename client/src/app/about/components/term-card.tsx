// app/about/components/OfficerTermCard.tsx
import { FC } from "react";
import ProfileCard from "./profile-card";

interface Profile {
  name: string;
  position: string;
  imageUrl: string;
}

interface OfficerTermCardProps {
  term: string;
  council: Profile[];
  committees: Profile[];
}

const OfficerTermCard: FC<OfficerTermCardProps> = ({
  term,
  council,
  committees,
}) => (
  <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md">
    <h3 className="font-rubik text-2xl font-bold text-primary1 text-center mb-10">
      {term}
    </h3>

    {/* Council Officers */}
    <div>
      <h4 className="font-raleway text-lg font-semibold text-gray-700 mb-6 text-center uppercase tracking-widest">
        Executive Council
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {council.map((officer) => (
          <ProfileCard key={officer.name} {...officer} />
        ))}
      </div>
    </div>

    {/* Divider */}
    <hr className="my-12 border-gray-200" />

    {/* Committee Heads */}
    <div>
      <h4 className="font-raleway text-lg font-semibold text-gray-700 mb-6 text-center uppercase tracking-widest">
        Committee Heads
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {committees.map((officer) => (
          <ProfileCard key={officer.name} {...officer} />
        ))}
      </div>
    </div>
  </div>
);

export default OfficerTermCard;
