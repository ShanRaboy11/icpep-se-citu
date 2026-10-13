"use client";

import { useEffect, useRef, useState } from "react";
import { X, UserPlus, AlertCircle, ChevronDown, Check } from "lucide-react";
import { PiPlaceholder } from "react-icons/pi";
import Button from "../../components/button";
import {
  YEAR_OPTIONS,
  ROLE_OPTIONS as ALL_ROLE_OPTIONS,
  MEMBERSHIP_OPTIONS as BASE_MEMBERSHIP_OPTIONS,
  dropdownOuterStyle,
  dropdownInnerStyle,
  dropdownItemStyle,
  dropdownItemSelectedStyle,
  dropdownItemHoverStyle,
} from "../utils/user_options";
import { useDropdownDismiss } from "@/app/utils/use-dropdown-dismiss";
import { useBodyScrollLock } from "@/app/utils/use-body-scroll-lock";

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
  email?: string;
  yearLevel?: number;
  role: string;
  position?: string;
  department?: string;
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
    email: "",
    yearLevel: undefined,
    role: "student",
    position: "",
    department: "",
    membershipStatus: "non-member",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  useDropdownDismiss(activeDropdown !== null, () => setActiveDropdown(null));

  const isAdmin =
    typeof window !== "undefined" && localStorage.getItem("userRole") === "admin";
  const ROLE_OPTIONS = ALL_ROLE_OPTIONS.filter(
    (o) => o.value !== "admin" || isAdmin,
  );
  const MEMBERSHIP_OPTIONS = [
    BASE_MEMBERSHIP_OPTIONS[0],
    { value: "member", label: "Member" },
    ...BASE_MEMBERSHIP_OPTIONS.slice(1),
  ];

  const selectedYearLabel = YEAR_OPTIONS.find((o) => o.value === String(formData.yearLevel || ""))?.label ?? "Select Year Level";
  const selectedRoleLabel = ROLE_OPTIONS.find((o) => o.value === formData.role)?.label ?? "Student";
  // Faculty aren't students, so they get an employee ID and no year level.
  // Everyone else (students and officers are students too) gets a student ID.
  const isFaculty = formData.role === "faculty";
  const isStudent = formData.role === "student";
  const isOfficer = formData.role === "council-officer" || formData.role === "committee-officer";
  const showsPosition = isOfficer || isFaculty;
  const showsDepartment = formData.role === "committee-officer" || isFaculty;
  const idLabel = isFaculty ? "Employee ID Number" : "Student ID Number";
  const idPlaceholder = isFaculty ? "e.g. 2024-0001" : "23-2502-326";
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = `${idLabel} is required`;
    }
    const email = (formData.email ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
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
      email: "",
      yearLevel: undefined,
      role: "student",
      position: "",
      department: "",
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
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      <div className="relative z-100000 w-full max-w-2xl bg-white rounded-4xl shadow-2xl border border-white/50 animate-scale-in flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header — fixed, never scrolls away */}
        <div className="flex items-center justify-between px-6 sm:px-7 pt-6 sm:pt-7 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary1/10 rounded-2xl text-primary1 shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-rubik font-bold text-primary3">
                Add New User
              </h3>
              <p className="text-sm font-raleway text-gray-500 mt-0.5">
                Register a new user to the system.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div ref={scrollRef} className={`space-y-4 overflow-y-auto themed-scrollbar px-6 sm:px-7 py-5 flex-1`}>
            {/* ID Number (student or employee) */}
            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                {idLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="studentNumber"
                value={formData.studentNumber}
                onChange={handleChange}
                placeholder={idPlaceholder}
                className={`w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 text-gray-800 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 ${
                  errors.studentNumber ? "border-red-300 ring-2 ring-red-100" : ""
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
                  className={`w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 text-gray-800 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 ${
                    errors.firstName ? "border-red-300 ring-2 ring-red-100" : ""
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
                  className="w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 text-gray-800 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10"
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
                  className={`w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 text-gray-800 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 ${
                    errors.lastName ? "border-red-300 ring-2 ring-red-100" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 font-raleway">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                School Email <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@cit.edu"
                className={`w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 text-gray-800 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 ${
                  errors.email ? "border-red-300 ring-2 ring-red-100" : ""
                }`}
              />
              {errors.email ? (
                <p className="mt-1 text-sm text-red-600 font-raleway">{errors.email}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500 font-raleway">
                  Leave blank to use firstname.lastname@cit.edu. The first-login code is sent here.
                </p>
              )}
            </div>

            {/* Position and department — officers and faculty only */}
            {showsPosition && (
              <div className={`grid grid-cols-1 gap-4 ${showsDepartment ? "md:grid-cols-2" : ""}`}>
                <div>
                  <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                    {isFaculty ? "Position" : "Officer Position"} <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder={isFaculty ? "e.g. Department Head" : "e.g. President"}
                    className="w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 text-gray-800 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10"
                  />
                </div>
                {showsDepartment && (
                  <div>
                    <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                      {isFaculty ? "Department" : "Committee"} <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder={isFaculty ? "e.g. Computer Engineering" : "e.g. Internal Affairs"}
                      className="w-full font-rubik text-base bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none transition-all placeholder-gray-400 text-gray-800 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Year Level and Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Year Level — students and officers only */}
              {!isFaculty && (
              <div>
                <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                  Year Level
                </label>
                <div data-dropdown className="relative">
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
                      <div
                      data-dropdown-panel
                      className={`${dropdownOuterStyle} scroll-mb-4 ${dropUp ? "bottom-full mb-2 mt-0!" : ""}`}
                    >
                        <div className={dropdownInnerStyle}>
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
                      </div>
                    </>
                  )}
                </div>
                {errors.yearLevel && (
                  <p className="mt-1 text-sm text-red-600 font-raleway">{errors.yearLevel}</p>
                )}
              </div>
              )}

            </div>

            {/* Role and Membership */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <div>
                <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <div data-dropdown className="relative">
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
                      <div
                      data-dropdown-panel
                      className={`${dropdownOuterStyle} scroll-mb-4 ${dropUp ? "bottom-full mb-2 mt-0!" : ""}`}
                    >
                        <div className={dropdownInnerStyle}>
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
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-raleway text-sm text-blue-800">
                <strong>Note:</strong> A one-time first-login code is emailed
                to the school email. The user signs in with it and chooses
                their own password.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 sm:px-7 pt-4 pb-6 sm:pb-7 border-t border-gray-100 shrink-0">
            <Button
              variant="heroOutline"
              type="button"
              onClick={handleClose}
              className="whitespace-nowrap px-4 py-2 sm:px-6 sm:py-3"
            >
              Cancel
            </Button>
            <Button variant="hero" type="submit" className="whitespace-nowrap px-5 py-2 sm:px-8 sm:py-3">
              Add User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
