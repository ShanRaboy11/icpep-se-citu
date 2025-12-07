"use client";

import Image from "next/image";
import { Shield, Award, Users, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Button from "../components/button";
import { createPortal } from "react-dom";
import {PersonalInformation} from "./components/personalinfo";
import {RolenMembershipInformation} from "./components/rolenmembership";
import SecuritySection from "./components/password";
import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import userService, { CurrentUser } from "../services/user";

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format year level
  const formatYearLevel = (value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === "") return "";
    const n = typeof value === "number" ? value : parseInt(String(value), 10);
    if (Number.isNaN(n)) return String(value);
    const mod100 = n % 100;
    const suffix =
      mod100 >= 11 && mod100 <= 13
        ? "th"
        : n % 10 === 1
        ? "st"
        : n % 10 === 2
        ? "nd"
        : n % 10 === 3
        ? "rd"
        : "th";
    return `${n}${suffix} Year`;
  };

  const getInitials = (u?: CurrentUser | null) => {
    if (!u) return "U";
    const first = (u.firstName || "").trim();
    const last = (u.lastName || "").trim();
    if (first || last) {
      const a = first ? first.charAt(0) : "";
      const b = last ? last.charAt(0) : first.length > 1 ? first.charAt(1) : "";
      const initials = `${a}${b}`.toUpperCase();
      return initials || "U";
    }
    if (u.email) return u.email.charAt(0).toUpperCase();
    return "U";
  };

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

  // (removed unused avatarSrc helper)

  // Edit modal state
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
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

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
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  };

  const closeEdit = () => setEditOpen(false);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    if (!user?.id) return setEditError("No user id");
    if (!form.firstName || !form.lastName)
      return setEditError("First and last name are required");
    /* password change removed from the edit modal */
    try {
      setEditLoading(true);
      const payload: Partial<CurrentUser> = {
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
      /* password removed from payload */
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
      if (err instanceof Error) setEditError(err.message || "Failed to update");
      else setEditError(String(err) || "Failed to update");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex flex-col relative">
      {/* 
         PRECISE "DOT + TAIL" ANIMATION STYLES
      */}
      <style jsx global>{`
        @keyframes circuit-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-circuit {
          animation: circuit-rotate 4s linear infinite;
        }

        .bg-dot-snake {
          /* 
             Gradient Construction to Simulate a "Dot" Head:
             0deg - 320deg: Transparent (Empty Track)
             320deg - 350deg: Deep Blue -> Cyan (The Tail)
             350deg - 360deg: PURE WHITE (The "Dot" Head)
             
             The abrupt contrast between transparency and the color stops creates the "Snake" look.
          */
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 300deg,
            #0066ff 320deg,
            /* Blue Tail Start */ #00e5ff 350deg,
            /* Cyan Body End */ #ffffff 350.1deg,
            /* Sharp start of White Head */ #ffffff 360deg /* White Head End */
          );
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main aria-busy={loading} className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12">
          {/* Title Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary1/10 to-primary1/5 px-4 py-1.5 mb-4 border border-primary1/20">
              <div className="h-2 w-2 rounded-full bg-primary1 animate-pulse"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                COMPanion Information
              </span>
            </div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary3 to-primary1 bg-clip-text text-transparent leading-tight mb-4">
              Profile Overview
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              View your details and membership credentials within the ICpEP SE
              CIT-U Chapter.
            </p>
          </div>

          {/* Profile Card */}
          <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl translate-z-0 profile-snake-wrapper transform-gpu transition-transform duration-300 ease-out hover:scale-105">
            {/* SVG Neon Snake Circuit Overlay */}
            <svg
              className="circuit-outline neon-snake-svg"
              viewBox="0 0 1200 380"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient
                  id="snakeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#00e5ff" />
                  <stop offset="40%" stopColor="#00baff" />
                  <stop offset="70%" stopColor="#0066ff" />
                  <stop offset="100%" stopColor="#00a8ff" />
                </linearGradient>

                <linearGradient
                  id="headGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="60%" stopColor="#bff8ff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.85" />
                </linearGradient>

                {/* Tail gradient for the second moving object: opacity increases along the tail */}
                <linearGradient
                  id="tailGradient2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
                  <stop offset="25%" stopColor="#00d8ff" stopOpacity="0.18" />
                  <stop offset="50%" stopColor="#00baff" stopOpacity="0.45" />
                  <stop offset="80%" stopColor="#008cff" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0066ff" stopOpacity="1" />
                </linearGradient>

                <filter
                  id="neonBlur"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* First snake (phase start) */}
              <rect
                x="0"
                y="0"
                width="1200"
                height="380"
                rx="22"
                className="neon-tail-2 snake-1"
                stroke="url(#tailGradient2)"
              />
              <rect
                x="0"
                y="0"
                width="1200"
                height="380"
                rx="22"
                className="neon-snake-head snake-1"
                stroke="url(#headGradient)"
              />

              {/* Second snake (1/3-cycle phase offset) */}
              <rect
                x="0"
                y="0"
                width="1200"
                height="380"
                rx="22"
                className="neon-tail-2 snake-2"
                stroke="url(#tailGradient2)"
              />
              <rect
                x="0"
                y="0"
                width="1200"
                height="380"
                rx="22"
                className="neon-snake-head snake-2"
                stroke="url(#headGradient)"
              />

              {/* Third snake (2/3-cycle phase offset) */}
              <rect
                x="0"
                y="0"
                width="1200"
                height="380"
                rx="22"
                className="neon-tail-2 snake-3"
                stroke="url(#tailGradient2)"
              />
              <rect
                x="0"
                y="0"
                width="1200"
                height="380"
                rx="22"
                className="neon-snake-head snake-3"
                stroke="url(#headGradient)"
              />
            </svg>

            {/* Inner Card Content - Sits on top, masking the center */}
            <div className="relative h-full w-full bg-gradient-to-br from-[#00A8FF] via-[#0095E8] to-[#0082D1] rounded-[22px] p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-white overflow-hidden z-10 profile-card-content">
              {/* Internal Decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>

              <div className="relative z-10 animate-scale-in group">
                {/* Unified white glow matching the snake (replaces the thin outline) */}
                <div className="absolute inset-0 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-500 blur-3xl pointer-events-none z-10">
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-200/40 via-white/90 to-cyan-200/40 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                </div>

                {/* Profile Image */}
                <div className="relative lg:ml-8 z-10 animate-scale-in group">
                  {/* Animated glow that matches the snake - Made MORE prominent */}
                  <div className="absolute inset-0 -m-4 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-spin blur-2xl"
                      style={{ animationDuration: "3s" }}
                    ></div>
                  </div>
                  <div className="absolute inset-0 -m-2 rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 animate-spin blur-lg"
                      style={{ animationDuration: "3s" }}
                    ></div>
                  </div>

                  <div className="relative w-44 h-44 rounded-full bg-gradient-to-br from-white/30 to-white/10 p-1.5 backdrop-blur-xl shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden shadow-inner border-4 border-white relative">
                      {loading ? (
                          <div className="w-full h-full rounded-full relative overflow-hidden" aria-hidden>
                            <div
                              className="absolute inset-0 rounded-full"
                              style={{
                                background:
                                  'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04) 100%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.6s linear infinite',
                              }}
                            />
                            {/* small role-badge shimmer on avatar */}
                            <div
                              className="absolute right-3 bottom-3 w-8 h-8 rounded-full ring-2 ring-white/30"
                              aria-hidden
                              style={{
                                background:
                                  'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04) 100%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.6s linear infinite',
                              }}
                            />
                          </div>
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary3 via-primary1 to-primary3 text-white text-5xl font-bold relative overflow-hidden"
                          aria-label={`${user?.firstName ?? ""} ${
                            user?.lastName ?? ""
                          }`.trim()}
                        >
                          {/* Subtle shine effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                          {/* Initials with enhanced shadow */}
                          <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                            {getInitials(user)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="text-center sm:text-left relative z-10 flex-grow animate-slide-in-right">
                <h2 className="text-4xl font-bold font-rubik mb-2 drop-shadow-md">
                  {loading ? (
                    <span
                      className="inline-block h-10 w-72 rounded-lg"
                      aria-hidden
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04) 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.6s linear infinite',
                      }}
                    />
                  ) : (
                    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                    "Unknown"
                  )}
                </h2>
                <p className="text-xl opacity-90 font-rubik mb-4 drop-shadow font-light tracking-wide">
                  {loading ? (
                    <span
                      className="inline-block h-6 w-32 rounded-lg"
                      aria-hidden
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04) 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.6s linear infinite',
                      }}
                    />
                  ) : (
                    formatYearLevel(user?.yearLevel)
                  )}
                </p>

                {/* Role Badge */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {loading ? (
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white/20 shadow-inner">
                      <div aria-hidden className="w-4 h-4 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04) 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s linear infinite' }} />
                      <div aria-hidden className="h-4 w-28 rounded-lg" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.04) 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s linear infinite' }} />
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white/20 shadow-inner">
                      <Users className="w-4 h-4 text-cyan-200" />
                      <span className="tracking-wide text-white">
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

              {/* Logo watermark */}
              <div className="absolute right-[-5%] top-1/2 transform -translate-y-1/2 w-[80%] mt-28 mr-5 left-90 h-[180%] opacity-[0.10] pointer-events-none z-0 hidden sm:block mix-blend-overlay">
                <Image
                  src="/icpep logo.png"
                  alt="ICpEP-SE Logo"
                  fill
                  className="object-contain object-right"
                  sizes="(max-width: 768px) 150px, 300px"
                />
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="w-full flex flex-col gap-6 mb-8">
            <div className="transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
              <PersonalInformation
                fullName={
                  loading
                    ? "Loading..."
                    : user
                    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                    : "Unknown"
                }
                idNumber={loading ? "—" : user?.studentNumber ?? "—"}
                yearLevel={loading ? "—" : user?.yearLevel ?? "—"}
                email={loading ? "—" : user?.email ?? "—"}
                loading={loading}
              />
            </div>

            <div className="transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
              <RolenMembershipInformation
                role={loading ? undefined : user?.role ?? undefined}
                councilRole={
                  loading ? undefined : user?.councilRole ?? undefined
                }
                committeeRole={
                  loading ? undefined : user?.committeeRole ?? undefined
                }
                membership={normalizeMembership(user)}
                loading={loading}
              />
            </div>

            <div className="transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
              <SecuritySection loading={loading} />
            </div>
            <div className="w-full flex justify-end">
              {!loading && (
                <Button
                  variant="primary3"
                  onClick={openEdit}
                  className="px-6 py-2.5 mt-2 rounded-xl shadow-lg shadow-primary3/20"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Edit Profile Modal */}
          {editOpen &&
            createPortal(
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                  onClick={closeEdit}
                />
                <div className="relative z-[100000] w-full max-w-xl bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 animate-scale-in">
                  <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-xl font-rubik font-bold text-gray-800">
                      Edit Profile
                    </h3>
                    <button
                      onClick={closeEdit}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <form
                    onSubmit={handleEditSubmit}
                    className="grid grid-cols-1 gap-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First name
                        </label>
                        <input
                          ref={firstFieldRef}
                          value={form.firstName}
                          onChange={(e) =>
                            setForm({ ...form, firstName: e.target.value })
                          }
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary1 focus:ring-4 focus:ring-primary1/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last name
                        </label>
                        <input
                          value={form.lastName}
                          onChange={(e) =>
                            setForm({ ...form, lastName: e.target.value })
                          }
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary1 focus:ring-4 focus:ring-primary1/10 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Student number
                      </label>
                      <input
                        value={form.studentNumber}
                        onChange={(e) =>
                          setForm({ ...form, studentNumber: e.target.value })
                        }
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary1 focus:ring-4 focus:ring-primary1/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary1 focus:ring-4 focus:ring-primary1/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Year level
                      </label>
                      <input
                        value={form.yearLevel}
                        onChange={(e) =>
                          setForm({ ...form, yearLevel: e.target.value })
                        }
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary1 focus:ring-4 focus:ring-primary1/10 transition-all"
                      />
                    </div>
                    {/* Password change removed from edit modal */}

                    {editError && (
                      <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> {editError}
                      </div>
                    )}
                    {editSuccess && (
                      <div className="text-green-600 text-sm p-3 bg-green-50 rounded-lg border border-green-100 flex items-center gap-2">
                        <Award className="w-4 h-4" /> {editSuccess}
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={closeEdit}
                        className="px-6 py-2.5 rounded-xl border-2 border-gray-200 font-rubik hover:cursor-pointer hover:bg-gray-300 font-semibold text-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <Button
                        variant="primary3"
                        type="submit"
                        disabled={editLoading}
                        className="px-6 py-2.5 rounded-xl font-semibold shadow-md"
                      >
                        {editLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>,
              document.body
            )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center animate-fade-in">
              {error}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </section>
  );
}
