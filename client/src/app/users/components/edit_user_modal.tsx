"use client";

import { X } from "lucide-react";
import { User } from "../utils/user"; // Ensure this path is correct
import { useState } from "react";
import Button from "../../components/button";
import {
  YEAR_OPTIONS as BASE_YEAR_OPTIONS,
  ROLE_OPTIONS,
  MEMBERSHIP_OPTIONS,
} from "../utils/user_options";
import Dropdown from "@/app/components/dropdown";
import { useBodyScrollLock } from "@/app/utils/use-body-scroll-lock";
import GenderSelect, { GenderValue } from "@/app/components/gender-select";

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
    gender: (user.gender || "") as GenderValue,
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

  const YEAR_OPTIONS = [
    { value: "", label: "Select Year Level" },
    ...BASE_YEAR_OPTIONS,
  ];


  useBodyScrollLock(isOpen);

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
      gender: formData.gender || null,
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
          <div className={`overflow-y-auto themed-scrollbar px-6 sm:px-7 py-5 flex-1`}>
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
                Placeholder Photo
              </label>
              <GenderSelect
                value={formData.gender}
                onChange={(gender) => setFormData((prev) => ({ ...prev, gender }))}
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
              <Dropdown
                variant="field"
                value={formData.role}
                options={ROLE_OPTIONS}
                onChange={(value) => setFormData((prev) => ({ ...prev, role: value as typeof prev.role }))}
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-500 font-raleway">{errors.role}</p>
              )}
            </div>

            {/* Year Level Dropdown */}
            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                Year Level
              </label>
              <Dropdown
                variant="field"
                value={formData.yearLevel}
                invalid={!!errors.yearLevel}
                placeholder="Select Year Level"
                options={YEAR_OPTIONS.filter((o) => o.value !== "")}
                onChange={(value) => setFormData((prev) => ({ ...prev, yearLevel: value }))}
              />
            </div>
          </div>

          {/* Membership Status */}
          <div className="mb-4">
            <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
              Membership Status
            </label>
            <Dropdown
              variant="field"
              value={formData.membershipStatus}
              options={MEMBERSHIP_OPTIONS}
              onChange={(value) => setFormData((prev) => ({ ...prev, membershipStatus: value }))}
            />
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
              className="whitespace-nowrap px-4 py-2 sm:px-6 sm:py-3"
            >
              Cancel
            </Button>
            <Button variant="hero" type="submit" className="whitespace-nowrap px-5 py-2 sm:px-8 sm:py-3">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
