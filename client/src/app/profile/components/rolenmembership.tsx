"use client";

import { Handshake } from "lucide-react";

interface MembershipBadgeProps {
  type: "both" | "local" | "regional";
}

function MembershipBadge({ type }: MembershipBadgeProps) {
  const styles = {
    both: "bg-purple-100 text-purple-700 border-purple-300",
    local: "bg-blue-100 text-blue-700 border-blue-300",
    regional: "bg-green-100 text-green-700 border-green-300"
  };
  
  const labels = {
    both: "Both",
    local: "Local",
    regional: "Regional"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}

interface RolenMembershipInformationProps {
  role?: string | null;
  councilRole?: string | null;
  committeeRole?: string | null;
  membership: "both" | "local" | "regional";
  loading?: boolean;
}

export function RolenMembershipInformation({
  role,
  councilRole,
  committeeRole,
  membership,
  loading = false,
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

  if (loading) {
    return (
      <div className="relative w-full border border-primary1/30 rounded-2xl p-6 px-7 sm:px-10 sm:py-8 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg overflow-hidden">
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          }}
        />
        
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary1/20">
          <div className="p-2 bg-gray-200 rounded-lg animate-pulse">
            <div className="w-5 h-5 bg-gray-300 rounded" />
          </div>
          <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse" />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-row items-center justify-between p-3 rounded-xl">
            <span className="text-gray-400 font-raleway text-lg font-medium">Role</span>
            <div className="h-6 w-28 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          <div className="flex flex-row items-center justify-between p-3 rounded-xl">
            <span className="text-gray-400 font-raleway text-lg font-medium">Position</span>
            <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          <div className="flex flex-row items-center justify-between p-3 rounded-xl">
            <span className="text-gray-400 font-raleway text-lg font-medium">Membership</span>
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-primary1/30 rounded-2xl p-6 px-7 sm:px-10 sm:py-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary1/20">
        <div className="p-2 bg-primary1/10 rounded-lg hover:bg-primary1/20 transition-colors duration-300">
          <Handshake className="w-5 h-5 text-primary1" />
        </div>
        <h2 className="text-xl sm:text-2xl font-rubik text-primary3 font-bold">
          Role & Membership
        </h2>
      </div>

      <div className="flex flex-col gap-5 text-sm md:text-base">
        <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <span className="text-gray-700 font-raleway text-lg font-medium">Role</span>
          <span className="font-rubik text-primary3 text-lg font-semibold sm:mr-10">
            {displayRole}
          </span>
        </div>

        {isOfficer && (
          <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
            <span className="text-gray-700 font-raleway text-lg font-medium">Position</span>
            <span className="font-rubik text-primary3 text-lg font-semibold sm:mr-10">
              {position}
            </span>
          </div>
        )}

        <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
          <span className="text-gray-700 font-raleway text-lg font-medium">Membership</span>
          <MembershipBadge type={membership} />
        </div>
      </div>
    </div>
  );
}