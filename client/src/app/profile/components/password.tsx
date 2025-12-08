"use client";

import {
  X,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Button from "@/app/components/button";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import authService from "@/app/services/auth";

interface SecuritySectionProps {
  loading?: boolean;
}

export default function SecuritySection({
  loading = false,
}: SecuritySectionProps) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentRef = useRef<HTMLInputElement | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const openModal = () => {
    setError(null);
    setSuccess(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => currentRef.current?.focus(), 0);
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const closeModal = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!currentPassword) return setError("Please enter your current password");
    if (!newPassword || newPassword.length < 6)
      return setError("New password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    try {
      setSubmitting(true);
      const res = await authService.changePassword(
        currentPassword,
        newPassword
      );
      if (res && res.success) {
        setSuccess(res.message || "Password changed successfully");
        setTimeout(() => setOpen(false), 1200);
      } else {
        setError(res.message || "Failed to change password");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative w-full border border-primary1/10 rounded-3xl p-5 bg-white shadow-lg overflow-hidden">
        <div className="absolute inset-0 -translate-x-full shimmer-bg-animate" />
        <div className="flex items-center gap-4 mb-4 pb-3 border-b border-primary1/5">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
          <div className="h-6 w-32 bg-gray-100 rounded-md" />
        </div>
        <div className="flex justify-between items-center px-1">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-9 w-24 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-primary1/10 rounded-3xl p-5 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header - Styled to match "Update Profile" card exactly */}
      <div className="flex items-center gap-4 mb-4 pb-3 border-b border-primary1/5">
        <div className="p-3 bg-primary1/10 rounded-2xl text-primary1 flex-shrink-0">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-rubik font-bold text-primary3 leading-tight">
            Security
          </h2>
          <p className="font-raleway text-xs text-gray-500 mt-0.5">
            Manage your password
          </p>
        </div>
      </div>

      {/* Content Row */}
      <div className="flex flex-row items-center justify-between px-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="text-gray-600 font-raleway font-semibold text-sm">
            Password
          </span>
          <span className="text-sm font-raleway text-gray-400 hidden sm:inline tracking-widest mt-1 sm:mt-0">
            ••••••••
          </span>
        </div>

        <Button
          variant="secondary2"
          className="px-5 py-2.5 rounded-xl shadow-md font-rubik font-semibold text-sm whitespace-nowrap cursor-pointer hover:scale-105 transition-transform"
          onClick={openModal}
        >
          {/* Responsive Text */}
          <span className="sm:hidden">Update Password</span>
          <span className="hidden sm:inline">Update</span>
        </Button>
      </div>

      {/* --- Password Modal --- */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            />
            <div className="relative z-[100000] w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border border-white/50 animate-scale-in">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-2xl font-rubik font-bold text-primary3">
                    Change Password
                  </h3>
                  <p className="text-sm font-raleway text-gray-500 mt-1">
                    Secure your account.
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <PasswordField
                  label="Current Password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  show={showCurrent}
                  onToggle={() => setShowCurrent(!showCurrent)}
                  ref={currentRef}
                />

                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  show={showNew}
                  onToggle={() => setShowNew(!showNew)}
                  hint="Must be at least 6 characters"
                />

                <PasswordField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showConfirm}
                  onToggle={() => setShowConfirm(!showConfirm)}
                />

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-raleway font-medium">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm font-raleway font-medium">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 font-rubik font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="primary3"
                    className="px-6 py-2.5 rounded-xl font-rubik font-semibold shadow-lg shadow-primary3/20 cursor-pointer"
                    disabled={submitting}
                  >
                    {submitting ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

// Reusable Password Input Field with Modern Styling
function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  hint,
  ref,
}: any) {
  return (
    <div>
      <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full font-rubik bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-12 outline-none focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 transition-all text-gray-800 placeholder-gray-400 shadow-sm focus:shadow-md"
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {hint && (
        <p className="text-xs text-gray-400 mt-1.5 font-raleway font-medium ml-1">
          {hint}
        </p>
      )}
    </div>
  );
}
