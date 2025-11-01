"use client";

import { useState } from "react";
import { X, UserPlus, AlertCircle } from "lucide-react";
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
    role: "member",
    membershipStatus: "non-member",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!formData.password.trim() || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
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
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
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
              <div>
                <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                  Year Level
                </label>
                <select
                  name="yearLevel"
                  value={formData.yearLevel || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg font-raleway text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary1/50 ${
                    errors.yearLevel ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                {errors.yearLevel && (
                  <p className="mt-1 text-sm text-red-600 font-raleway">
                    {errors.yearLevel}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="123456"
                  className={`w-full px-4 py-2 border rounded-lg font-raleway text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary1/50 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 font-raleway">
                    {errors.password}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 font-raleway">
                  Default: 123456
                </p>
              </div>
            </div>

            {/* Role and Membership */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-400 border border-gray-300 rounded-lg text-gray-500 font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50"
                >
                  <option value="student">Student</option>
                  <option value="council-officer">Council Officer</option>
                  <option value="committee-officer">Committee Officer</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>

              <div>
                <label className="block font-raleway text-sm font-semibold text-gray-700 mb-2">
                  Membership Status
                </label>
                <select
                  name="membershipStatus"
                  value={formData.membershipStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-400 border border-gray-300 rounded-lg text-gray-500 font-raleway focus:outline-none focus:ring-2 focus:ring-primary1/50"
                >
                  <option value="non-member">Non-Member</option>
                  <option value="member">Member</option>
                  <option value="local">Local</option>
                  <option value="regional">Regional</option>
                  <option value="both">Both (Local & Regional)</option>
                </select>
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
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-raleway font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-primary1 to-primary1/90 text-white font-raleway font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}
