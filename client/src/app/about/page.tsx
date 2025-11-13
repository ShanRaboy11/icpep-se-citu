"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import InfoSection from "./sections/info";
import AdvisorsSection from "./sections/advisors";
import ProfileCard from "./components/profile-card";
import { FC } from "react";
import { ChevronRight } from "lucide-react";

// --- START: Student Leader Data ---
const officerHistory = [
  { term: "A.Y. 2023 - 2024" },
  { term: "A.Y. 2022 - 2023" },
  { term: "A.Y. 2021 - 2022" },
  { term: "A.Y. 2020 - 2021" },
];
// --- END: Student Leader Data ---

const departmentFaculty = [
  {
    name: "Dr. Richard Roe",
    position: "Professor, AI & Machine Learning",
    imageUrl: "/gle.png",
  },
  {
    name: "Engr. Susan Bones",
    position: "Instructor, Digital Logic Design",
    imageUrl: "/gle.png",
  },
  {
    name: "Prof. Peter Pan",
    position: "Lecturer, Embedded Systems",
    imageUrl: "/gle.png",
  },
  {
    name: "Dr. Wendy Darling",
    position: "Associate Professor, Networking",
    imageUrl: "/gle.png",
  },
];

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

          {/* --- START: Reworked Student Leaders Section --- */}
          <section className="mt-40">
            {/* Section Header */}
            <div className="w-full max-w-7xl mx-auto px-6 text-center">
              <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-4">
                Our Student Leaders
              </h2>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-16">
                A legacy of leadership upheld by the councils and committees
                whose commitment continues to inspire our chapter’s journey.
              </p>
            </div>

            {/* Stacking Scroll Container */}
            <div className="relative w-full max-w-4xl mx-auto px-6">
              {officerHistory.map((termData) => (
                <div key={termData.term} className="h-[50vh]">
                  <div className="sticky top-20 h-[45vh]">
                    <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary3 to-secondary1 shadow-2xl flex items-center justify-center overflow-hidden">
                      {/* --- MODIFIED: Button border width changed to 2px --- */}
                      <button
                        className="absolute top-8 left-8 h-16 w-16 border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:backdrop-blur-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
                        aria-label={`View officers for ${termData.term}`}
                      >
                        <ChevronRight size={32} />
                      </button>

                      <h3
                        className="absolute -bottom-8 -right-12 font-rubik font-black text-[14rem] sm:text-[18rem] leading-none text-transparent select-none [-webkit-text-stroke:2px_rgba(255,255,255,0.2)]"
                        aria-hidden="true"
                      >
                        {termData.term.slice(-4)}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* --- END: Reworked Student Leaders Section --- */}

          <div className="w-full max-w-7xl mx-auto px-6 pb-24">
            <section className="mt-40">
              <h2 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 text-center mb-4">
                CPE Department Faculty
              </h2>
              <p className="font-raleway text-gray-600 text-center max-w-2xl mx-auto mb-16">
                The esteemed faculty members of the Computer Engineering
                department who mentor and inspire the next generation.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
