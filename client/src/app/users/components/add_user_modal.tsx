"use client";

import { useState } from "react";
import { X, UserPlus, AlertCircle, ChevronDown, Check } from "lucide-react";
import { PiPlaceholder } from "react-icons/pi";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: NewUser) => void;
}

export interface NewUser {
  studentNumber: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  yearLevel?: number;
  password: string;
  role: string;
  membershipStatus: string;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onAdd,
}: AddUserModalProps) {
  const [formData, setFormData] = useState<NewUser>({
    studentNumber: "",
    lastName: "",
    firstName: "",
    middleName: "",
    yearLevel: undefined,
    password: "123456",
    role: "student",
    membershipStatus: "non-member",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownContainerStyle =
    "absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden flex flex-col gap-1 p-2 max-h-56 overflow-y-auto";
  const dropdownItemStyle =
    "flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors font-rubik text-sm font-medium";
  const dropdownItemSelectedStyle = "bg-primary1/5 text-primary1";
  const dropdownItemHoverStyle = "hover:bg-gray-50 text-gray-700";

  const YEAR_OPTIONS = [
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
    { value: "4", label: "4th Year" },
    { value: "5", label: "5th Year" },
  ];
  const ROLE_OPTIONS = [
    { value: "student", label: "Student" },
    { value: "council-officer", label: "Council Officer" },
    { value: "committee-officer", label: "Committee Officer" },
    { value: "faculty", label: "Faculty" },
    { value: "admin", label: "Admin" },
  ];
  const MEMBERSHIP_OPTIONS = [
    { value: "non-member", label: "Non-Member" },
    { value: "member", label: "Member" },
    { value: "local", label: "Local" },
    { value: "regional", label: "Regional" },
    { value: "both", label: "Both (Local & Regional)" },
  ];

  const selectedYearLabel = YEAR_OPTIONS.find((o) => o.value === String(formData.yearLevel || ""))?.label ?? "Select Year Level";
  const selectedRoleLabel = ROLE_OPTIONS.find((o) => o.value === formData.role)?.label ?? "Student";
  const selectedMembershipLabel = MEMBERSHIP_OPTIONS.find((o) => o.value === formData.membershipStatus)?.label ?? "Non-Member";

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = "Student number is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (
      formData.yearLevel &&
      (formData.yearLevel < 1 || formData.yearLevel > 5)
    ) {
      newErrors.yearLevel = "Year level must be between 1 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onAdd(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      studentNumber: "",
      lastName: "",
      firstName: "",
      middleName: "",
      yearLevel: undefined,
      password: "123456",
      role: "member",
      membershipStatus: "non-member",
    });
    setErrors({});
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "yearLevel" ? (value ? parseInt(value) : undefined) : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-visible flex flex-col animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary1/5 to-secondary2/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary1/10 rounded-lg">
              <UserPlus className="w-6 h-6 text-primary1" />
            </div>
            <div>
              <h2 className="font-rubik text-2xl font-bold text-primary3">
                Add New User
              </h2>
              <p className="font-raleway text-sm text-gray-600">
                Register a new user to the system
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-visible p-6">
          <div className="space-y-4">
            {/* Student Number */}
            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                Student Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
                placeholder="23-2502-326"
                className={`w-full px-4 py-2 border rounded-lg text-gray-500 font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50 ${
                  errors.studentNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.studentNumber && (
                <p className="mt-1 text-sm text-red-600 font-raleway flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.studentNumber}
                </p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  className={`w-full px-4 py-2 border rounded-lg text-gray-500 font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 font-raleway">
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
                  placeholder="Santos"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 text-gray-400 font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50"
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
                  placeholder="Dela Cruz"
                  className={`w-full px-4 py-2 border rounded-lg font-raleway text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary1/50 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 font-raleway">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Year Level and Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Year Level */}
              <div>
                <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                  Year Level
                </label>
                <div className="relative">
                  <div
                    className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                      activeDropdown === "yearLevel"
                        ? "bg-white border-primary1 ring-4 ring-primary1/10"
                        : errors.yearLevel ? "border-red-500" : ""
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
                        {YEAR_OPTIONS.map((opt) => (
                          <div
                            key={opt.value}
                            className={`${dropdownItemStyle} ${
                              String(formData.yearLevel || "") === opt.value
                                ? dropdownItemSelectedStyle
                                : dropdownItemHoverStyle
                            }`}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, yearLevel: parseInt(opt.value) }));
                              setActiveDropdown(null);
                            }}
                          >
                            <span>{opt.label}</span>
                            {String(formData.yearLevel || "") === opt.value && (
                              <Check className="w-4 h-4 text-primary1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {errors.yearLevel && (
                  <p className="mt-1 text-sm text-red-600 font-raleway">{errors.yearLevel}</p>
                )}
              </div>

              <div>
                <label className="block font-raleway text-sm font-semibold text-gray-500 mb-2">
                  Password <span className="text-gray-400 font-normal">(Default)</span>
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  readOnly
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg font-raleway text-gray-400 bg-gray-50 cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Role and Membership */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <div>
                <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <div className="relative">
                  <div
                    className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer flex items-center justify-between text-gray-700 transition-all hover:bg-gray-100 ${
                      activeDropdown === "role" ? "bg-white border-primary1 ring-4 ring-primary1/10" : ""
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
                        {ROLE_OPTIONS.map((opt) => (
                          <div
                            key={opt.value}
                            className={`${dropdownItemStyle} ${
                              formData.role === opt.value
                                ? dropdownItemSelectedStyle
                                : dropdownItemHoverStyle
                            }`}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, role: opt.value }));
                              setActiveDropdown(null);
                            }}
                          >
                            <span>{opt.label}</span>
                            {formData.role === opt.value && (
                              <Check className="w-4 h-4 text-primary1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Membership Status */}
              <div>
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
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-raleway text-sm text-blue-800">
                <strong>Note:</strong> The password will be hashed before
                storage. User should change it upon first login.
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-raleway font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-primary1 to-primary1/90 text-white font-raleway font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}
