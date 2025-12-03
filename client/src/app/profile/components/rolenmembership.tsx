"use client";

import { Handshake } from "lucide-react";
import { MembershipBadge } from "./membership";

interface RolenMembershipInformationProps {
  role?: string | null;
  councilRole?: string | null;
  committeeRole?: string | null;
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
    <div className="w-full border border-primary1/30 rounded-2xl p-6 px-7 sm:px-10 sm:py-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary1/20">
        <div className="p-2 bg-primary1/10 rounded-lg hover:bg-primary1/20 transition-colors duration-300">
          <Handshake className="w-5 h-5 text-primary1" />
        </div>
        <h2 className="text-xl sm:text-2xl font-rubik text-primary3 font-bold">
          Role & Membership
        </h2>
      </div>

      <div className="flex flex-col gap-5 text-sm md:text-base">
        {/* Role */}
        <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <span className="text-gray-700 font-raleway text-lg font-medium">Role</span>
          <span className="font-rubik text-primary3 text-lg font-semibold sm:mr-10">
            {displayRole}
          </span>
        </div>

        {/* Position (only for officers) */}
        {isOfficer && (
          <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-raleway text-lg font-medium">Position</span>
              </div>
            <span className="font-rubik text-primary3 text-lg font-semibold sm:mr-10">
              {position}
            </span>
          </div>
        )}

        {/* Membership */}
        <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <span className="text-gray-700 font-raleway text-lg font-medium">Membership</span>
          <MembershipBadge type={membership} />
        </div>
      </div>
    </div>
  );
}
