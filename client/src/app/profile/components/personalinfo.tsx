"use client";

import { MembershipBadge } from "./membership";

interface PersonalInformationProps {
  fullName: string;
  idNumber: string;
  yearLevel: string | number;
  email: string;
  membership: "both" | "local" | "regional";
}

export default function PersonalInformation({
  fullName,
  idNumber,
  yearLevel,
  email,
  membership,
}: PersonalInformationProps) {
  return (
    <div className="w-full border border-primary1 rounded-lg p-5 px-7 bg-white shadow-sm">
      <h2 className="text-2xl font-rubik text-black font-semibold mb-4 border-b border-primary1 pb-2">
        Personal Information
      </h2>

      <div className="flex flex-col gap-5 text-sm md:text-base">
        <div className="flex flex-row md:items-center justify-between">
          <span className="text-black font-raleway text-lg">Full Name</span>
          <span className="font-rubik text-black text-lg font-md sm:mr-10">
            {fullName}
          </span>
        </div>

        <div className="flex flex-row md:items-center justify-between">
          <span className="text-black font-raleway text-lg">ID Number</span>
          <span className="font-rubik text-black text-lg font-md sm:mr-10">
            {idNumber}
          </span>
        </div>

        <div className="flex flex-row md:items-center justify-between">
          <span className="text-black font-raleway text-lg">Year Level</span>
          <span className="font-rubik text-black text-lg font-md sm:mr-10">
            {yearLevel}
          </span>
        </div>

        <div className="flex flex-row md:items-center justify-between">
          <span className="text-black font-raleway text-lg">
            Institutional Email
          </span>
          <span className="font-rubik text-black text-lg font-md sm:mr-10">
            {email}
          </span>
        </div>

        <div className="flex flex-row md:items-center justify-between">
          <span className="text-black font-raleway text-lg">Membership</span>
          <MembershipBadge type={membership} />
        </div>
      </div>
    </div>
  );
}
