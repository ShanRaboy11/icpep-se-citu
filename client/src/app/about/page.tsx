"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import InfoSection from "./sections/info";
import AdvisorsSection from "./sections/advisors";
import StudentLeadersSection from "./sections/student-leaders";
import FacultySection from "./sections/faculty"; // MOD: Import the new component

import { FC } from "react";

// MOD: ProfileCard component is now inside FacultySection.tsx, so it's removed from here.

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

// MOD: Added more faculty members to demonstrate the new layout
const departmentFaculty: FacultyMember[] = [
  {
    name: "Engr. Roel P. Lauron",
    position: "Department Head",
    imageUrl: "/gle.png", // Replace with actual image path
  },
  {
    name: "Dr. Jane Doe",
    position: "Professor, Embedded Systems",
    imageUrl: "/gle.png", // Replace with actual image path
  },
  {
    name: "Engr. John Smith",
    position: "Assoc. Professor, Networking",
    imageUrl: "/gle.png", // Replace with actual image path
  },
  {
    name: "Dr. Emily White",
    position: "Professor, VLSI Design",
    imageUrl: "/gle.png", // Replace with actual image path
  },
  {
    name: "Engr. Michael Brown",
    position: "Instructor, IoT",
    imageUrl: "/gle.png", // Replace with actual image path
  },
  {
    name: "Dr. Sarah Green",
    position: "Professor, Signal Processing",
    imageUrl: "/gle.png", // Replace with actual image path
  },
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
          {/* Top Section */}
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

          {/* MOD: Replaced the old faculty section with the new component */}
          <FacultySection faculty={departmentFaculty} />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
