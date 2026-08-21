"use client";

import { X, Save, ChevronDown, Check } from "lucide-react";
import { User } from "../utils/user"; // Ensure this path is correct
import { useState } from "react";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
  user: User;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onSave,
  user,
}: EditUserModalProps) {
  const [formData, setFormData] = useState({
    studentNumber: user.studentNumber,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName || "",
    role: user.role,
    // Convert yearLevel to string for the select input.
    // Use an empty string if it's null or undefined.
    yearLevel: user.yearLevel?.toString() || "",
    membershipStatus: user.membershipStatus.isMember
      ? user.membershipStatus.membershipType || "local"
      : "non-member",
    isActive: user.isActive,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownContainerStyle =
    "absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden flex flex-col gap-1 p-2 max-h-56 overflow-y-auto";
  const dropdownItemStyle =
    "flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium";
  const dropdownItemSelectedStyle = "bg-primary1/5 text-primary1";
  const dropdownItemHoverStyle = "hover:bg-gray-50 text-gray-700";

  const ROLE_OPTIONS = [
    { value: "student", label: "Student" },
    { value: "council-officer", label: "Council Officer" },
    { value: "committee-officer", label: "Committee Officer" },
    { value: "faculty", label: "Faculty" },
    { value: "admin", label: "Admin" },
  ];
  const YEAR_OPTIONS = [
    { value: "", label: "Select Year Level" },
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
    { value: "4", label: "4th Year" },
  ];
  const MEMBERSHIP_OPTIONS = [
    { value: "non-member", label: "Non-Member" },
    { value: "local", label: "Local Member" },
    { value: "regional", label: "Regional Member" },
    { value: "both", label: "Both (Local & Regional)" },
  ];

  const selectedRoleLabel = ROLE_OPTIONS.find((o) => o.value === formData.role)?.label ?? "Select Role";
  const selectedYearLabel = YEAR_OPTIONS.find((o) => o.value === formData.yearLevel)?.label ?? "Select Year Level";
  const selectedMembershipLabel = MEMBERSHIP_OPTIONS.find((o) => o.value === formData.membershipStatus)?.label ?? "Non-Member";

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = "Student number is required";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Explicitly define the type for role to match User['role']
    const role: User["role"] = formData.role as User["role"];

    const updatedUser: User = {
      ...user,
      studentNumber: formData.studentNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName || null,
      fullName: `${formData.firstName} ${formData.middleName || ""} ${
        formData.lastName
      }`.trim(),
      role: role,
      yearLevel: formData.yearLevel ? parseInt(formData.yearLevel) : undefined,
      membershipStatus: {
        isMember: formData.membershipStatus !== "non-member",
        membershipType:
          formData.membershipStatus === "non-member"
            ? null
            : (formData.membershipStatus as "local" | "regional" | "both"),
      },
      isActive: formData.isActive,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-visible animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary1 to-primary1/90 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-rubik text-2xl font-bold text-white">
                Edit User
              </h2>
              <p className="font-raleway text-sm text-white/80">
                Editing: {user.fullName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-visible max-h-[calc(90vh-160px)]"
        >
          {/* Student Number */}
          <div className="mb-4">
            <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
              Student Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="studentNumber"
              value={formData.studentNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 text-gray-400 border-2 rounded-lg font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50 ${
                errors.studentNumber
                  ? "border-red-500"
                  : "border-gray-300 focus:border-primary1"
              }`}
              placeholder="XX-XXXX-XXX"
            />
            {errors.studentNumber && (
              <p className="mt-1 text-sm text-red-500 font-raleway">
                {errors.studentNumber}
              </p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 text-gray-400 border-2 rounded-lg font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50 ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primary1"
                }`}
                placeholder="Juan"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500 font-raleway">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 text-gray-400 rounded-lg font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50 focus:border-primary1"
                placeholder="Santos"
              />
            </div>

            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 text-gray-400 rounded-lg font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50 ${
                  errors.lastName
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primary1"
                }`}
                placeholder="Dela Cruz"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500 font-raleway">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Role and Year Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Role Dropdown */}
            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div
                  className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                    activeDropdown === "role"
                      ? "bg-white border-primary1 ring-4 ring-primary1/10"
                      : errors.role ? "border-red-500" : ""
                  }`}
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "role" ? null : "role")
                  }
                >
                  <span className="font-rubik text-sm">{selectedRoleLabel}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      activeDropdown === "role" ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {activeDropdown === "role" && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setActiveDropdown(null)} />
                    <div className={dropdownContainerStyle}>
                      {ROLE_OPTIONS.map((opt) => {
                        // Only show admin option if user already has admin role
                        if (opt.value === "admin" && user.role !== "admin") return null;
                        return (
                          <div
                            key={opt.value}
                            className={`${dropdownItemStyle} ${
                              formData.role === opt.value
                                ? dropdownItemSelectedStyle
                                : dropdownItemHoverStyle
                            }`}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, role: opt.value as "council-officer" | "committee-officer" | "student" | "faculty" | "admin" }));
                              setActiveDropdown(null);
                            }}
                          >
                            <span>{opt.label}</span>
                            {formData.role === opt.value && (
                              <Check className="w-4 h-4 text-primary1" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500 font-raleway">{errors.role}</p>
              )}
            </div>

            {/* Year Level Dropdown */}
            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                Year Level
              </label>
              <div className="relative">
                <div
                  className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                    activeDropdown === "yearLevel" ? "bg-white border-primary1 ring-4 ring-primary1/10" : ""
                  }`}
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "yearLevel" ? null : "yearLevel")
                  }
                >
                  <span className="font-rubik text-sm">{selectedYearLabel}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      activeDropdown === "yearLevel" ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {activeDropdown === "yearLevel" && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setActiveDropdown(null)} />
                    <div className={dropdownContainerStyle}>
                      {YEAR_OPTIONS.filter((o) => o.value !== "").map((opt) => (
                        <div
                          key={opt.value}
                          className={`${dropdownItemStyle} ${
                            formData.yearLevel === opt.value
                              ? dropdownItemSelectedStyle
                              : dropdownItemHoverStyle
                          }`}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, yearLevel: opt.value }));
                            setActiveDropdown(null);
                          }}
                        >
                          <span>{opt.label}</span>
                          {formData.yearLevel === opt.value && (
                            <Check className="w-4 h-4 text-primary1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Membership Status */}
          <div className="mb-4">
            <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
              Membership Status
            </label>
            <div className="relative">
              <div
                className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                  activeDropdown === "membership" ? "bg-white border-primary1 ring-4 ring-primary1/10" : ""
                }`}
                onClick={() =>
                  setActiveDropdown(activeDropdown === "membership" ? null : "membership")
                }
              >
                <span className="font-rubik text-sm">{selectedMembershipLabel}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                    activeDropdown === "membership" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {activeDropdown === "membership" && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setActiveDropdown(null)} />
                  <div className={dropdownContainerStyle}>
                    {MEMBERSHIP_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        className={`${dropdownItemStyle} ${
                          formData.membershipStatus === opt.value
                            ? dropdownItemSelectedStyle
                            : dropdownItemHoverStyle
                        }`}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, membershipStatus: opt.value }));
                          setActiveDropdown(null);
                        }}
                      >
                        <span>{opt.label}</span>
                        {formData.membershipStatus === opt.value && (
                          <Check className="w-4 h-4 text-primary1" />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="mb-6">
            <label className="block font-raleway text-sm font-semibold text-gray-700 mb-3">
              Account Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isActive"
                  checked={formData.isActive === true}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, isActive: true }))
                  }
                  className="w-4 h-4 text-primary1 focus:ring-primary1"
                />
                <span className="font-raleway text-sm text-gray-700">
                  Active
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isActive"
                  checked={formData.isActive === false}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, isActive: false }))
                  }
                  className="w-4 h-4 text-primary1 focus:ring-primary1"
                />
                <span className="font-raleway text-sm text-gray-700">
                  Inactive
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-raleway font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-primary1 text-white font-raleway font-semibold rounded-lg hover:bg-primary1/90 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
