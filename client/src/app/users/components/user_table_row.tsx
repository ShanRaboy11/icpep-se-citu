"use client";

import { User } from "../utils/user";
import { format } from "date-fns";

interface UserTableRowProps {
  user: User;
}

export default function UserTableRow({ user }: UserTableRowProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "faculty":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "officer":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "member":
        return "bg-green-100 text-green-700 border-green-200";
      case "non-member":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getMembershipBadgeColor = (isMember: boolean, type: string | null) => {
    if (!isMember) {
      return "bg-gray-100 text-gray-600 border-gray-200";
    }
    if (type === "regional") {
      return "bg-primary1/10 text-primary1 border-primary1/30";
    }
    return "bg-secondary2/10 text-secondary2 border-secondary2/30";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-raleway text-sm font-medium text-primary3">
          {user.studentNumber}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.fullName}
              className="w-8 h-8 rounded-full object-cover border-2 border-primary1/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary1/20 to-secondary2/20 flex items-center justify-center border-2 border-primary1/20">
              <span className="font-raleway text-xs font-semibold text-primary1">
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            </div>
          )}
          <span className="font-raleway text-sm text-gray-900">
            {user.fullName}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-raleway border ${getRoleBadgeColor(
            user.role
          )}`}
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-raleway text-sm text-gray-600">
          {user.yearLevel ? `Year ${user.yearLevel}` : "N/A"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-raleway border ${getMembershipBadgeColor(
            user.membershipStatus.isMember,
            user.membershipStatus.membershipType
          )}`}
        >
          {!user.membershipStatus.isMember
            ? "Non-Member"
            : user.membershipStatus.membershipType === "regional"
            ? "Regional"
            : "Local"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-raleway text-sm text-gray-600">
          {user.registeredBy?.fullName || "Self-registered"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-raleway text-sm text-gray-600">
          {formatDate(user.createdAt)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-raleway text-sm text-gray-600">
          {formatDate(user.updatedAt)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
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
      </td>
    </tr>
  );
}