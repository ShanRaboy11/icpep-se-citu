"use client";

import { X, ChevronDown, Check } from "lucide-react";
import { User } from "../utils/user"; // Ensure this path is correct
import { useEffect, useRef, useState } from "react";
import Button from "../../components/button";
import {
  YEAR_OPTIONS as BASE_YEAR_OPTIONS,
  ROLE_OPTIONS,
  MEMBERSHIP_OPTIONS,
  dropdownOuterStyle,
  dropdownInnerStyle,
  dropdownItemStyle,
  dropdownItemSelectedStyle,
  dropdownItemHoverStyle,
} from "../utils/user_options";
import { useDropdownDismiss } from "@/app/utils/use-dropdown-dismiss";
import { useBodyScrollLock } from "@/app/utils/use-body-scroll-lock";

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
  useDropdownDismiss(activeDropdown !== null, () => setActiveDropdown(null));

  const YEAR_OPTIONS = [
    { value: "", label: "Select Year Level" },
    ...BASE_YEAR_OPTIONS,
  ];

  const selectedRoleLabel = ROLE_OPTIONS.find((o) => o.value === formData.role)?.label ?? "Select Role";
  const selectedYearLabel = YEAR_OPTIONS.find((o) => o.value === formData.yearLevel)?.label ?? "Select Year Level";
  const selectedMembershipLabel = MEMBERSHIP_OPTIONS.find((o) => o.value === formData.membershipStatus)?.label ?? "Non-Member";

  useBodyScrollLock(isOpen);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [dropUp, setDropUp] = useState(false);

  // An open list that would run past the bottom of the modal opens upward
  // instead (when there is room above); otherwise it scrolls into view.
  useEffect(() => {
    if (!activeDropdown) {
      setDropUp(false);
      return;
    }
    const frame = requestAnimationFrame(() => {
      const box = scrollRef.current?.getBoundingClientRect();
      const panel = scrollRef.current?.querySelector("[data-dropdown-panel]");
      if (!box || !panel || !panel.parentElement) return;

      const rect = panel.getBoundingClientRect();
      const spaceAbove = panel.parentElement.getBoundingClientRect().top - box.top;
      const overflowsBelow = rect.bottom > box.bottom - 8;

      if (overflowsBelow && spaceAbove > rect.height + 8) {
        setDropUp(true);
      } else {
        panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [activeDropdown]);

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
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-100000 w-full max-w-2xl bg-white rounded-4xl shadow-2xl border border-white/50 animate-scale-in flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header — fixed, never scrolls away */}
        <div className="flex items-center justify-between px-6 sm:px-7 pt-6 sm:pt-7 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-xl font-rubik font-bold text-primary3">
              Edit User
            </h3>
            <p className="text-sm font-raleway text-gray-500 mt-0.5">
              Editing: {user.fullName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div ref={scrollRef} className={`overflow-y-auto themed-scrollbar px-6 sm:px-7 py-5 flex-1`}>
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
              className={`w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 text-gray-800 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 ${
                errors.studentNumber ? "border-red-300 ring-2 ring-red-100" : ""
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
                className={`w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 text-gray-800 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 ${
                  errors.firstName ? "border-red-300 ring-2 ring-red-100" : ""
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
                className="w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 text-gray-800 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10"
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
                className={`w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 text-gray-800 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 ${
                  errors.lastName ? "border-red-300 ring-2 ring-red-100" : ""
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
              <div data-dropdown className="relative">
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
                    <div
                      data-dropdown-panel
                      className={`${dropdownOuterStyle} scroll-mb-4 ${dropUp ? "bottom-full mb-2 mt-0!" : ""}`}
                    >
                      <div className={dropdownInnerStyle}>
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
              <div data-dropdown className="relative">
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
                    <div
                      data-dropdown-panel
                      className={`${dropdownOuterStyle} scroll-mb-4 ${dropUp ? "bottom-full mb-2 mt-0!" : ""}`}
                    >
                      <div className={dropdownInnerStyle}>
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
            <div data-dropdown className="relative">
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
                  <div
                      data-dropdown-panel
                      className={`${dropdownOuterStyle} scroll-mb-4 ${dropUp ? "bottom-full mb-2 mt-0!" : ""}`}
                    >
                    <div className={dropdownInnerStyle}>
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
          </div>

          <div className="flex justify-end gap-3 px-6 sm:px-7 pt-4 pb-6 sm:pb-7 border-t border-gray-100 shrink-0">
            <Button
              variant="heroOutline"
              type="button"
              onClick={onClose}
              className="px-4 py-2 sm:px-6 sm:py-3"
            >
              Cancel
            </Button>
            <Button variant="hero" type="submit" className="px-5 py-2 sm:px-8 sm:py-3">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
