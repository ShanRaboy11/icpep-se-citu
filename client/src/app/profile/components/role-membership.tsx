"use client";

import { Handshake } from "lucide-react";

interface RolenMembershipInformationProps {
  role?: string | null;
  position?: string | null;
  membership: "both" | "local" | "regional";
  loading?: boolean;
}

export function RolenMembershipInformation({
  role,
  position,
  membership,
  loading = false,
}: RolenMembershipInformationProps) {
  
  const isCouncilOfficer = role === 'council-officer';
  const isCommitteeOfficer = role === 'committee-officer';
  const isOfficer = isCouncilOfficer || isCommitteeOfficer;

  const displayPosition = position || '—';

  const roleLabelMap: Record<string, string> = {
    'student': 'Student',
    'council-officer': 'Council Officer',
    'committee-officer': 'Committee Officer',
    'faculty': 'Faculty',
  };

  const displayRole = role ? (roleLabelMap[role] ?? role) : 'Student';

  if (loading) {
    return (
      <div className="relative w-full border border-primary1/10 rounded-3xl p-5 bg-white shadow-lg overflow-hidden">
        <div className="absolute inset-0 -translate-x-full shimmer-bg-animate" />
        <div className="flex items-center gap-4 mb-4 pb-3 border-b border-primary1/5">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
          <div className="h-6 w-40 bg-gray-100 rounded-md" />
        </div>
         <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center px-1">
              <div className="h-4 w-20 bg-gray-100 rounded" />
              <div className="h-6 w-28 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-primary1/10 rounded-3xl p-5 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 pb-3 border-b border-primary1/5">
        <div className="p-3 bg-primary1/10 rounded-2xl text-primary1 flex-shrink-0">
          <Handshake className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-rubik font-bold text-primary3 leading-tight">
            Role & Membership
          </h2>
          <p className="font-raleway text-xs text-gray-500 mt-0.5">
            Organization status
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        
        {/* Role Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <span className="text-gray-600 font-raleway font-semibold text-sm mb-1 sm:mb-0">Role</span>
          <span className="font-rubik text-gray-800 font-medium text-base text-left sm:text-right">
            {displayRole}
          </span>
        </div>

        {/* Position Row */}
        {isOfficer && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <span className="text-gray-600 font-raleway font-semibold text-sm mb-1 sm:mb-0">Position</span>
            <span className="font-rubik text-gray-800 font-medium text-base text-left sm:text-right">
              {displayPosition}
            </span>
          </div>
        )}

        {/* Membership Badge Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <span className="text-gray-600 font-raleway font-semibold text-sm mb-2 sm:mb-0 self-start sm:self-center">
            Membership
          </span>
          <div className="flex sm:justify-end">
            <MembershipBadge type={membership} />
          </div>
        </div>

      </div>
    </div>
  );
}

function MembershipBadge({ type }: { type: "both" | "local" | "regional" }) {
  const styles = {
    both: "bg-purple-50 text-purple-700 border-purple-200",
    local: "bg-blue-50 text-blue-700 border-blue-200",
    regional: "bg-cyan-50 text-cyan-700 border-cyan-200",
  };

  const label = {
    both: "Local & Regional Member",
    local: "Local Member",
    regional: "Regional Member",
  };

  return (
    <span className={`px-4 py-1.5 rounded-lg border font-raleway font-bold text-xs tracking-wide ${styles[type]}`}>
      {label[type]}
    </span>
  );
}