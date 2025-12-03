"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
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
    <section className="min-h-screen bg-white flex flex-col relative">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 mb-5git pt-[9.5rem] pb-12">
          {/* Page Title */}

          {/* Title Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                COMPanion Information
              </span>
            </div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              Profile
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              View your details and membership credentials within the ICpEP SE
              CIT-U Chapter.
            </p>
          </div>

          <div className="relative bg-[#00A8FF] rounded-2xl p-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-10 text-white mb-6 overflow-hidden">
            <div className="w-40 h-40 rounded-full bg-blue-100 sm:ml-5 ml-0 border-primary1 border-2 flex items-center justify-center">
              <Image
                src={user?.avatar || '/officer.svg'}
                alt="Profile Photo"
                width={120}
                height={120}
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-4xl font-bold font-rubik mb-1">
                {loading ? 'Loading...' : (user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Unknown')}
              </h2>
              <p className="text-2xl opacity-90 font-rubik">
                {loading ? '' : formatYearLevel(user?.yearLevel)}
              </p>
            </div>
            <div className="absolute right-[5%] top-3/4 transform -translate-y-1/2 w-[80%] h-[180%] opacity-15 pointer-events-none z-0 hidden sm:block">
              <Image
                src="/icpep logo.png"
                alt="ICpEP-SE Logo"
                fill
                className="object-contain object-right mix-blend-soft-light"
                sizes="(max-width: 768px) 150px, 300px"
              />
            </div>
          </div>

          <div className="w-full  flex flex-col gap-6 mb-5">
            <PersonalInformation
              fullName={loading ? 'Loading...' : (user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Unknown')}
              idNumber={loading ? '—' : (user?.studentNumber ?? '—')}
              yearLevel={loading ? '—' : (user?.yearLevel ?? '—')}
              email={loading ? '—' : (user?.email ?? '—')}
            />
            <RolenMembershipInformation
              role={loading ? undefined : (user?.role ?? undefined)}
              councilRole={loading ? undefined : (user?.councilRole ?? undefined)}
              committeeRole={loading ? undefined : (user?.committeeRole ?? undefined)}
              membership={
                (user?.membership as any) ??
                // fallback if server returns membership inside membershipStatus
                ((user as any)?.membershipStatus?.membershipType ?? 'both')
              }
            />

            <SecuritySection />
          </div>
        </main>
        <Footer />
      </div>
    </section>
  );
}
