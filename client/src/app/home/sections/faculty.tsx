"use client";

import { motion } from "framer-motion";
import FacultyOfficerCard from "@/app/home/components/faculty-officer-card";
import { useState, useEffect } from "react";
import officerService from "@/app/services/officer";
import advisorService from "@/app/services/advisor";
import { toTitleCase } from "@/app/officers/utils/format-name";

const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -800px 0; }
    100% { background-position: 800px 0; }
  }
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 0px,
      rgba(255,255,255,0.10) 40px,
      rgba(255,255,255,0.04) 80px
    );
    background-size: 800px 100%;
    animation: shimmer 1.6s infinite linear;
  }
`;

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton-shimmer rounded-lg bg-white/5 ${className}`} />
  );
}

function FacultyOfficerCardSkeleton() {
  return (
    <div className="shrink-0 flex flex-col items-center gap-2 w-30">
      <SkeletonBlock className="w-20 h-20 rounded-full" />
      <SkeletonBlock className="w-22.5 h-3 rounded-md" />
      <SkeletonBlock className="w-17.5 h-3 rounded-md" />
    </div>
  );
}

function FacultyOfficersSkeleton() {
  const CARD_COUNT = 9;

  return (
    <section className="light-dark-background relative pt-28 pb-16 sm:pt-36 sm:pb-20">
      <style>{shimmerStyle}</style>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 md:mb-16 text-center flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-2 sm:hidden">
            <SkeletonBlock className="w-44 h-9 rounded-md" />
            <SkeletonBlock className="w-28 h-9 rounded-md" />
          </div>
          <SkeletonBlock className="hidden sm:block w-72 h-10 rounded-md" />
          <SkeletonBlock className="w-52 h-5 rounded-md" />
        </div>
      </div>

      <div className="relative z-10 w-full overflow-hidden block sm:hidden">
        <div className="flex gap-6 px-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <FacultyOfficerCardSkeleton key={`mob-top-${i}`} />
          ))}
        </div>
        <div className="flex gap-6 px-5 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <FacultyOfficerCardSkeleton key={`mob-bot-${i}`} />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full overflow-hidden hidden sm:block">
        <div className="flex gap-6 p-5">
          {Array.from({ length: CARD_COUNT }).map((_, i) => (
            <FacultyOfficerCardSkeleton key={`desk-top-${i}`} />
          ))}
        </div>
        <div className="flex gap-6 p-5 -mt-5">
          {Array.from({ length: CARD_COUNT }).map((_, i) => (
            <FacultyOfficerCardSkeleton key={`desk-bot-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface RosterEntry {
  name: string;
  title: string;
  image: string;
}

export function FacultyOfficersSection() {
  const [loading, setLoading] = useState(true);
  const [facultyAndOfficers, setFacultyAndOfficers] = useState<RosterEntry[]>(
    [],
  );

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const [advisors, officers] = await Promise.all([
          advisorService.getAdvisors(true).catch(() => ({ data: [] })),
          officerService
            .getPublicOfficers("executive")
            .catch(() => [] as any[]),
        ]);

        const advisorEntries: RosterEntry[] = (advisors.data || []).map(
          (a: any) => ({
            name: toTitleCase(a.name),
            title: a.position,
            image: a.image || "/content/faculty.png",
          }),
        );

        const officerEntries: RosterEntry[] = (officers || []).map(
          (o: any) => ({
            name: toTitleCase(
              [o.firstName, o.middleName, o.lastName].filter(Boolean).join(" "),
            ),
            title: o.position || "Officer",
            image: o.profilePicture || "/content/faculty.png",
          }),
        );

        setFacultyAndOfficers([...advisorEntries, ...officerEntries]);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchRoster();
  }, []);

  const MINIMUM_BASE_LENGTH = 15;
  let extendedList = [...facultyAndOfficers];
  if (extendedList.length > 0 && extendedList.length < MINIMUM_BASE_LENGTH) {
    const repeatsNeeded = Math.ceil(MINIMUM_BASE_LENGTH / extendedList.length);
    extendedList = Array.from(
      { length: repeatsNeeded },
      () => facultyAndOfficers,
    ).flat();
  }
  const duplicated = [...extendedList, ...extendedList];

  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const half = Math.ceil(facultyAndOfficers.length / 2);
  const topRowOfficers = facultyAndOfficers.slice(0, half);
  const bottomRowOfficers = facultyAndOfficers.slice(half);

  useEffect(() => {
    if (loading || topRowOfficers.length === 0) return;
    const interval = setInterval(() => {
      setActiveMobileSlide((prev) => (prev + 1) % topRowOfficers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [topRowOfficers.length, loading]);

  const MOBILE_CARD_WIDTH = 120;
  const MOBILE_GAP = 24;
  const SLIDE_OFFSET = MOBILE_CARD_WIDTH + MOBILE_GAP;

  if (loading) {
    return <FacultyOfficersSkeleton />;
  }

  return (
    <section className="light-dark-background relative pt-28 pb-16 sm:pt-36 sm:pb-20">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="relative block sm:hidden font-rubik text-4xl font-bold text-primary3 leading-tight">
            Council Officers
            <br />& Faculty
          </h2>
          <h2 className="relative hidden sm:block font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight">
            Council Officers & Faculty
          </h2>
          <p className="relative font-raleway text-base sm:text-lg text-bodytext mt-2 max-w-lg mx-auto">
            Meet the framework of our community.
          </p>
        </div>
      </div>

      {facultyAndOfficers.length === 0 ? (
        <div className="relative z-10 text-center py-10">
          <p className="text-gray-500 font-raleway text-lg">
            No officers or advisors published yet.
          </p>
        </div>
      ) : (
        <>
          {/* mobile marquee */}
          {/* py gives the hovered card's shadow room before the clip boundary
              (overflow-x/y-hidden alone still clips vertically — per the CSS
              overflow spec, setting overflow-y to visible while overflow-x is
              hidden computes overflow-y as auto instead, which keeps clipping) */}
          <div className="relative z-10 w-full overflow-hidden py-10 block sm:hidden">
            <motion.div
              className="flex w-max gap-6 px-5"
              animate={{ x: -activeMobileSlide * SLIDE_OFFSET }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {topRowOfficers.map((officer, i) => (
                <FacultyOfficerCard
                  key={`mobile-top-${i}`}
                  {...officer}
                  forceHoverState={i === activeMobileSlide}
                />
              ))}
            </motion.div>
            <motion.div
              className="flex w-max gap-6 px-5 mt-6"
              animate={{ x: -activeMobileSlide * SLIDE_OFFSET }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.1,
              }}
            >
              {bottomRowOfficers.map((officer, i) => (
                <FacultyOfficerCard
                  key={`mobile-bottom-${i}`}
                  {...officer}
                  forceHoverState={i === activeMobileSlide}
                />
              ))}
            </motion.div>
          </div>

          {/* desktop marquee */}
          <div className="relative z-10 w-full overflow-hidden py-10 hidden sm:block">
            <motion.div
              className="flex w-max gap-6 p-5"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
            >
              {duplicated.map((o, i) => (
                <div key={`desktop-top-${i}`} className="shrink-0">
                  <FacultyOfficerCard {...o} />
                </div>
              ))}
            </motion.div>
            <motion.div
              className="flex w-max gap-6 p-5 -mt-5"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
            >
              {duplicated.map((o, i) => (
                <div key={`desktop-bottom-${i}`} className="shrink-0">
                  <FacultyOfficerCard {...o} />
                </div>
              ))}
            </motion.div>
          </div>
        </>
      )}
    </section>
  );
}
