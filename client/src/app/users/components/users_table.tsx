"use client";

import { useState } from "react";
import { User } from "../utils/user";
import UserTableRow from "./user_table_row";
import { ChevronUp, ChevronDown } from "lucide-react";
import Dropdown from "@/app/components/dropdown";

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
  onSendCode: (user: User) => void;
  canResetLogin: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (user: User) => void;
  onSelectAllShown: () => void;
  onClearSelection: () => void;
  onView: (user: User) => void;
  filterRole: string;
  filterMembership: string;
  filterStatus: string;
  onFilterChange: (type: 'role' | 'membership' | 'status', value: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

export default function UsersTable({
  users,
  totalUsers,
  currentPage,
  usersPerPage,
  onEdit,
  onDelete,
  onToggleActive,
  onSendCode,
  canResetLogin,
  selectedIds,
  onToggleSelect,
  onSelectAllShown,
  onClearSelection,
  onView,
  filterRole,
  filterMembership,
  filterStatus,
  onFilterChange,
  sortField,
  sortDirection,
  onSortChange,
}: UsersTableProps) {

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      onSortChange(field, newDirection);
    } else {
      onSortChange(field, "asc");
    }
  };

  const ROLE_OPTIONS = [
    { value: "all", label: "All Roles" },
    { value: "student", label: "Student" },
    { value: "council-officer", label: "Council Officer" },
    { value: "committee-officer", label: "Committee Officer" },
    { value: "faculty", label: "Faculty" },
    { value: "admin", label: "Admin" },
  ];

  const MEMBERSHIP_OPTIONS = [
    { value: "all", label: "All" },
    { value: "local", label: "Local" },
    { value: "regional", label: "Regional" },
    { value: "both", label: "Both (Local & Regional)" },
    { value: "non-member", label: "Non-Member" },
  ];

  const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "first-login", label: "Awaiting First Login" },
  ];

  const SORT_OPTIONS: { value: SortField; label: string }[] = [
    { value: "studentNumber", label: "Student Number" },
    { value: "fullName", label: "Full Name" },
    { value: "yearLevel", label: "Year Level" },
    { value: "role", label: "Role" },
    { value: "createdAt", label: "Registration Date" },
    { value: "updatedAt", label: "Last Updated" },
  ];


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
      <div className="flex flex-wrap gap-3 sm:gap-4 items-center bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200">
        {/* Role Filter */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <label className="font-raleway text-sm font-medium text-gray-700">
            Role:
          </label>
          <Dropdown
            value={filterRole}
            options={ROLE_OPTIONS}
            onChange={(value) => onFilterChange("role", value)}
            className="flex-1 sm:w-56 sm:flex-none"
          />
        </div>

        {/* Membership Filter */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <label className="font-raleway text-sm font-medium text-gray-700">
            Membership:
          </label>
          <Dropdown
            value={filterMembership}
            options={MEMBERSHIP_OPTIONS}
            onChange={(value) => onFilterChange("membership", value)}
            className="flex-1 sm:w-72 sm:flex-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <label className="font-raleway text-sm font-medium text-gray-700">
            Status:
          </label>
          <Dropdown
            value={filterStatus}
            options={STATUS_OPTIONS}
            onChange={(value) => onFilterChange("status", value)}
            className="flex-1 sm:w-60 sm:flex-none"
          />
        </div>

        {/* The column headers are hidden on phones, so sorting moves here */}
        <div className="flex w-full items-center gap-2 sm:hidden">
          <label className="font-raleway text-sm font-medium text-gray-700">
            Sort:
          </label>
          <Dropdown
            value={sortField}
            options={SORT_OPTIONS}
            onChange={(value) => onSortChange(value as SortField, sortDirection)}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() =>
              onSortChange(sortField, sortDirection === "asc" ? "desc" : "asc")
            }
            title={sortDirection === "asc" ? "Ascending" : "Descending"}
            className="rounded-2xl border border-gray-200 bg-white p-2.5 text-gray-600 cursor-pointer"
          >
            {sortDirection === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 font-raleway text-sm font-medium">
          <button
            type="button"
            onClick={onSelectAllShown}
            className="text-primary1 hover:underline cursor-pointer"
          >
            Select all awaiting first login
          </button>
          {selectedIds.size > 0 && (
            <>
              <span className="text-gray-600">{selectedIds.size} selected</span>
              <button
                type="button"
                onClick={onClearSelection}
                className="text-gray-500 hover:underline cursor-pointer"
              >
                Clear
              </button>
            </>
          )}
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
        <div className="overflow-x-auto themed-scrollbar">
          <table className="responsive-table w-full min-w-max">
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
                  onSendCode={onSendCode}
                  canResetLogin={canResetLogin}
                  selected={selectedIds.has(user.id)}
                  onToggleSelect={onToggleSelect}
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