"use client";

import Image from "next/image";
import { ArrowLeft, User, Mail, Calendar, Shield, Award, Users, X } from "lucide-react";
import { useEffect, useState, useRef } from 'react';
import Button from "../components/button";
import { createPortal } from 'react-dom';
import PersonalInformation from "./components/personalinfo";
import RolenMembershipInformation from "./components/rolenmembership";
import SecuritySection from "./components/password";
import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import userService, { CurrentUser } from '../services/user';

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format year level as ordinal (1 -> 1st Year, 2 -> 2nd Year, etc.)
  const formatYearLevel = (value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === '') return '';
    const n = typeof value === 'number' ? value : parseInt(String(value), 10);
    if (Number.isNaN(n)) return String(value);
    const mod100 = n % 100;
    const suffix = mod100 >= 11 && mod100 <= 13 ? 'th' : (n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th');
    return `${n}${suffix} Year`;
  };

  const getInitials = (u?: CurrentUser | null) => {
    if (!u) return 'U';
    const first = (u.firstName || '').trim();
    const last = (u.lastName || '').trim();
    if (first || last) {
      const a = first ? first.charAt(0) : '';
      const b = last ? last.charAt(0) : (first.length > 1 ? first.charAt(1) : '');
      const initials = `${a}${b}`.toUpperCase();
      return initials || 'U';
    }
    if (u.email) return u.email.charAt(0).toUpperCase();
    return 'U';
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await userService.getCurrentUser();
        if (res && res.success && res.data) {
          setUser(res.data);
        } else {
          setError(res.message || 'Failed to load user');
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const normalizeMembership = (u?: CurrentUser | null): "both" | "local" | "regional" => {
    const raw = u?.membership ?? (u && (u as unknown as { membershipStatus?: { membershipType?: string } })?.membershipStatus?.membershipType);
    if (raw === 'local' || raw === 'regional' || raw === 'both') return raw;
    return 'both';
  };

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', studentNumber: '', email: '', yearLevel: '' });
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const openEdit = () => {
    setEditError(null);
    setEditSuccess(null);
    setForm({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      studentNumber: user?.studentNumber ?? '',
      email: user?.email ?? '',
      yearLevel: user?.yearLevel ? String(user.yearLevel) : '',
    });
    setEditOpen(true);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  };

  const closeEdit = () => setEditOpen(false);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    if (!user?.id) return setEditError('No user id');
    if (!form.firstName || !form.lastName) return setEditError('First and last name are required');
    try {
      setEditLoading(true);
      const payload: any = {
        firstName: form.firstName,
        lastName: form.lastName,
        studentNumber: form.studentNumber || undefined,
        email: form.email || undefined,
        yearLevel: form.yearLevel ? (isNaN(Number(form.yearLevel)) ? form.yearLevel : Number(form.yearLevel)) : undefined,
      };
      const res = await userService.updateUser(user.id, payload);
      if (res && res.success && res.data) {
        setUser(res.data);
        setEditSuccess(res.message || 'Profile updated');
        setTimeout(() => setEditOpen(false), 900);
      } else {
        setEditError(res.message || 'Failed to update');
      }
    } catch (err: any) {
      setEditError(err?.message || 'Failed to update');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex flex-col relative">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12">
          {/* Title Section with enhanced styling */}
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
              View your details and membership credentials within the ICpEP SE CIT-U Chapter.
            </p>
          </div>

          {/* Enhanced Profile Header Card */}
          <div className="relative rounded-3xl mb-8">
            {/* Animated glowing border that moves around */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 animate-border-rotate">
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(255,255,255,0.9)_300deg,rgba(255,255,255,1)_330deg,rgba(255,255,255,0.9)_360deg,transparent_390deg,transparent_720deg)]"></div>
              </div>
            </div>
            
            {/* Inner card content */}
            <div className="relative bg-gradient-to-br from-[#00A8FF] via-[#0095E8] to-[#0082D1] rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-white overflow-hidden shadow-xl m-[2px]">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-float-delayed"></div>
              
              {/* Profile Image with enhanced styling */}
              <div className="relative z-10 animate-scale-in">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-white to-blue-50 p-1 shadow-2xl transition-transform duration-300 hover:scale-105">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {loading ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                  ) : (
                    <div
                      className="w-36 h-36 rounded-full flex items-center justify-center bg-gradient-to-br from-primary3 to-primary1 text-white text-4xl font-bold"
                      aria-label={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
                    >
                      {getInitials(user)}
                    </div>
                  )}
                </div>
              </div>
            </div>

              {/* User Info */}
              <div className="text-center sm:text-left relative z-10 flex-grow animate-slide-in-right">
              <h2 className="text-4xl font-bold font-rubik mb-2 drop-shadow-md transition-all duration-300">
                {loading ? (
                  <span className="inline-block h-10 w-48 bg-white/20 rounded-lg animate-pulse"></span>
                ) : (
                  `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Unknown'
                )}
              </h2>
              <p className="text-xl opacity-90 font-rubik mb-4 drop-shadow">
                {loading ? (
                  <span className="inline-block h-6 w-32 bg-white/20 rounded-lg animate-pulse"></span>
                ) : (
                  formatYearLevel(user?.yearLevel)
                )}
              </p>
              
              
              {/* Quick info badge: show Role */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {!loading && (
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-white/30">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {(() => {
                        const roleLabelMap: Record<string, string> = {
                          'student': 'Student',
                          'council-officer': 'Council Officer',
                          'committee-officer': 'Committee Officer',
                          'faculty': 'Faculty',
                        };
                        return user?.role ? (roleLabelMap[user.role as string] ?? user.role) : 'Student';
                      })()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Logo watermark - enhanced */}
            <div className="absolute right-[5%] mt-20 top-1/2 transform -translate-y-1/2 w-[70%] h-[160%] opacity-10 pointer-events-none z-0 hidden sm:block animate-pulse-slow">
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

          {/* Information Cards with enhanced styling - removed transform that breaks modals */}
          <div className="w-full flex flex-col gap-6 mb-8">
            <div className="transition-shadow duration-300 hover:shadow-lg">
              <PersonalInformation
                fullName={loading ? 'Loading...' : (user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Unknown')}
                idNumber={loading ? '—' : (user?.studentNumber ?? '—')}
                yearLevel={loading ? '—' : (user?.yearLevel ?? '—')}
                email={loading ? '—' : (user?.email ?? '—')}
              />
            </div>
            
            <div className="transition-shadow duration-300 hover:shadow-lg">
              <RolenMembershipInformation
                role={loading ? undefined : (user?.role ?? undefined)}
                councilRole={loading ? undefined : (user?.councilRole ?? undefined)}
                committeeRole={loading ? undefined : (user?.committeeRole ?? undefined)}
                membership={normalizeMembership(user)}
              />
            </div>

            <div className="transition-shadow duration-300 hover:shadow-lg">
              <SecuritySection />
            </div>
            {/* Edit button placed directly under the cards, right-aligned */}
            <div className="w-full flex justify-end">
              {!loading && (
                <Button variant="primary3" onClick={openEdit} className="px-4 py-2 mt-2">
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Edit Profile Modal rendered to body via portal */}
          {editOpen && createPortal(
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeEdit} />
              <div className="relative z-[100000] w-full max-w-xl bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-rubik font-bold text-primary3">Edit Profile</h3>
                  <button onClick={closeEdit} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500"/></button>
                </div>

                <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First name</label>
                    <input ref={firstFieldRef} value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary1 focus:ring-2 focus:ring-primary1/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last name</label>
                    <input value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary1 focus:ring-2 focus:ring-primary1/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Student number</label>
                    <input value={form.studentNumber} onChange={(e) => setForm({...form, studentNumber: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary1 focus:ring-2 focus:ring-primary1/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary1 focus:ring-2 focus:ring-primary1/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year level</label>
                    <input value={form.yearLevel} onChange={(e) => setForm({...form, yearLevel: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary1 focus:ring-2 focus:ring-primary1/20" />
                  </div>

                  {editError && <div className="text-red-600 p-3 bg-red-50 rounded">{editError}</div>}
                  {editSuccess && <div className="text-green-600 p-3 bg-green-50 rounded">{editSuccess}</div>}

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={closeEdit} className="px-6 py-2.5 rounded-xl border-2 border-gray-200 font-rubik font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={editLoading} className="px-6 py-2.5 rounded-xl bg-primary2 text-white font-semibold hover:opacity-95">
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>, document.body
          )}

          {/* Error display if needed */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
              {error}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </section>
  );
}