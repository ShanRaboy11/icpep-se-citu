"use client";

import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, X } from "lucide-react";
import Button from "@/app/components/button";

export default function Login() {
  const dummyUser = {
    email: "juan.delacruz@cit.edu",
    password: "123456",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [conshowPassword, consetShowPassword] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isVisible, setIsVisible] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors = { email: false, password: false, confirmPassword: false };

    if (!email || !password || (isFirstLogin && !confirmPassword)) {
      setError("Please fill in all required fields.");
      newErrors = {
        email: !email,
        password: !password,
        confirmPassword: isFirstLogin && !confirmPassword,
      };
      setFieldErrors(newErrors);
      return;
    }

    if (isFirstLogin) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        newErrors = { ...newErrors, password: true, confirmPassword: true };
        setFieldErrors(newErrors);
        return;
      }

      if (email === dummyUser.email) {
        setError("Account already exists. Please log in instead.");
        newErrors = { ...newErrors, email: true };
        setFieldErrors(newErrors);
        return;
      }

      setError("");
      alert("✅ Account created successfully!");
      setIsFirstLogin(false);
      return;
    }

    if (email !== dummyUser.email || password !== dummyUser.password) {
      setError("Invalid email or password.");
      newErrors = {
        email: email !== dummyUser.email,
        password: password !== dummyUser.password,
        confirmPassword: false,
      };
      setFieldErrors(newErrors);
      return;
    }

    setError("");
    setFieldErrors({ email: false, password: false, confirmPassword: false });
    alert("✅ Logged in successfully!");
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

  if (!isVisible) return null;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center font-rubik relative overflow-hidden"
      style={{ backgroundColor: "#FEFEFF" }}
    >
      {/* Blurry blobs */}
      <div className="absolute inset-0">
        {/* Blob 1 - Purple */}
        <div className="absolute top-3/4 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[50rem] lg:h-[60rem] bg-gradient-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-1"></div>

        {/* Blob 2 - Pink */}
        <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] bg-gradient-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-2"></div>

        {/* Blob 3 - Blue */}
        <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[60rem] lg:h-[60rem] bg-gradient-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-3"></div>
      </div>

      <div
        className="absolute top-15  right-5 sm:right-20 cursor-pointer text-primary3 hover:text-primary2 hover:scale-130 transition-all duration-200"
        onClick={() => alert("Close button clicked!")}
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
            Welcome to ICpEP SE!
          </h1>
          <p className="text-gray-500 text-md font-[Raleway] text-center mb-5">
            {isFirstLogin
              ? "Create your account to continue."
              : "Please log in to access your account."}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-[Raleway]">
              Institutional Email Address
            </label>
            <input
              type="email"
              value={email}
              onFocus={() => handleFocus("email")}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan.delacruz@cit.edu"
              className={getInputClass(fieldErrors.email)}
              autoComplete="off"
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-2.5 text-gray-500 hover:text-sky-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isFirstLogin && (
            <div className="relative">
              <label className="text-sm font-[Raleway]">Confirm Password</label>
              <input
                type={conshowPassword ? "text" : "password"}
                value={confirmPassword}
                onFocus={() => handleFocus("confirmPassword")}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={getInputClass(fieldErrors.confirmPassword)}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => consetShowPassword(!conshowPassword)}
                className="absolute right-3 bottom-2.5 text-gray-500 hover:text-sky-500"
              >
                {conshowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

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
            <button
              type="button"
              className="text-sky-500 hover:underline"
              onClick={() => {
                setIsFirstLogin(!isFirstLogin);
                setError("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setFieldErrors({
                  email: false,
                  password: false,
                  confirmPassword: false,
                });
              }}
            >
              {isFirstLogin ? "Back to Login" : "First time? Register"}
            </button>
          </div>

          <Button
            variant="primary2"
            className="sm:block border-2 w-full rounded-full bg-sky-400 text-white font-medium mt-10"
            type="submit"
          >
            {isFirstLogin ? "Sign Up" : "Log In"}
          </Button>
        </form>

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
      `}</style>
      </div>
    </div>
  );
}
