"use client";

import Image from "next/image";
import { ArrowLeft, User, Mail, Calendar, Shield, Award, Users } from "lucide-react";
import { useEffect, useState } from 'react';
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
          <div className="relative bg-gradient-to-br from-[#00A8FF] via-[#0095E8] to-[#0082D1] rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-white mb-8 overflow-hidden shadow-xl border border-white/20">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            
            {/* Profile Image with enhanced styling */}
            <div className="relative z-10">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-white to-blue-50 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {loading ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                  ) : (
                    <Image
                      src={user?.avatar || '/officer.svg'}
                      alt="Profile Photo"
                      width={150}
                      height={150}
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
              {/* Status indicator */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white shadow-lg"></div>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left relative z-10 flex-grow">
              <h2 className="text-4xl font-bold font-rubik mb-2 drop-shadow-md">
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
              
              {/* Quick info badges */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {!loading && user?.studentNumber && (
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-white/30">
                    <User className="w-3.5 h-3.5" />
                    <span>{user.studentNumber}</span>
                  </div>
                )}
                {!loading && user?.email && (
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm border border-white/30">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">{user.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Logo watermark - enhanced */}
            <div className="absolute right-[5%] top-1/2 transform -translate-y-1/2 w-[70%] h-[160%] opacity-10 pointer-events-none z-0 hidden sm:block">
              <Image
                src="/icpep logo.png"
                alt="ICpEP-SE Logo"
                fill
                className="object-contain object-right"
                sizes="(max-width: 768px) 150px, 300px"
              />
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
                membership={
                  (user?.membership as any) ??
                  ((user as any)?.membershipStatus?.membershipType ?? 'both')
                }
              />
            </div>

            <div className="transition-shadow duration-300 hover:shadow-lg">
              <SecuritySection />
            </div>
          </div>

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