"use client";

import { useState } from "react";
import { User } from "../utils/user";
import UserTableRow from "./user_table_row";
import { ChevronUp, ChevronDown, Check } from "lucide-react";

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
}: UsersTableProps) {

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      onSortChange(field, newDirection);
    } else {
      onSortChange(field, "asc");
    }
  };

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownContainerStyle =
    "absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden flex flex-col gap-1 p-2 max-h-56 overflow-y-auto";
  const dropdownItemStyle =
    "flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium";
  const dropdownItemSelectedStyle = "bg-primary1/5 text-primary1";
  const dropdownItemHoverStyle = "hover:bg-gray-50 text-gray-700";

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

  const selectedRoleLabel = ROLE_OPTIONS.find((o) => o.value === filterRole)?.label ?? "All Roles";
  const selectedMembershipLabel = MEMBERSHIP_OPTIONS.find((o) => o.value === filterMembership)?.label ?? "All";

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
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <label className="font-raleway text-sm font-medium text-gray-700">
            Role:
          </label>
          <div className="relative w-44">
            <div
              className={`w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-50 ${
                activeDropdown === "filterRole"
                  ? "border-primary1 ring-4 ring-primary1/10"
                  : ""
              }`}
              onClick={() =>
                setActiveDropdown(activeDropdown === "filterRole" ? null : "filterRole")
              }
            >
              <span className="font-raleway text-sm truncate">{selectedRoleLabel}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 ml-1 flex-shrink-0 transition-transform duration-300 ${
                  activeDropdown === "filterRole" ? "rotate-180" : ""
                }`}
              />
            </div>
            {activeDropdown === "filterRole" && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setActiveDropdown(null)}
                />
                <div className={dropdownContainerStyle}>
                  {ROLE_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      className={`${dropdownItemStyle} ${
                        filterRole === opt.value
                          ? dropdownItemSelectedStyle
                          : dropdownItemHoverStyle
                      }`}
                      onClick={() => {
                        onFilterChange("role", opt.value);
                        setActiveDropdown(null);
                      }}
                    >
                      <span>{opt.label}</span>
                      {filterRole === opt.value && (
                        <Check className="w-4 h-4 text-primary1" />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Membership Filter */}
        <div className="flex items-center gap-2">
          <label className="font-raleway text-sm font-medium text-gray-700">
            Membership:
          </label>
          <div className="relative w-48">
            <div
              className={`w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-50 ${
                activeDropdown === "filterMembership"
                  ? "border-primary1 ring-4 ring-primary1/10"
                  : ""
              }`}
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "filterMembership" ? null : "filterMembership"
                )
              }
            >
              <span className="font-raleway text-sm truncate">{selectedMembershipLabel}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 ml-1 flex-shrink-0 transition-transform duration-300 ${
                  activeDropdown === "filterMembership" ? "rotate-180" : ""
                }`}
              />
            </div>
            {activeDropdown === "filterMembership" && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setActiveDropdown(null)}
                />
                <div className={dropdownContainerStyle}>
                  {MEMBERSHIP_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      className={`${dropdownItemStyle} ${
                        filterMembership === opt.value
                          ? dropdownItemSelectedStyle
                          : dropdownItemHoverStyle
                      }`}
                      onClick={() => {
                        onFilterChange("membership", opt.value);
                        setActiveDropdown(null);
                      }}
                    >
                      <span>{opt.label}</span>
                      {filterMembership === opt.value && (
                        <Check className="w-4 h-4 text-primary1" />
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
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