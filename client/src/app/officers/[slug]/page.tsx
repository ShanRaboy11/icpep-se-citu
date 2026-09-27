"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Grid from "../../components/grid";
import OfficerCard from "../components/officer-card";
import BackButton from "../../components/back-button";

import { departments } from "../utils/officers";
import { formatOfficerName, toTitleCase } from "../utils/format-name";
import officerService from "../../services/officer";
import officerTermService from "../../services/officerTerm";
import { LoadingIndicator } from "@/app/components/loading";

interface DisplayOfficer {
  position: string;
  role?: string;
  name: string;
  image: string;
}

const ordinalYear = (n: number) => {
  const suffix = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return `${n}${suffix} Year`;
};

// Splits a live council assignment into the {position, role} pair the
// OfficerCard expects (e.g. "SSG Representative" -> position "SSG", role
// "Representative"), matching the convention used by the archive too.
const splitCouncilPosition = (
  position: string,
  yearLevel?: number,
): { position: string; role?: string } => {
  if (position === "Batch Representative" && yearLevel) {
    return { position: ordinalYear(yearLevel), role: "Batch Representative" };
  }
  if (position === "SSG Representative") {
    return { position: "SSG", role: "Representative" };
  }
  return { position };
};

const OfficersPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug =
    (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) || "";
  const year = searchParams.get("year");
  const meta = departments[slug];

  const [officers, setOfficers] = useState<DisplayOfficer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!meta) {
      setLoading(false);
      return;
    }

    const isCouncil = slug === "council";

    const fetchLive = async () => {
      const raw = await officerService.getPublicOfficers(
        isCouncil ? "executive" : meta.title,
      );
      return (raw || []).map((o: any) => {
        if (isCouncil) {
          const { position, role } = splitCouncilPosition(
            o.councilPosition || o.position || "",
            o.councilYearLevel ?? o.yearLevel,
          );
          return {
            position,
            role,
            name: formatOfficerName(o.firstName, o.lastName, o.middleName),
            image: o.profilePicture || "/content/faculty.png",
          };
        }
        return {
          position: o.committeeTitle || o.position || "",
          name: formatOfficerName(o.firstName, o.lastName, o.middleName),
          image: o.profilePicture || "/content/faculty.png",
        };
      });
    };

    const fetchArchived = async () => {
      const response = await officerTermService.getOfficerTerms({
        year: year || undefined,
        departmentType: isCouncil ? "executive" : "committee",
        committeeName: isCouncil ? undefined : meta.title,
      });
      const data = Array.isArray(response.data) ? response.data : [];
      return data.map((t: any) => ({
        position: t.position,
        role: t.role || undefined,
        // Manually-entered archive rows are already typed as "Last, First" —
        // just normalize the casing rather than reordering them.
        name: toTitleCase(t.name),
        image: t.image || "/content/faculty.png",
      }));
    };

    setLoading(true);
    (year ? fetchArchived() : fetchLive())
      .then(setOfficers)
      .catch((error) => {
        setOfficers([]);
      })
      .finally(() => setLoading(false));
  }, [slug, year, meta]);

  if (!meta) {
    return (
      <div className="min-h-screen bg-[#004e89] flex flex-col relative overflow-x-hidden">
        <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden grow">
          <Grid />
          <Header />
          <div className="grow flex flex-col items-center justify-center pt-38 pb-32">
            <h1 className="text-3xl font-bold text-gray-800 font-rubik">
              Department Not Found
            </h1>
            <button
              onClick={() => router.back()}
              className="mt-4 text-primary1 underline font-raleway cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </main>
        <div className="-mt-8.75 md:-mt-20 relative z-0">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#004e89] flex flex-col relative overflow-x-hidden">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden grow">
        {/* Background Grid */}
        <Grid />

        <div className="absolute -top-40 -left-60 w-140 h-140 bg-primary1/10 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute top-1/4 -right-72 w-140 h-140 bg-secondary2/10 rounded-full filter blur-3xl opacity-60"></div>

        <div className="relative z-10 flex flex-col">
          <Header />

          <div className="w-full max-w-7xl mx-auto px-6 pt-38">
            {/* back */}
            <div className="mb-8 flex justify-start">
              <BackButton onClick={() => router.back()} title="Go Back" />
            </div>

            {/* header */}
            <div className="mb-16 text-left">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight">
                  {meta.title}
                </h1>
                {year && (
                  <span className="inline-flex items-center rounded-full bg-primary1/10 px-3 py-1 font-raleway text-sm font-semibold text-primary1">
                    A.Y. {year}
                  </span>
                )}
              </div>

              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
                {meta.description}
              </p>
            </div>

            {/* officers */}
            <div className="w-full mb-24">
              {loading ? (
                <LoadingIndicator label="Loading officers..." className="py-16" />
              ) : officers.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-gray-400 font-raleway text-lg">
                    {year
                      ? `No archived officers found for A.Y. ${year}.`
                      : "No officers have been assigned to this department yet."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 justify-items-center">
                  {officers.map((officer) => (
                    <OfficerCard
                      key={`${officer.position}|${officer.role ?? ""}|${officer.name}`}
                      position={officer.position}
                      role={officer.role}
                      name={officer.name}
                      image={officer.image}
                      gradient={meta.gradient}
                      shadow={meta.shadow}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="h-20 md:h-32" />
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
};

export default OfficersPage;
