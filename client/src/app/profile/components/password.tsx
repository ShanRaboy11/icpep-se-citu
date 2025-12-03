"use client";
import { X, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "@/app/components/button";
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import authService from '@/app/services/auth';

export default function SecuritySection() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentRef = useRef<HTMLInputElement | null>(null);

  const openModal = () => {
    setError(null);
    setSuccess(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setTimeout(() => currentRef.current?.focus(), 0);

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
        }
      };

      window.addEventListener('keydown', onKey);

      return () => {
        window.removeEventListener('keydown', onKey);
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [open]);

  const closeModal = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) return setError('Please enter your current password');
    if (!newPassword || newPassword.length < 6) return setError('New password must be at least 6 characters');
    if (newPassword !== confirmPassword) return setError('New password and confirmation do not match');

    try {
      setLoading(true);
      const res = await authService.changePassword(currentPassword, newPassword);
      if (res && res.success) {
        setSuccess(res.message || 'Password changed successfully');
        setTimeout(() => {
          setOpen(false);
        }, 1200);
      } else {
        setError(res.message || 'Failed to change password');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full border border-primary1/30 rounded-2xl p-6 px-7 sm:px-10 sm:py-8 bg-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
      {/* Header with icon */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary1/20">
        <div className="p-2 bg-primary1/10 rounded-lg hover:bg-primary1/20 transition-colors duration-300">
          <Shield className="w-5 h-5 text-primary1" />
        </div>
        <h2 className="text-xl sm:text-2xl font-rubik text-primary3 font-bold">
          Security
        </h2>
      </div>

      <div className="flex flex-row items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-raleway text-lg font-medium">Password</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:inline">
            Last changed 1 month ago
          </span>

          <Button
            variant="primary2"
            className="flex items-center gap-2 whitespace-nowrap hover:scale-105 transition-transform duration-200"
            onClick={openModal}
          >
            Update
          </Button>
        </div>
      </div>

      {/* Enhanced Modal (rendered into document.body via portal to avoid clipping by parent stacking contexts) */}
      {open && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div
            className="relative z-[100000] w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-title"
            style={{
              animation: 'fadeIn 0.3s ease-out, slideUp 0.3s ease-out'
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 id="change-password-title" className="text-xl font-rubik font-bold text-primary3">
                  Change Password
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-raleway">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    ref={currentRef}
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all duration-200 font-rubik"
                    placeholder="Enter current password"
                    required
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-raleway">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all duration-200 font-rubik"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 font-raleway">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-raleway">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary1 focus:ring-2 focus:ring-primary1/20 outline-none transition-all duration-200 font-rubik"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="font-raleway">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="font-raleway">{success}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-6 py-2.5 rounded-xl border-2 border-gray-200 font-rubik font-semibold text-gray-700 hover:cursor-pointer hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <Button 
                  type="submit" 
                  variant="primary2" 
                  className="px-6 py-2.5 flex items-center gap-2 hover:scale-105 transition-transform duration-200" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>Update Password</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}