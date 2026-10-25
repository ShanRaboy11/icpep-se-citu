"use client";

import {
  X,
  User as UserIcon,
  Calendar,
  Award } from "lucide-react";
import { User } from "../../utils/users/user";
import { format } from "date-fns";
import { useBodyScrollLock } from "@/app/hooks/use-body-scroll-lock";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function ViewUserModal({
  isOpen,
  onClose,
  user,
}: ViewUserModalProps) {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch {
      return "N/A";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "hh:mm a");
    } catch {
      return "";
    }
  };

  const formatRole = (role: string) =>
    role
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "faculty":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "council-officer":
        return "bg-primary1/20 text-blue-700 border-blue-200";
      case "committee-officer":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "admin":
        return "bg-linear-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.4)]";
      case "member":
        return "bg-green-100 text-green-700 border-green-200";
      case "non-member":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-100000 w-full max-w-2xl bg-white rounded-4xl shadow-xl border border-white/50 animate-scale-in flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header — fixed, never scrolls away */}
        <div className="flex items-center justify-between px-6 sm:px-7 pt-6 sm:pt-7 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary1/10 rounded-2xl text-primary1 shrink-0">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-rubik font-bold text-primary3">
                User Details
              </h3>
              <p className="text-sm font-raleway text-gray-500 mt-0.5">
                Complete user information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content — the only part that scrolls */}
        <div className="overflow-y-auto themed-scrollbar px-6 sm:px-7 py-4 flex-1">
          <div className="mb-4 text-center pb-4 border-b border-gray-200">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-linear-to-br from-primary3 via-[#0055AA] to-primary3 border-4 border-white ring-4 ring-primary1/25 shadow-md flex items-center justify-center">
              <span className="font-rubik text-2xl font-bold text-white">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </span>
            </div>
            <h3 className="font-rubik text-xl font-bold text-gray-900">
              {user.fullName}
            </h3>
            <p className="font-raleway text-gray-600 text-base mb-2">
              {user.studentNumber}
            </p>
            <div className="flex items-center justify-center gap-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold font-raleway border ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {user.role === "council-officer"
                  ? "Council Officer"
                  : user.role === "committee-officer"
                  ? "Committee Officer"
                  : user.role === "admin"
                  ? "Admin"
                  : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>

              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span className="font-raleway text-sm text-gray-600">
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-1.5 bg-primary1/10 rounded-lg text-primary1 shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-rubik text-base font-bold text-primary3 leading-tight">
                  Personal Information
                </h4>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-gray-50 px-3 py-2.5 rounded-xl">
                <p className="font-raleway text-xs text-gray-500 mb-0.5">
                  First Name
                </p>
                <p className="font-raleway text-sm font-semibold text-gray-900">
                  {user.firstName}
                </p>
              </div>
              <div className="bg-gray-50 px-3 py-2.5 rounded-xl">
                <p className="font-raleway text-xs text-gray-500 mb-0.5">
                  Last Name
                </p>
                <p className="font-raleway text-sm font-semibold text-gray-900">
                  {user.lastName}
                </p>
              </div>
              <div className="bg-gray-50 px-3 py-2.5 rounded-xl">
                <p className="font-raleway text-xs text-gray-500 mb-0.5">
                  Middle Name
                </p>
                <p className="font-raleway text-sm font-semibold text-gray-900">
                  {user.middleName || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 px-3 py-2.5 rounded-xl">
                <p className="font-raleway text-xs text-gray-500 mb-0.5">
                  Year Level
                </p>
                <p className="font-raleway text-sm font-semibold text-gray-900">
                  {user.yearLevel ? `Year ${user.yearLevel}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {user.role !== "faculty" && (
            <div className="mb-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 bg-primary1/10 rounded-lg text-primary1 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-rubik text-base font-bold text-primary3 leading-tight">
                    Membership Information
                  </h4>
                </div>
              </div>
              <div className="bg-gray-50 px-3 py-2.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-raleway text-sm text-gray-500">
                    Membership Status
                  </p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold font-raleway border ${
                      user.membershipStatus.isMember
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {user.membershipStatus.isMember ? "Member" : "Non-Member"}
                  </span>
                </div>
                {user.membershipStatus.isMember &&
                  user.membershipStatus.membershipType && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <p className="font-raleway text-sm text-gray-500">
                        Membership Type
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold font-raleway border ${
                          user.membershipStatus.membershipType === "regional"
                            ? "bg-primary1/10 text-primary1 border-primary1/30"
                            : user.membershipStatus.membershipType === "both"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : "bg-secondary2/10 text-secondary2 border-secondary2/30"
                        }`}
                      >
                        {user.membershipStatus.membershipType === "regional"
                          ? "Regional"
                          : user.membershipStatus.membershipType === "both"
                          ? "Both (Local & Regional)"
                          : "Local"}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-1.5 bg-primary1/10 rounded-lg text-primary1 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-rubik text-base font-bold text-primary3 leading-tight">
                  Registration Information
                </h4>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-gray-50 px-3 py-2.5 rounded-xl">
                <p className="font-raleway text-xs text-gray-500 mb-0.5">
                  Registered By
                </p>
                <p className="font-raleway text-sm font-semibold text-gray-900">
                  {user.registeredBy?.fullName || "Self-registered"}
                </p>
                {user.registeredBy?.role && (
                  <p className="font-raleway text-xs text-gray-500 mt-0.5">
                    {formatRole(user.registeredBy.role)}
                  </p>
                )}
              </div>
              <div className="bg-gray-50 px-3 py-2.5 rounded-xl">
                <p className="font-raleway text-xs text-gray-500 mb-0.5">
                  Registration Date
                </p>
                <p className="font-raleway text-sm font-semibold text-gray-900">
                  {formatDate(user.createdAt)}
                </p>
                <p className="font-raleway text-xs text-gray-500 mt-0.5">
                  {formatTime(user.createdAt)}
                </p>
              </div>
              <div className="bg-gray-50 px-3 py-2.5 rounded-xl">
                <p className="font-raleway text-xs text-gray-500 mb-0.5">
                  Last Updated
                </p>
                <p className="font-raleway text-sm font-semibold text-gray-900">
                  {formatDate(user.updatedAt)}
                </p>
                <p className="font-raleway text-xs text-gray-500 mt-0.5">
                  {formatTime(user.updatedAt)}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
