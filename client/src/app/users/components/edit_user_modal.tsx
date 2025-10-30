"use client";

import { X, Save } from "lucide-react";
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const role: User['role'] = formData.role as User['role']; 

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">
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
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
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
            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-2 text-gray-400 border-2 rounded-lg font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50 ${
                  errors.role
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primary1"
                }`}
              >
                <option value="">Select Role</option>
                <option value="member">Student</option>
                <option value="council-officer">Council Officer</option>
                <option value="committee-officer">Committee Officer</option>
                <option value="faculty">Faculty</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500 font-raleway">
                  {errors.role}
                </p>
              )}
            </div>

            <div>
              <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                Year Level
              </label>
              <select
                name="yearLevel"
                value={formData.yearLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 text-gray-400 border-gray-300 rounded-lg font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50 focus:border-primary1"
              >
                <option value="">Select Year Level</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>

          {/* Membership Status */}
          <div className="mb-4">
            <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
              Membership Status
            </label>
            <select
              name="membershipStatus"
              value={formData.membershipStatus}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 text-gray-400 border-gray-300 rounded-lg font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50 focus:border-primary1"
            >
              <option value="non-member">Non-Member</option>
              <option value="local">Local Member</option>
              <option value="regional">Regional Member</option>
              <option value="both">Both (Local & Regional)</option>
            </select>
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
                <span className="font-raleway text-sm text-gray-700">Active</span>
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
                <span className="font-raleway text-sm text-gray-700">Inactive</span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-raleway font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-primary1 text-white font-raleway font-semibold rounded-lg hover:bg-primary1/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}