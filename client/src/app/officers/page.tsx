"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import SelectionCard from "./components/selection-card";
import BackButton from "../components/back-button";
import PageHeader from "../components/page-header";
import { departments } from "./utils/officers";

const committeeData = Object.entries(departments)
  .filter(([slug]) => slug !== "council")
  .map(([slug, meta]) => ({ slug, ...meta }));

const OfficerSelectionPage: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const year = searchParams.get("year");
  const yearQuery = year ? `?year=${encodeURIComponent(year)}` : "";

  const pillText = year ? `A.Y. ${year}` : "Organizational Structure";
  const title = "Council & Committees";
  const subtitle = year
    ? `Browsing the officers and members who served during A.Y. ${year}.`
    : "Select a department to view the officers and members dedicated to serving our chapter.";

  return (
    <div className="min-h-screen bg-[#004e89] flex flex-col relative overflow-x-hidden">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden grow">
        <Grid />

        <div className="relative z-10 flex flex-col">
          <Header />

          <div className="w-full max-w-7xl mx-auto px-6 pt-38">
            <div className="mb-8 flex justify-start">
              <BackButton onClick={() => router.back()} title="Back to About" />
            </div>

            {/* header */}
            <PageHeader
              className="mb-16 text-center"
              badge={pillText}
              title={title}
              subtitleClassName="max-w-3xl"
              subtitle={subtitle}
            />

            <section className="w-full max-w-6xl mx-auto flex flex-col gap-8 mb-24">
              {/* council */}
              <div className="w-full">
                <SelectionCard
                  title="Executive Council"
                  gradient="bg-linear-to-br from-primary3 to-secondary1"
                  shadowColorClass="hover:shadow-primary3/40"
                  className="h-48 sm:h-80"
                  paddingClass="px-6 pt-12 sm:pt-8 pb-6"
                  onClick={() => router.push(`/officers/council${yearQuery}`)}
                />
              </div>

              {/* divider */}
              <div className="flex items-center gap-4 py-8">
                <div className="h-12 w-1.5 rounded-full bg-linear-to-b from-primary3 to-secondary1 shadow-sm"></div>
                <div className="flex flex-col">
                  <h2 className="text-2xl sm:text-3xl font-rubik font-bold text-primary3 tracking-tight">
                    Committees
                  </h2>
                  <span className="text-xs sm:text-sm font-raleway text-gray-600 font-medium">
                    Departmental Teams
                  </span>
                </div>
              </div>

              {/* committees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {committeeData.map((committee) => (
                  <SelectionCard
                    key={committee.slug}
                    title={committee.title}
                    gradient={committee.gradient}
                    shadowColorClass={committee.shadow}
                    onClick={() =>
                      router.push(`/officers/${committee.slug}${yearQuery}`)
                    }
                  />
                ))}
              </div>
            </section>
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

export default OfficerSelectionPage;
