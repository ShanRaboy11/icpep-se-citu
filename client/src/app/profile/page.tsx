"use client";

import Image from "next/image";
import { Shield, Award, Users, X, Edit3 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "../components/button";
import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import userService, { CurrentUser } from "../services/user";

// Components
import { PersonalInformation } from "./components/personal-information";
import { RolenMembershipInformation } from "./components/role-membership";
import SecuritySection from "./components/password";

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Formatters ---
  const formatYearLevel = (value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === "") return "";
    const n = typeof value === "number" ? value : parseInt(String(value), 10);
    if (Number.isNaN(n)) return String(value);

    // Returns "BSCpE [Number]" format
    return `BSCpE ${n}`;
  };

  const getInitials = (u?: CurrentUser | null) => {
    if (!u) return "U";
    const first = (u.firstName || "").trim();
    const last = (u.lastName || "").trim();
    if (first || last) {
      const a = first ? first.charAt(0) : "";
      const b = last ? last.charAt(0) : first.length > 1 ? first.charAt(1) : "";
      return `${a}${b}`.toUpperCase() || "U";
    }
    if (u.email) return u.email.charAt(0).toUpperCase();
    return "U";
  };

  const normalizeMembership = (
    u?: CurrentUser | null
  ): "both" | "local" | "regional" => {
    const raw =
      u?.membership ??
      (u &&
        (u as unknown as { membershipStatus?: { membershipType?: string } })
          ?.membershipStatus?.membershipType);
    if (raw === "local" || raw === "regional" || raw === "both") return raw;
    return "both";
  };

  // --- Data Loading ---
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await userService.getCurrentUser();
        if (res && res.success && res.data) {
          setUser(res.data);
        } else {
          setError(res.message || "Failed to load user");
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // --- Edit Modal State ---
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    studentNumber: "",
    email: "",
    yearLevel: "",
  });
  // Changed ref to point to Email since names are now disabled
  const emailFieldRef = useRef<HTMLInputElement | null>(null);

  const openEdit = () => {
    setEditError(null);
    setEditSuccess(null);
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      studentNumber: user?.studentNumber ?? "",
      email: user?.email ?? "",
      yearLevel: user?.yearLevel ? String(user.yearLevel) : "",
    });
    setEditOpen(true);
    setTimeout(() => emailFieldRef.current?.focus(), 0);
  };

  const closeEdit = () => setEditOpen(false);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    if (!user?.id) return setEditError("No user id");
    // Names are disabled but we still check if they exist in state
    if (!form.firstName || !form.lastName)
      return setEditError("First and last name are required");

    try {
      setEditLoading(true);
      const payload: Partial<CurrentUser> = {
        // Names are disabled for editing
        firstName: form.firstName,
        lastName: form.lastName,
        studentNumber: form.studentNumber || undefined,
        email: form.email || undefined,
        yearLevel: form.yearLevel
          ? isNaN(Number(form.yearLevel))
            ? form.yearLevel
            : Number(form.yearLevel)
          : undefined,
      };

      const res = await userService.updateUser(user.id, payload);
      if (res && res.success && res.data) {
        setUser(res.data);
        setEditSuccess(res.message || "Profile updated");
        setTimeout(() => {
          setEditOpen(false);
          if (typeof window !== "undefined") window.location.reload();
        }, 700);
      } else {
        setEditError(res.message || "Failed to update");
      }
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : String(err));
    } finally {
      setEditLoading(false);
    }
  };

  const pillText = "COMPanion Information";
  const title = "Profile Overview";
  const subtitle =
    "View your details and membership credentials within the ICpEP SE CIT-U Chapter.";

  return (
    <section className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-100/40 rounded-full blur-[120px]" />
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E");
        }
      `}</style>

      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* FIX: Wrapped Header in high z-index to stay above content */}
        <div className="relative z-[100]">
          <Header />
        </div>

        {/* FIX: Added relative z-0 to main to enforce stacking order below header */}
        <main
          aria-busy={loading}
          className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24 relative z-0"
        >
          {/* --- Page Title --- */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                {pillText}
              </span>
            </div>

            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              {title}
            </h1>

            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>

          {/* --- Hero Profile Card (RESIZED & SCALED DOWN) --- */}
          <div className="relative mb-8 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 group transition-all duration-500 hover:shadow-3xl hover:translate-y-[-2px]">
            {/* Card Background & Noise */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0066CC] via-[#0088EE] to-[#00A8FF]">
              <div className="absolute inset-0 noise-bg mix-blend-overlay opacity-20"></div>
            </div>

            {/* Internal Decorations */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3"></div>

            {/* Content Container - REDUCED PADDING */}
            <div className="relative p-6 sm:p-8 lg:pl-16 lg:pr-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 lg:gap-12 text-white z-10">
              {/* Profile Image / Initials Section */}
              <div className="relative flex-shrink-0">
                {/* Glow Layers */}
                <div className="absolute -inset-6 rounded-full bg-cyan-400/30 blur-2xl animate-pulse"></div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-300 to-white/50 blur-md opacity-70"></div>

                {/* Avatar Container - REDUCED SIZE */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-md shadow-2xl">
                  <div className="w-full h-full rounded-full bg-white/95 flex items-center justify-center overflow-hidden border-[3px] border-white/90 relative shadow-inner">
                    {loading ? (
                      <div className="w-full h-full rounded-full bg-gray-100 animate-pulse" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary3 via-[#0055AA] to-primary3 text-white text-4xl sm:text-5xl font-rubik font-bold relative group-hover:scale-105 transition-transform duration-500">
                        {/* Inner shine */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-40"></div>
                        <span className="relative z-10 drop-shadow-lg">
                          {getInitials(user)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className="text-center sm:text-left flex-grow flex flex-col justify-center">
                {/* NAME - REDUCED SIZE */}
                <h2 className="text-3xl sm:text-5xl font-bold font-rubik mb-2 drop-shadow-sm tracking-tight leading-tight">
                  {loading ? (
                    <div className="h-10 w-56 bg-white/20 rounded-xl animate-pulse mx-auto sm:mx-0" />
                  ) : (
                    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                    "Unknown"
                  )}
                </h2>

                {/* ROW: Year Level + Role Badge */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 mt-1">
                  {/* YEAR LEVEL - ADJUSTED SIZE */}
                  <p className="text-base sm:text-lg font-raleway font-semibold text-cyan-50 tracking-wide drop-shadow-md">
                    {loading ? (
                      <span className="inline-block h-5 w-24 bg-white/20 rounded-lg animate-pulse" />
                    ) : (
                      formatYearLevel(user?.yearLevel)
                    )}
                  </p>

                  {/* SEPARATOR */}
                  {!loading && (
                    <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-cyan-200"></span>
                  )}

                  {/* ROLE BADGE */}
                  <div>
                    {loading ? (
                      <div className="h-7 w-28 bg-white/20 rounded-full animate-pulse" />
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-400/20 border border-cyan-200/40 backdrop-blur-md group-hover:bg-white/10 transition-colors">
                        <Users className="w-3.5 h-3.5 text-cyan-200" />
                        <span className="font-rubik text-xs font-bold tracking-widest text-white uppercase">
                          {(() => {
                            const roleLabelMap: Record<string, string> = {
                              student: "Student",
                              "council-officer": "Council Officer",
                              "committee-officer": "Committee Officer",
                              faculty: "Faculty",
                            };
                            return user?.role
                              ? roleLabelMap[user.role as string] ?? user.role
                              : "Student";
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Watermark Logo - REDUCED SIZE */}
              <div className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-[0.08] pointer-events-none hidden lg:block mix-blend-overlay">
                <Image
                  src="/icpep logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* --- Content Sections (Grid Layout) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
            {/* Left Column (Personal & Role) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <PersonalInformation
                  fullName={
                    loading
                      ? ""
                      : user
                      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                      : "Unknown"
                  }
                  idNumber={loading ? "" : user?.studentNumber ?? "—"}
                  yearLevel={loading ? "" : user?.yearLevel ?? "—"}
                  email={loading ? "" : user?.email ?? "—"}
                  loading={loading}
                />
              </div>

              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <RolenMembershipInformation
                  role={loading ? undefined : user?.role}
                  position={loading ? undefined : user?.position}
                  membership={normalizeMembership(user)}
                  loading={loading}
                />
              </div>
            </div>

            {/* Right Column (Security & Actions) */}
            <div className="flex flex-col gap-6 h-full">
              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <SecuritySection loading={loading} />
              </div>

              {/* Edit Card (COMPACT DESIGN) */}
              {!loading && (
                <div className="bg-white border border-primary1/10 rounded-3xl p-5 shadow-lg flex flex-row items-center justify-between gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary1/10 rounded-2xl text-primary1 flex-shrink-0">
                      <Edit3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-rubik font-bold text-lg text-primary3">
                        Update Profile
                      </h3>
                      <p className="font-raleway text-xs text-gray-500 mt-0.5">
                        Keep details current
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="primary3"
                    onClick={openEdit}
                    className="px-5 py-2.5 rounded-xl shadow-md font-rubik font-semibold text-sm whitespace-nowrap cursor-pointer"
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* --- Edit Modal --- */}
          {editOpen &&
            createPortal(
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                  onClick={closeEdit}
                />
                <div className="relative z-[100000] w-full max-w-2xl bg-white rounded-[2rem] p-8 shadow-2xl border border-white/50 animate-scale-in flex flex-col max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                      <h3 className="text-2xl font-rubik font-bold text-primary3">
                        Edit Profile
                      </h3>
                      <p className="text-sm font-raleway text-gray-500 mt-1">
                        Update your personal information below.
                      </p>
                    </div>
                    <button
                      onClick={closeEdit}
                      className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={handleEditSubmit}
                    className="grid grid-cols-1 gap-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <InputField
                        label="First Name"
                        value={form.firstName}
                        onChange={(val) => setForm({ ...form, firstName: val })}
                        disabled={true} // DISABLED
                      />
                      <InputField
                        label="Last Name"
                        value={form.lastName}
                        onChange={(val) => setForm({ ...form, lastName: val })}
                        disabled={true} // DISABLED
                      />
                    </div>

                    <InputField
                      label="Student Number"
                      value={form.studentNumber}
                      onChange={(val) =>
                        setForm({ ...form, studentNumber: val })
                      }
                      disabled={true} // DISABLED
                    />

                    <InputField
                      label="Institutional Email"
                      value={form.email}
                      onChange={(val) => setForm({ ...form, email: val })}
                      ref={emailFieldRef} // Focus starts here
                      type="email"
                    />

                    <InputField
                      label="Year Level"
                      value={form.yearLevel}
                      onChange={(val) => {
                        // Prevent input > 5
                        if (
                          val === "" ||
                          (Number(val) >= 1 && Number(val) <= 5)
                        ) {
                          setForm({ ...form, yearLevel: val });
                        }
                      }}
                      type="number"
                      min={1}
                      max={5}
                    />

                    {editError && (
                      <div className="text-red-600 font-raleway font-medium text-sm p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
                        <Shield className="w-5 h-5 flex-shrink-0" />
                        <span>{editError}</span>
                      </div>
                    )}
                    {editSuccess && (
                      <div className="text-green-600 font-raleway font-medium text-sm p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
                        <Award className="w-5 h-5 flex-shrink-0" />
                        <span>{editSuccess}</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
                      <button
                        type="button"
                        onClick={closeEdit}
                        className="px-6 py-3 rounded-xl border border-gray-200 font-rubik font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <Button
                        variant="primary3"
                        type="submit"
                        disabled={editLoading}
                        className="px-8 py-3 rounded-xl font-rubik font-semibold shadow-lg shadow-primary3/20 cursor-pointer"
                      >
                        {editLoading ? "Saving Changes..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>,
              document.body
            )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-rubik text-center animate-fade-in">
              {error}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </section>
  );
}

// Helper Component for Modal Inputs
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  ref?: any;
  disabled?: boolean;
  max?: string | number;
  min?: string | number;
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  ref,
  disabled,
  max,
  min,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-bold font-raleway text-gray-700 mb-2 ml-1">
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        max={max}
        min={min}
        className={`w-full font-rubik border border-gray-200 rounded-xl px-4 py-3.5 outline-none transition-all placeholder-gray-400
          ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-100"
              : "bg-slate-50 focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 text-gray-800"
          }`}
      />
    </div>
  );
}
