"use client";

import { User } from "../utils/user";
import UserTableRow from "./user_table_row";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type SortField = 
  | "studentNumber" 
  | "fullName" 
  | "role" 
  | "yearLevel" 
  | "createdAt" 
  | "updatedAt";

type SortDirection = "asc" | "desc";

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterMembership, setFilterMembership] = useState<string>("all");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const roleMatch = filterRole === "all" || user.role === filterRole;
    const membershipMatch =
      filterMembership === "all" ||
      (filterMembership === "member" && user.membershipStatus.isMember) ||
      (filterMembership === "non-member" && !user.membershipStatus.isMember);
    return roleMatch && membershipMatch;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "studentNumber":
        aValue = a.studentNumber;
        bValue = b.studentNumber;
        break;
      case "fullName":
        aValue = a.fullName.toLowerCase();
        bValue = b.fullName.toLowerCase();
        break;
      case "role":
        aValue = a.role;
        bValue = b.role;
        break;
      case "yearLevel":
        aValue = a.yearLevel || 0;
        bValue = b.yearLevel || 0;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case "updatedAt":
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="font-raleway text-sm font-medium text-gray-700">
            Role:
          </label>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="font-raleway text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary1/50 focus:border-primary1"
          >
            <option value="all">All Roles</option>
            <option value="member">Member</option>
            <option value="non-member">Non-Member</option>
            <option value="officer">Officer</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-raleway text-sm font-medium text-gray-700">
            Membership:
          </label>
          <select
            value={filterMembership}
            onChange={(e) => setFilterMembership(e.target.value)}
            className="font-raleway text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary1/50 focus:border-primary1"
          >
            <option value="all">All</option>
            <option value="member">Member</option>
            <option value="non-member">Non-Member</option>
          </select>
        </div>

        <div className="ml-auto font-raleway text-sm text-gray-600">
          Showing {sortedUsers.length} of {users.length} users
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary1/5 to-secondary2/5">
            <tr>
              <th
                onClick={() => handleSort("studentNumber")}
                className="px-6 py-4 text-left font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Student Number
                  <SortIcon field="studentNumber" />
                </div>
              </th>
              <th
                onClick={() => handleSort("fullName")}
                className="px-6 py-4 text-left font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Full Name
                  <SortIcon field="fullName" />
                </div>
              </th>
              <th
                onClick={() => handleSort("role")}
                className="px-6 py-4 text-left font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Role
                  <SortIcon field="role" />
                </div>
              </th>
              <th
                onClick={() => handleSort("yearLevel")}
                className="px-6 py-4 text-left font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Year Level
                  <SortIcon field="yearLevel" />
                </div>
              </th>
              <th className="px-6 py-4 text-left font-raleway text-sm font-semibold text-primary3">
                Membership
              </th>
              <th className="px-6 py-4 text-left font-raleway text-sm font-semibold text-primary3">
                Registered By
              </th>
              <th
                onClick={() => handleSort("createdAt")}
                className="px-6 py-4 text-left font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Registration Date
                  <SortIcon field="createdAt" />
                </div>
              </th>
              <th
                onClick={() => handleSort("updatedAt")}
                className="px-6 py-4 text-left font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  Last Updated
                  <SortIcon field="updatedAt" />
                </div>
              </th>
              <th className="px-6 py-4 text-left font-raleway text-sm font-semibold text-primary3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sortedUsers.map((user) => (
              <UserTableRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>

      {sortedUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="font-raleway text-gray-500">No users found matching the filters.</p>
        </div>
      )}
    </div>
  );
}