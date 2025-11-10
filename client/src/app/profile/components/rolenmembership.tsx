//rolenmembership.tsx
"use client";

import { MembershipBadge } from "./membership";

interface RolenMembershipInformationProps {
  councilRole: string;
  committeeRole: string;
  membership: "both" | "local" | "regional";
}

export default function RolenMembershipInformation({
  councilRole,
  committeeRole,
  membership,
}: RolenMembershipInformationProps) {
  return (
    <div className="w-full border border-primary1 rounded-lg p-5 px-7 sm:px-10 sm:py-8 bg-white shadow-sm">
      <h2 className="text-xl sm:text-2xl font-rubik text-black font-semibold mb-4 border-b border-primary1 pb-2">
        Role & Membership
      </h2>

      <div className="flex flex-col gap-5 text-sm md:text-base">
        <div className="flex flex-row md:items-center justify-between">
          <span className="text-black font-raleway text-lg">Full Name</span>
          <span className="font-rubik text-black text-lg font-md sm:mr-10">
            {councilRole}
          </span>
        </div>

        <div className="flex flex-row md:items-center justify-between">
          <span className="text-black font-raleway text-lg">ID Number</span>
          <span className="font-rubik text-black text-lg font-md sm:mr-10">
            {committeeRole}
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
