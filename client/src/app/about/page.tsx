"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import InfoSection from "./sections/info";
import AdvisorsSection from "./sections/advisors";
import StudentLeadersSection from "./sections/student-leaders";
import ProfileCard from "./components/profile-card"; // MOD: Import the new component

import { FC } from "react";

// --- COMPONENT FOR FACULTY PROFILE CARD (LOCAL TO THIS PAGE) ---
// MOD: The ProfileCard component has been moved to its own file.

// --- DATA DEFINITIONS ---
interface OfficerTerm {
  term: string;
}
interface FacultyMember {
  name: string;
  position: string;
  imageUrl: string;
}

const officerHistory: OfficerTerm[] = [
  { term: "A.Y. 2024 - 2025" },
  { term: "A.Y. 2023 - 2024" },
  { term: "A.Y. 2022 - 2023" },
  { term: "A.Y. 2021 - 2022" },
  { term: "A.Y. 2020 - 2021" },
  { term: "A.Y. 2020 - 2020" },
];

const departmentFaculty: FacultyMember[] = [
  {
    name: "Dr. Richard Roe",
    position: "Professor, AI & Machine Learning",
    imageUrl: "/gle.png",
  },
  // ... other faculty
];

// --- MAIN PAGE COMPONENT ---
const AboutPage: FC = () => {
  const pillText = "About Our Chapter";
  const title = "The ICpEP SE CIT-U Story";
  const subtitle =
    "Get to know our mission, values, and the dedicated individuals who bring ICPEP SE CIT-U Chapter to life and carry its legacy forward.";

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          {/* ... Your unchanged top section ... */}
          <div className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem]">
            <div className="mb-20 text-center">
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
            <InfoSection />
          </div>

          <AdvisorsSection />

          <StudentLeadersSection history={officerHistory} />

          {/* ... Your unchanged bottom section ... */}
          <div className="w-full max-w-7xl mx-auto px-6 pb-24">
            <section className="mt-48">
              <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 text-center mb-4">
                CPE Department Faculty
              </h2>
              <p className="font-raleway text-gray-600 text-center text-base sm:text-lg max-w-3xl mx-auto mb-16">
                The esteemed faculty members of the Computer Engineering
                department who mentor and inspire the next generation.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                {departmentFaculty.map((faculty) => (
                  <ProfileCard key={faculty.name} {...faculty} />
                ))}
              </div>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
