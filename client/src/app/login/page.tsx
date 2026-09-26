"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff, AlertCircle, X, Check, CheckCircle } from "lucide-react";
import Image from "next/image";
import Button from "@/app/components/button";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const REMEMBERED_STUDENT_NUMBER_KEY = "rememberedStudentNumber";

const validatePassword = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isValid = Object.values(checks).every((check) => check);

  return { isValid, checks };
};

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
};

type PasswordChecks = ReturnType<typeof validatePassword>["checks"];

const PASSWORD_REQUIREMENTS: { key: keyof PasswordChecks; label: string }[] = [
  { key: "length", label: "At least 8 characters" },
  { key: "uppercase", label: "One uppercase letter" },
  { key: "lowercase", label: "One lowercase letter" },
  { key: "number", label: "One number" },
  { key: "special", label: "One special character (!@#$%^&*...)" },
];

function PasswordRequirements({ checks }: { checks: PasswordChecks }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
      <p className="text-xs font-semibold text-gray-700 font-[Raleway] mb-2">
        Password Requirements:
      </p>
      <ul className="space-y-1">
        {PASSWORD_REQUIREMENTS.map(({ key, label }) => (
          <li
            key={key}
            className="flex items-center gap-2 text-xs font-[Raleway]"
          >
            {checks[key] ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <X size={14} className="text-gray-400" />
            )}
            <span className={checks[key] ? "text-green-600" : "text-gray-600"}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Login() {
  const router = useRouter();

  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Student Number, 2: Code, 3: New Password
  const [resetCode, setResetCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "Password Changed Successfully!",
    description:
      "Your password has been updated. Please log in with your new password to continue.",
  });
  const [fieldErrors, setFieldErrors] = useState({
    studentNumber: false,
    password: false,
    newPassword: false,
    confirmPassword: false,
    resetCode: false,
  });

  const passwordValidation = validatePassword(newPassword);

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBERED_STUDENT_NUMBER_KEY);
    if (remembered) {
      setStudentNumber(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let newErrors = {
      studentNumber: false,
      password: false,
      newPassword: false,
      confirmPassword: false,
      resetCode: false,
    };

    if (!studentNumber || !password) {
      setError("Please fill in all required fields.");
      newErrors = {
        ...newErrors,
        studentNumber: !studentNumber,
        password: !password,
      };
      setFieldErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          studentNumber: studentNumber.toUpperCase(),
          password,
        }),
      });

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem(
        "userName",
        data.user.fullName || `${data.user.firstName} ${data.user.lastName}`,
      );

      if (rememberMe) {
        localStorage.setItem(
          REMEMBERED_STUDENT_NUMBER_KEY,
          studentNumber.toUpperCase(),
        );
      } else {
        localStorage.removeItem(REMEMBERED_STUDENT_NUMBER_KEY);
      }

      if (data.user.firstLogin) {
        setRequiresPasswordChange(true);
        setError("");
        setPassword("");
      } else {
        router.push("/home");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setError(errorMessage);
      newErrors = {
        ...newErrors,
        studentNumber: true,
        password: true,
      };
      setFieldErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let newErrors = {
      studentNumber: false,
      password: false,
      newPassword: false,
      confirmPassword: false,
      resetCode: false,
    };

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all required fields.");
      newErrors = {
        ...newErrors,
        newPassword: !newPassword,
        confirmPassword: !confirmPassword,
      };
      setFieldErrors(newErrors);
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Password does not meet all security requirements.");
      newErrors.newPassword = true;
      setFieldErrors(newErrors);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      newErrors = {
        ...newErrors,
        newPassword: true,
        confirmPassword: true,
      };
      setFieldErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${API_BASE_URL}/auth/first-login-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join(". "));
        }
        throw new Error(data.message || "Password change failed");
      }

      setError("");
      setSuccessMessage({
        title: "Password Changed Successfully!",
        description:
          "Your password has been updated. Please log in with your new password to continue.",
      });
      setShowSuccessModal(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Password change failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);

    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    setRequiresPasswordChange(false);
    setIsForgotPassword(false);
    setForgotPasswordStep(1);
    setStudentNumber("");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setResetCode("");
    setMaskedEmail("");
    setFieldErrors({
      studentNumber: false,
      password: false,
      newPassword: false,
      confirmPassword: false,
      resetCode: false,
    });
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNumber) {
      setError("Please enter your student number.");
      setFieldErrors((prev) => ({ ...prev, studentNumber: true }));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await apiCall("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ studentNumber }),
      });

      if (data.email) {
        const [user, domain] = data.email.split("@");
        const masked = `${user.slice(0, 1)}***${user.slice(-1)}@${domain}`;
        setMaskedEmail(masked);
      }

      setForgotPasswordStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode) {
      setError("Please enter the verification code.");
      setFieldErrors((prev) => ({ ...prev, resetCode: true }));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await apiCall("/auth/verify-code", {
        method: "POST",
        body: JSON.stringify({ studentNumber, code: resetCode }),
      });

      setForgotPasswordStep(3);
    } catch (err: any) {
      setError(err.message || "Invalid code.");
      setFieldErrors((prev) => ({ ...prev, resetCode: true }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      setFieldErrors((prev) => ({
        ...prev,
        newPassword: !newPassword,
        confirmPassword: !confirmPassword,
      }));
      return;
    }

    if (!passwordValidation.isValid) {
      setError("Password does not meet all security requirements.");
      setFieldErrors((prev) => ({ ...prev, newPassword: true }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setFieldErrors((prev) => ({
        ...prev,
        newPassword: true,
        confirmPassword: true,
      }));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await apiCall("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          studentNumber,
          code: resetCode,
          password: newPassword,
        }),
      });

      setSuccessMessage({
        title: "Password Reset Successfully!",
        description:
          "Your password has been updated. Please log in with your new password to continue.",
      });
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setForgotPasswordStep(1);
    setError("");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
    setMaskedEmail("");
    setFieldErrors({
      studentNumber: false,
      password: false,
      newPassword: false,
      confirmPassword: false,
      resetCode: false,
    });
  };

  const getInputClass = (hasError: boolean) =>
    `w-full px-4 py-2.5 border rounded-lg transition-all duration-200 outline-none ${
      hasError
        ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 bg-gray-50/30 focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 placeholder:text-gray-400"
    }`;

  const handleFocus = (field: keyof typeof fieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleClose = () => {
    if (requiresPasswordChange) {
      if (
        window.confirm(
          "Are you sure? You need to change your password before accessing the system.",
        )
      ) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center font-rubik relative overflow-hidden"
      style={{ backgroundColor: "#FEFEFF" }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-3/4 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-200 lg:h-240 bg-linear-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-1"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-120 lg:h-120 bg-linear-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-240 lg:h-240 bg-linear-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-3"></div>
      </div>

      <div
        className="absolute top-15 right-5 sm:right-20 cursor-pointer text-primary3 hover:text-primary2 hover:scale-130 transition-all duration-200"
        onClick={handleClose}
      >
        <X size={30} strokeWidth={2} />
      </div>

      <div className="relative z-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.08)] rounded-2xl px-8 py-10 sm:px-10 w-[90%] max-w-md text-gray-800 border border-gray-50/50">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/brand/icpep-logo.png"
            alt="ICpEP Logo"
            width={64}
            height={64}
            priority
            className="w-16 h-16 mb-3"
          />
          <h1 className="text-2xl sm:text-3xl font-semibold text-center">
            {isForgotPassword
              ? "Reset Password"
              : requiresPasswordChange
                ? "Change Password"
                : "Welcome to ICpEP SE!"}
          </h1>
          <p className="text-gray-500 text-md font-[Raleway] text-center mb-5">
            {isForgotPassword
              ? "Follow the steps to recover your account."
              : requiresPasswordChange
                ? "For security reasons, you must change your password before accessing the system."
                : "Please log in to access your account."}
          </p>
        </div>

        {isForgotPassword ? (
          forgotPasswordStep === 1 ? (
            <form onSubmit={handleSendResetCode} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-600 font-[Raleway]">
                  Student Number
                </label>
                <div className="mt-1.5">
                  <input
                    type="text"
                    value={studentNumber}
                    onFocus={() => handleFocus("studentNumber")}
                    onChange={(e) =>
                      setStudentNumber(e.target.value.toUpperCase())
                    }
                    placeholder="xx-xxxx-xxx"
                    className={getInputClass(fieldErrors.studentNumber)}
                    autoComplete="off"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm animate-fadeIn">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <Button
                variant="primary3"
                className="sm:block border-2 w-full rounded-full bg-sky-400 text-white font-medium mt-10 hover:bg-primary3"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Sending Code..." : "Send Reset Code"}
              </Button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-center text-sm text-gray-500 hover:text-primary3 underline cursor-pointer"
              >
                Back to Login
              </button>
            </form>
          ) : forgotPasswordStep === 2 ? (
            <form onSubmit={handleVerifyResetCode} className="space-y-5">
              <p className="text-sm text-gray-500 font-[Raleway] -mt-2">
                {maskedEmail
                  ? `We sent a verification code to ${maskedEmail}.`
                  : "We sent a verification code to your registered email."}
              </p>

              <div>
                <label className="text-sm font-semibold text-gray-600 font-[Raleway]">
                  Verification Code
                </label>
                <div className="mt-1.5">
                  <input
                    type="text"
                    value={resetCode}
                    onFocus={() => handleFocus("resetCode")}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter the code sent to your email"
                    className={getInputClass(fieldErrors.resetCode)}
                    autoComplete="off"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm animate-fadeIn">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <Button
                variant="primary3"
                className="sm:block border-2 w-full rounded-full bg-sky-400 text-white font-medium mt-10 hover:bg-primary3"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setForgotPasswordStep(1);
                  setError("");
                }}
                className="w-full text-center text-sm text-gray-500 hover:text-primary3 underline cursor-pointer"
              >
                Back
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-600 font-[Raleway]">
                  New Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onFocus={() => handleFocus("newPassword")}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={getInputClass(fieldErrors.newPassword)}
                    autoComplete="off"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-500 flex items-center justify-center cursor-pointer"
                    disabled={isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 font-[Raleway]">
                  Confirm New Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onFocus={() => handleFocus("confirmPassword")}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className={getInputClass(fieldErrors.confirmPassword)}
                    autoComplete="off"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-500 flex items-center justify-center cursor-pointer"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm animate-fadeIn">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <PasswordRequirements checks={passwordValidation.checks} />

              <Button
                variant="primary3"
                className="sm:block border-2 w-full rounded-full bg-sky-400 text-white font-medium mt-10 hover:bg-primary3"
                type="submit"
                disabled={isLoading || !passwordValidation.isValid}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setForgotPasswordStep(2);
                  setError("");
                }}
                className="w-full text-center text-sm text-gray-500 hover:text-primary3 underline cursor-pointer"
              >
                Back
              </button>
            </form>
          )
        ) : !requiresPasswordChange ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-600 font-[Raleway]">
                Student Number
              </label>
              <div className="mt-1.5">
                <input
                  type="text"
                  value={studentNumber}
                  onFocus={() => handleFocus("studentNumber")}
                  onChange={(e) =>
                    setStudentNumber(e.target.value.toUpperCase())
                  }
                  placeholder="xx-xxxx-xxx"
                  className={getInputClass(fieldErrors.studentNumber)}
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 font-[Raleway]">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onFocus={() => handleFocus("password")}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={getInputClass(fieldErrors.password)}
                  autoComplete="off"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-500 flex items-center justify-center cursor-pointer"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm animate-fadeIn">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm font-[Raleway]">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 focus:ring-offset-0 transition-all cursor-pointer"
                />
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-primary3 hover:text-sky-600 underline cursor-pointer"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError("");
                }}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              variant="primary3"
              className="sm:block border-2 w-full rounded-full bg-sky-400 text-white font-medium mt-10 hover:bg-primary3"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-600 font-[Raleway]">
                New Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onFocus={() => handleFocus("newPassword")}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={getInputClass(fieldErrors.newPassword)}
                  autoComplete="off"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-500 flex items-center justify-center cursor-pointer"
                  disabled={isLoading}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 font-[Raleway]">
                Confirm New Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onFocus={() => handleFocus("confirmPassword")}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className={getInputClass(fieldErrors.confirmPassword)}
                  autoComplete="off"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-500 flex items-center justify-center cursor-pointer"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm animate-fadeIn">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <PasswordRequirements checks={passwordValidation.checks} />

            <Button
              variant="primary3"
              className="sm:block border-2 w-full rounded-full bg-sky-400 text-white font-medium mt-10 hover:bg-primary3"
              type="submit"
              disabled={isLoading || !passwordValidation.isValid}
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        )}

        <style>{`
        @keyframes orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(40vw) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(40vw) rotate(-360deg);
          }
        }
        
        .animate-orbit-1 {
          animation: orbit 20s linear infinite;
        }
        
        .animate-orbit-2 {
          animation: orbit 20s linear infinite;
          animation-delay: -6.66s;
        }
        
        .animate-orbit-3 {
          animation: orbit 20s linear infinite;
          animation-delay: -13.33s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full animate-scaleIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <h3 className="font-rubik text-2xl font-bold text-primary3 mb-2">
                {successMessage.title}
              </h3>

              <p className="font-raleway text-gray-600 mb-6">
                {successMessage.description}
              </p>

              <Button
                variant="primary3"
                className="w-full rounded-full bg-sky-400 text-white font-raleway font-semibold hover:bg-primary3 transition-colors duration-300"
                onClick={handleSuccessModalClose}
              >
                Continue to Login
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
