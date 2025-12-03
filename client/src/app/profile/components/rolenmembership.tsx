//rolenmembership.tsx
"use client";

import { MembershipBadge } from "./membership";

interface RolenMembershipInformationProps {
  role?: string | null; // 'student' | 'council-officer' | 'committee-officer' | 'faculty'
  councilRole?: string | null; // optional descriptive position text returned by API
  committeeRole?: string | null; // optional descriptive position text returned by API
  membership: "both" | "local" | "regional";
}

export default function RolenMembershipInformation({
  role,
  councilRole,
  committeeRole,
  membership,
}: RolenMembershipInformationProps) {
  const isCouncilOfficer = role === 'council-officer';
  const isCommitteeOfficer = role === 'committee-officer';
  const isOfficer = isCouncilOfficer || isCommitteeOfficer;

  // Determine displayed position: prefer explicit council/committee position text
  let position = '—';
  if (isCouncilOfficer && councilRole) position = councilRole;
  else if (isCommitteeOfficer && committeeRole) position = committeeRole;

  const roleLabelMap: Record<string, string> = {
    'student': 'Student',
    'council-officer': 'Council Officer',
    'committee-officer': 'Committee Officer',
    'faculty': 'Faculty',
  };

  const displayRole = role ? (roleLabelMap[role] ?? role) : 'Student';

  return (
    <div className="w-full border border-primary1 rounded-lg p-5 px-7 sm:px-10 sm:py-8 bg-white shadow-sm">
      <h2 className="text-xl sm:text-2xl font-rubik text-black font-semibold mb-4 border-b border-primary1 pb-2">
        Role & Membership
      </h2>

      <div className="flex flex-col gap-5 text-sm md:text-base">
        <div className="flex flex-row md:items-center justify-between">
          <span className="text-black font-raleway text-lg">Role</span>
          <span className="font-rubik text-black text-lg font-md sm:mr-10">
            {displayRole}
          </span>
        </div>

        {isOfficer && (
          <div className="flex flex-row md:items-center justify-between">
            <span className="text-black font-raleway text-lg">Position</span>
            <span className="font-rubik text-black text-lg font-md sm:mr-10">
              {position}
            </span>
          </div>
        )}

        <div className="flex flex-row md:items-center justify-between">
          <span className="text-black font-raleway text-lg">Membership</span>
          <MembershipBadge type={membership} />
        </div>
      </div>
    </div>
  );
}
