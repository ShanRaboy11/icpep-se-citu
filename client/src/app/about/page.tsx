"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import InfoSection from "./sections/info";
import AdvisorsSection from "./sections/advisors";
import StudentLeadersSection from "./sections/student-leaders";
import FacultySection from "./sections/faculty";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

import { FC } from "react";

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
    name: "Engr. Roel P. Lauron",
    position: "Department Head",
    imageUrl: "/gle.png",
  },
  {
    name: "Dr. Jane Doe",
    position: "Professor, Embedded Systems",
    imageUrl: "/gle.png",
  },
  {
    name: "Engr. John Smith",
    position: "Assoc. Professor, Networking",
    imageUrl: "/gle.png",
  },
  {
    name: "Dr. Emily White",
    position: "Professor, VLSI Design",
    imageUrl: "/gle.png",
  },
  {
    name: "Engr. Michael Brown",
    position: "Instructor, IoT",
    imageUrl: "/gle.png",
  },
  {
    name: "Dr. Sarah Green",
    position: "Professor, Signal Processing",
    imageUrl: "/gle.png",
  },
];

const AboutPage: FC = () => {
  const router = useRouter();

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
          <div className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem]">
            <div className="mb-8 flex justify-start">
              <button
                onClick={() => router.push("/")}
                title="Back to Home"
                className="relative flex h-12 w-12 cursor-pointer items-center justify-center 
                         rounded-full border-2 border-primary1 text-primary1 
                         overflow-hidden transition-all duration-300 ease-in-out 
                         active:scale-95 before:absolute before:inset-0 
                         before:bg-gradient-to-r before:from-transparent 
                         before:via-white/40 before:to-transparent 
                         before:translate-x-[-100%] hover:before:translate-x-[100%] 
                         before:transition-transform before:duration-700"
              >
                <Home className="h-6 w-6" />
              </button>
            </div>

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

          <FacultySection faculty={departmentFaculty} />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;