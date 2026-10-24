"use client";

import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Grid from "../components/layout/grid";
import InfoSection from "../components/about/sections/info";
import AdvisorsSection from "../components/about/sections/advisors";
import StudentLeadersSection from "../components/about/sections/student-leaders";
import FacultySection from "../components/about/sections/faculty";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import BackButton from "../components/ui/back-button";
import PageHeader from "../components/ui/page-header";
import facultyService from "../services/faculty";
import officerTermService from "../services/officer-term";
import { getCurrentAcademicYear } from "../utils/academic-year";
import { toTitleCase } from "../utils/officers/format-name";
import { placeholderPhoto } from "@/app/utils/placeholder-photo";

interface OfficerTerm {
  term: string;
  href: string;
}
interface FacultyMember {
  name: string;
  position: string;
  imageUrl: string;
}

const AboutPage: FC = () => {
  const router = useRouter();
  const [departmentFaculty, setDepartmentFaculty] = useState<FacultyMember[]>(
    [],
  );
  const [officerHistory, setOfficerHistory] = useState<OfficerTerm[]>([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await facultyService.getFaculty();
        const data = Array.isArray(response.data) ? response.data : [];
        setDepartmentFaculty(
          data.map((f: any) => ({
            name: toTitleCase(f.name),
            position: f.position,
            imageUrl: f.image || placeholderPhoto(f.name, f.gender),
          })),
        );
      } catch {
      }
    };
    fetchFaculty();

    const fetchYears = async () => {
      try {
        const response = await officerTermService.getYears();
        const years: string[] = Array.isArray(response.data)
          ? response.data
          : [];
        const currentYear = getCurrentAcademicYear();

        const cards: OfficerTerm[] = [
          { term: `A.Y. ${currentYear}`, href: "/officers" },
        ];
        years
          .filter((y) => y !== currentYear)
          .forEach((y) => {
            cards.push({
              term: `A.Y. ${y}`,
              href: `/officers?year=${encodeURIComponent(y)}`,
            });
          });
        setOfficerHistory(cards);
      } catch {
        setOfficerHistory([
          { term: `A.Y. ${getCurrentAcademicYear()}`, href: "/officers" },
        ]);
      }
    };
    fetchYears();
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-pageblue">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col">
          <Header />

          <div className="w-full max-w-7xl mx-auto px-6 pt-38">
            <div className="mb-8 flex justify-start">
              <BackButton
                onClick={() => router.push("/")}
                title="Back to Home"
                icon={Home}
              />
            </div>

            <PageHeader
              className="mb-20 text-center"
              badge="About Our Chapter"
              title="The ICpEP SE CIT-U Story"
              subtitleClassName="max-w-3xl"
              subtitle={
                <>
                  Get to know our mission, values, and the dedicated
                  individuals who bring ICPEP SE CIT-U Chapter to life.
                </>
              }
            />

            <InfoSection />
          </div>

          <AdvisorsSection />
          <StudentLeadersSection history={officerHistory} />
          <FacultySection faculty={departmentFaculty} />

          <div className="h-20 md:h-32" />
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
