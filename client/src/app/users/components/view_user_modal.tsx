"use client";

import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  Award,
} from "lucide-react";
import { User } from "../utils/user";
import { format } from "date-fns";

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
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy 'at' hh:mm a");
    } catch {
      return "N/A";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "faculty":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "council-officer":
        return "bg-primary1/20 text-blue-700 border-blue-200";
      case "committee-officer":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "member":
        return "bg-green-100 text-green-700 border-green-200";
      case "non-member":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary1 to-primary1/90 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-rubik text-2xl font-bold text-white">
                  User Details
                </h2>
                <p className="font-raleway text-sm text-white/80">
                  Complete user information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Profile Section */}
          <div className="mb-6 text-center pb-6 border-b border-gray-200">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary1 to-primary1/70 flex items-center justify-center">
              <span className="font-rubik text-3xl font-bold text-white">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </span>
            </div>
            <h3 className="font-rubik text-2xl font-bold text-gray-900 mb-1">
              {user.fullName}
            </h3>
            <p className="font-raleway text-gray-600 text-lg mb-3">
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

          {/* Personal Information */}
          <div className="mb-6">
            <h4 className="font-rubik text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary1" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-raleway text-sm text-gray-500 mb-1">
                  First Name
                </p>
                <p className="font-raleway text-base font-semibold text-gray-900">
                  {user.firstName}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-raleway text-sm text-gray-500 mb-1">
                  Last Name
                </p>
                <p className="font-raleway text-base font-semibold text-gray-900">
                  {user.lastName}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-raleway text-sm text-gray-500 mb-1">
                  Middle Name
                </p>
                <p className="font-raleway text-base font-semibold text-gray-900">
                  {user.middleName || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-raleway text-sm text-gray-500 mb-1">
                  Year Level
                </p>
                <p className="font-raleway text-base font-semibold text-gray-900">
                  {user.yearLevel ? `Year ${user.yearLevel}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Membership Information */}
          <div className="mb-6">
            <h4 className="font-rubik text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary1" />
              Membership Information
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
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
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
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

          {/* Registration Information */}
          <div className="mb-6">
            <h4 className="font-rubik text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary1" />
              Registration Information
            </h4>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-raleway text-sm text-gray-500 mb-1">
                  Registered By
                </p>
                <p className="font-raleway text-base font-semibold text-gray-900">
                  {user.registeredBy?.fullName || "Self-registered"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-raleway text-sm text-gray-500 mb-1">
                  Registration Date
                </p>
                <p className="font-raleway text-base font-semibold text-gray-900">
                  {formatDate(user.createdAt)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-raleway text-sm text-gray-500 mb-1">
                  Last Updated
                </p>
                <p className="font-raleway text-base font-semibold text-gray-900">
                  {formatDate(user.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <h4 className="font-rubik text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary1" />
              Account Status
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-raleway text-sm text-gray-500 mb-1">
                    Current Status
                  </p>
                  <p className="font-raleway text-base font-semibold text-gray-900">
                    {user.isActive ? "Active Account" : "Inactive Account"}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-full font-raleway font-semibold ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary1 text-white font-raleway font-semibold rounded-lg hover:bg-primary1/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
