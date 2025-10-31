"use client";

import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, X } from "lucide-react";
import Button from "@/app/components/button";
import { useRouter } from "next/navigation";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
};

export default function Login() {
  const router = useRouter();
  
  // State management
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    studentNumber: false,
    password: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Handle initial login
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  
  // Validation
  let newErrors = { 
    studentNumber: false, 
    password: false,
    newPassword: false,
    confirmPassword: false 
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
    const loginData = {
      studentNumber: studentNumber.toUpperCase(),
      password,
    };
    
    console.log('🔐 Login attempt:', {
      studentNumber: loginData.studentNumber,
      passwordLength: password.length,
      apiUrl: `${API_BASE_URL}/auth/login`
    });

    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    console.log('✅ Login successful:', data);

    // ... rest of your code
  } catch (error) {
    console.error('❌ Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
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

  // Handle password change on first login
const handlePasswordChange = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  // Validation
  let newErrors = {
    studentNumber: false,
    password: false,
    newPassword: false,
    confirmPassword: false,
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

  if (newPassword.length < 6) {
    setError("Password must be at least 6 characters long.");
    newErrors.newPassword = true;
    setFieldErrors(newErrors);
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match.");
    newErrors = { 
      ...newErrors, 
      newPassword: true, 
      confirmPassword: true 
    };
    setFieldErrors(newErrors);
    return;
  }

  if (newPassword === '123456') {
    setError("Please choose a different password from the default.");
    newErrors.newPassword = true;
    setFieldErrors(newErrors);
    return;
  }

  setIsLoading(true);

  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/auth/first-login-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password change failed');
    }

    setError("");
    alert("✅ Password changed successfully! Please log in with your new password.");
    
    // Clear everything and return to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setRequiresPasswordChange(false);
    setIsFirstLogin(false);
    setStudentNumber("");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFieldErrors({
      studentNumber: false,
      password: false,
      newPassword: false,
      confirmPassword: false,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Password change failed';
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const getInputClass = (hasError: boolean) =>
    `mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none transition-all ${
      hasError
        ? "border-red-500 bg-red-50 border-2 focus:ring-red-400"
        : "border-gray-300 focus:ring-sky-400"
    }`;

  const handleFocus = (field: keyof typeof fieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleClose = () => {
    if (requiresPasswordChange) {
      // If in password change mode, ask for confirmation
      if (window.confirm("Are you sure? You need to change your password before accessing the system.")) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center font-rubik relative overflow-hidden"
      style={{ backgroundColor: "#FEFEFF" }}
    >
      {/* Blurry blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-3/4 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[50rem] lg:h-[60rem] bg-gradient-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-1"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] bg-gradient-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[60rem] lg:h-[60rem] bg-gradient-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-3"></div>
      </div>

      <div
        className="absolute top-15 right-5 sm:right-20 cursor-pointer text-primary3 hover:text-primary2 hover:scale-130 transition-all duration-200"
        onClick={handleClose}
      >
        <X size={30} strokeWidth={2} />
      </div>

      {/* Login Card */}
      <div className="relative z-10 bg-white shadow-2xl rounded-2xl px-8 py-10 sm:px-10 w-[90%] max-w-md text-gray-800">
        <div className="flex flex-col items-center mb-6">
          <img
            src="./icpep logo.png"
            alt="ICpEP Logo"
            className="w-16 h-16 mb-3"
          />
          <h1 className="text-2xl sm:text-3xl font-semibold text-center">
            {requiresPasswordChange ? "Change Password" : "Welcome to ICpEP SE!"}
          </h1>
          <p className="text-gray-500 text-md font-[Raleway] text-center mb-5">
            {requiresPasswordChange
              ? "Please change your password to continue."
              : "Please log in to access your account."}
          </p>
        </div>

        {!requiresPasswordChange ? (
          // Login Form
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-[Raleway]">
                Student Number
              </label>
              <input
                type="text"
                value={studentNumber}
                onFocus={() => handleFocus("studentNumber")}
                onChange={(e) => setStudentNumber(e.target.value.toUpperCase())}
                placeholder="xx-xxxx-xxx"
                className={getInputClass(fieldErrors.studentNumber)}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <label className="text-sm font-[Raleway]">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onFocus={() => handleFocus("password")}
                onChange={(e) => setPassword(e.target.value)}
                className={getInputClass(fieldErrors.password)}
                autoComplete="off"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-2.5 text-gray-500 hover:text-sky-500"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border-2 border-red-500 px-3 py-2 rounded-md text-sm animate-fadeIn">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm font-[Raleway]">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-sky-500" />
                Remember me
              </label>
            </div>

            <Button
              variant="primary2"
              className="sm:block border-2 w-full rounded-full bg-sky-400 text-white font-medium mt-10"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        ) : (
          // Password Change Form
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-md p-3 mb-4">
              <p className="text-sm text-yellow-800 font-[Raleway]">
                <strong>First time login detected.</strong> For security reasons, you must change your password before accessing the system.
              </p>
            </div>

            <div className="relative">
              <label className="text-sm font-[Raleway]">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onFocus={() => handleFocus("newPassword")}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 characters)"
                className={getInputClass(fieldErrors.newPassword)}
                autoComplete="off"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 bottom-2.5 text-gray-500 hover:text-sky-500"
                disabled={isLoading}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <label className="text-sm font-[Raleway]">Confirm New Password</label>
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
                className="absolute right-3 bottom-2.5 text-gray-500 hover:text-sky-500"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border-2 border-red-500 px-3 py-2 rounded-md text-sm animate-fadeIn">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-xs text-gray-600 font-[Raleway]">
                <strong>Password requirements:</strong>
              </p>
              <ul className="text-xs text-gray-600 font-[Raleway] mt-1 ml-4 list-disc">
                <li>At least 6 characters long</li>
                <li>Cannot be the default password (123456)</li>
                <li>Both passwords must match</li>
              </ul>
            </div>

            <Button
              variant="primary2"
              className="sm:block border-2 w-full rounded-full bg-sky-400 text-white font-medium mt-10"
              type="submit"
              disabled={isLoading}
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
    </div>
  );
}