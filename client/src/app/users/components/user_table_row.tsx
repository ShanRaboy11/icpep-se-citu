"use client";

import { User } from "../utils/user";
import { format } from "date-fns";
import { Eye, Pencil, Trash2, UserCheck, UserX } from "lucide-react";

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleActive: (user: User) => void;
  onView: (user: User) => void;
}

export default function UserTableRow({
  user,
  onEdit,
  onDelete,
  onToggleActive,
  onView,
}: UserTableRowProps) {
  const actionButton =
    "inline-flex items-center justify-start gap-1 px-2 py-1.5 text-[11px] sm:gap-1.5 sm:px-2.5 sm:text-xs font-raleway font-semibold text-gray-500 rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer";

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "faculty":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "council-officer":
        return "bg-primary1/20 text-blue-700 border-blue-200";
      case "committee-officer":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "student":
        return "bg-green-100 text-green-700 border-green-200";
      case "admin":
        return "bg-linear-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.4)]";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getMembershipBadgeColor = (isMember: boolean, type: string | null) => {
    if (!isMember) {
      return "bg-gray-100 text-gray-600 border-gray-200";
    }
    if (type === "regional") {
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    }
    if (type === "both") {
      return "bg-purple-100 text-purple-700 border-purple-200";
    }
    // New color for "local" (the default return)
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
      <tr
        className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
        onClick={() => {
          // Below lg a tap expands the card (see responsive-table-toggle);
          // View is still one of the action buttons.
          if (window.matchMedia("(max-width: 1023px)").matches) return;
          onView(user);
        }}
      >
        <td data-label="Student Number" data-primary="media" className="px-4 py-4 whitespace-nowrap text-center">
          <span className="font-raleway text-sm font-medium text-primary3">
            {user.studentNumber}
          </span>
        </td>
        <td data-label="Full Name" data-primary="" className="px-4 py-4 whitespace-nowrap">
          <span className="font-raleway text-sm text-center text-gray-900">
            {user.fullName}
          </span>
        </td>
      
        <td data-label="Year Level" className="px-4 py-4 whitespace-nowrap text-center">
          <span className="font-raleway text-sm text-gray-600">
            {user.yearLevel ? `${user.yearLevel}` : "N/A"}
          </span>
        </td>
        

        <td data-label="Role" className="px-4 py-4 whitespace-nowrap text-center">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-raleway border ${getRoleBadgeColor(
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
        </td>
        
        <td data-label="Membership" className="px-4 py-4 whitespace-nowrap text-center">
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
              : user.membershipStatus.membershipType === "both"
              ? "Both"
              : "Local"}
          </span>
        </td>
        
        <td data-label="Registered By" className="px-4 py-4 whitespace-nowrap text-center">
          <span className="font-raleway text-sm text-gray-600">
            {user.registeredBy?.fullName || "Self-registered"}
          </span>
        </td>
        <td data-label="Registration Date" className="px-4 py-4 whitespace-nowrap text-center">
          <span className="font-raleway text-sm text-gray-600">
            {formatDate(user.createdAt)}
          </span>
        </td>
        <td data-label="Last Updated" className="px-4 py-4 whitespace-nowrap text-center">
          <span className="font-raleway text-sm text-gray-600">
            {formatDate(user.updatedAt)}
          </span>
        </td>
        <td data-label="Status" className="px-4 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2 justify-center">
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
        <td data-label="Actions" className="px-4 py-4 whitespace-nowrap text-center">
          <div className="flex flex-nowrap items-center justify-end gap-1 lg:grid lg:grid-cols-2 lg:justify-start lg:opacity-40 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(user);
              }}
              className={`${actionButton} hover:text-primary1 hover:bg-primary1/10`}
              title="View"
            >
              <Eye size={14} />
              View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(user);
              }}
              className={`${actionButton} hover:text-primary1 hover:bg-primary1/10`}
              title="Edit"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleActive(user);
              }}
              className={`${actionButton} ${
                user.isActive
                  ? "hover:text-amber-600 hover:bg-amber-50"
                  : "hover:text-green-600 hover:bg-green-50"
              }`}
              title={user.isActive ? "Deactivate" : "Activate"}
            >
              {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
              {user.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(user);
              }}
              className={`${actionButton} hover:text-red-500 hover:bg-red-50`}
              title="Delete"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </td>
      </tr>
  );
}
