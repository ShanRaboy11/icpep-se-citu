"use client";

import { User } from "../utils/user";
import UserTableRow from "./user_table_row";
import { ChevronUp, ChevronDown, Search } from "lucide-react";

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
  totalUsers: number;
  currentPage: number;
  usersPerPage: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleActive: (user: User) => void;
  onView: (user: User) => void;
  filterRole: string;
  filterMembership: string;
  onFilterChange: (type: 'role' | 'membership', value: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export default function UsersTable({
  users,
  totalUsers,
  currentPage,
  usersPerPage,
  onEdit,
  onDelete,
  onToggleActive,
  onView,
  filterRole,
  filterMembership,
  onFilterChange,
  sortField,
  sortDirection,
  onSortChange,
  searchQuery,
  onClearSearch,
}: UsersTableProps) {

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      onSortChange(field, newDirection);
    } else {
      onSortChange(field, "asc");
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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
        {searchQuery && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary1 rounded-lg shadow-sm">
            <Search className="w-4 h-4 text-white" />
            <span className="font-raleway text-sm font-semibold text-white">
              "{searchQuery}"
            </span>
            <button
              onClick={onClearSearch}
              className="text-white hover:bg-white/20 rounded-full p-0.5 transition-colors ml-1"
              title="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <label className="font-raleway text-sm font-medium text-gray-700">
            Role:
          </label>
          <select
            value={filterRole}
            onChange={(e) => onFilterChange('role', e.target.value)}
            className="font-raleway text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary1/50 focus:border-primary1"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="council-officer">Council Officer</option>
            <option value="committee-officer">Committee Officer</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-raleway text-sm font-medium text-gray-700">
            Membership:
          </label>
          <select
            value={filterMembership}
            onChange={(e) => onFilterChange('membership', e.target.value)}
            className="font-raleway text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary1/50 focus:border-primary1"
          >
            <option value="all">All</option>
            <option value="local">Local</option>
            <option value="regional">Regional</option>
            <option value="both">Both (Local & Regional)</option>
            <option value="non-member">Non-Member</option>
          </select>
        </div>

        <div className="ml-auto font-raleway text-sm text-gray-600 font-medium">
          {users.length > 0 ? (
            <>
              Showing {(currentPage - 1) * usersPerPage + 1}-
              {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers}{" "}
              users
            </>
          ) : (
            "No users to display"
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-blue-100">
              <tr>
                <th
                  onClick={() => handleSort("studentNumber")}
                  className="px-4 py-4 text-center font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-2 justify-center">
                    Student Number
                    <SortIcon field="studentNumber" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("fullName")}
                  className="px-4 py-4 w-40 text-center font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-2 justify-center">
                    Full Name
                    <SortIcon field="fullName" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("yearLevel")}
                  className="px-4 py-4 text-center font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-2 justify-center">
                    Year Level
                    <SortIcon field="yearLevel" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("role")}
                  className="px-4 py-4 w-10 text-center items-center font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-2 justify-center">
                    Role
                    <SortIcon field="role" />
                  </div>
                </th>
                <th className="px-4 py-4 text-center font-raleway text-sm font-semibold text-primary3 whitespace-nowrap">
                  Membership
                </th>
                <th className="px-4 py-4 text-center font-raleway text-sm font-semibold text-primary3 whitespace-nowrap">
                  Registered By
                </th>
                <th
                  onClick={() => handleSort("createdAt")}
                  className="px-4 py-4 text-center font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-2 justify-center">
                    Registration Date
                    <SortIcon field="createdAt" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("updatedAt")}
                  className="px-4 py-4 text-center font-raleway text-sm font-semibold text-primary3 cursor-pointer hover:bg-primary1/10 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-2 justify-center">
                    Last Updated
                    <SortIcon field="updatedAt" />
                  </div>
                </th>
                <th className="px-4 py-4 text-center font-raleway text-sm font-semibold text-primary3 whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-4 text-center font-raleway text-sm font-semibold text-primary3 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleActive={onToggleActive}
                  onView={onView}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="font-raleway text-gray-500">
            No users found matching the filters.
          </p>
        </div>
      )}
    </div>
  );
}