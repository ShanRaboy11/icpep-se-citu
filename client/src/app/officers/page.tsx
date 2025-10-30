"use client";

import { useRouter } from "next/navigation";
import React from "react";
import OfficerCard1 from "../components/cards/officercard1";
import OfficerCard2 from "../components/cards/officercard2";
import OfficerCard3 from "../components/cards/officercard3";
import Header from "../components/header";
import Footer from "../components/footer";
import { ArrowLeft } from "lucide-react";

const councilOfficers = [
  { position: "PRESIDENT", role: "", lastName: "Dela Cruz", firstName: "Juan" },
  {
    position: "VICE PRESIDENT",
    role: "INTERNAL",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },

  {
    position: "VICE PRESIDENT",
    role: "EXTERNAL",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },
  { position: "TREASURER", role: "", lastName: "Dela Cruz", firstName: "Juan" },
  { position: "SECRETARY", role: "", lastName: "Dela Cruz", firstName: "Juan" },
  { position: "AUDITOR", role: "", lastName: "Dela Cruz", firstName: "Juan" },
  { position: "PRO", role: "", lastName: "Dela Cruz", firstName: "Juan" },
  { position: "PIO", role: "", lastName: "Dela Cruz", firstName: "Juan" },
];

const ssgRepresentatives = [
  {
    position: "SSG",
    role: "REPRESENTATIVE",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },
  {
    position: "SSG",
    role: "REPRESENTATIVE",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },
];

const yearLevelReps = [
  {
    position: "1ST YEAR",
    role: "REPRESENTATIVE",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },
  {
    position: "2ND YEAR",
    role: "REPRESENTATIVE",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },
  {
    position: "3RD YEAR",
    role: "REPRESENTATIVE",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },
  {
    position: "4TH YEAR",
    role: "REPRESENTATIVE",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },
  {
    position: "1ST YEAR",
    role: "REPRESENTATIVE",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },
  {
    position: "2ND YEAR",
    role: "REPRESENTATIVE",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },
  {
    position: "3RD YEAR",
    role: "REPRESENTATIVE",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },
  {
    position: "4TH YEAR",
    role: "REPRESENTATIVE",
    lastName: "Dela Cruz",
    firstName: "Juan",
  },
];

const OfficersPage = () => {
  const router = useRouter();
  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      {/* Title Section */}

      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12">
        <div className="mb-8 flex justify-start">
          <button
            onClick={handleBackToHome}
            title="Back to About Us"
            className="relative flex h-12 w-12 cursor-pointer items-center justify-center 
                         rounded-full border-2 border-primary1 text-primary1 
                         overflow-hidden transition-all duration-300 ease-in-out 
                         active:scale-95 before:absolute before:inset-0 
                         before:bg-gradient-to-r before:from-transparent 
                         before:via-white/40 before:to-transparent 
                         before:translate-x-[-100%] hover:before:translate-x-[100%] 
                         before:transition-transform before:duration-700"
          >
            <ArrowLeft className="h-6 w-6 animate-nudge-left translate-x-[2px]" />
          </button>
        </div>
        <div className="text-center mb-20 max-w-4xl mx-auto flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase font-rubik text-gray-900">
            The 6th Administration
          </h1>
          <p className="mt-4 text-lg text-gray-700 font-raleway">
            A team of student leaders dedicated to serving, inspiring, and
            leading our organization toward growth and innovation.
          </p>
        </div>

        {/* Council Officers Section */}
        <div className="w-full max-w-7xl">
          <h2 className="text-3xl md:text-5xl sm:mx-15 font-bold font-rubik mb-5 text-black">
            Council Officers
          </h2>
          <p className="text-gray-700 mb-18 sm:mx-15 sm:text-lg font-raleway">
            Meet the key officers leading the 6th Administration — dedicated
            student leaders ensuring the organization’s smooth operations,
            innovation, and growth throughout the academic year.
          </p>

          {/* Officers Grid */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {councilOfficers
              .slice(0, 3)
              .map((officer, index) =>
                officer.position === "VICE PRESIDENT" ? (
                  <OfficerCard2
                    key={index}
                    position={officer.position}
                    role={officer.role}
                    lastName={officer.lastName}
                    firstName={officer.firstName}
                    image="/officer.svg"
                  />
                ) : (
                  <OfficerCard1
                    key={index}
                    position={officer.position}
                    role={officer.role}
                    lastName={officer.lastName}
                    firstName={officer.firstName}
                    image="/officer.svg"
                  />
                )
              )}
          </div>

          {/* Row 2 – 3 cards (Treasurer, Secretary, Auditor) */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {councilOfficers.slice(3, 6).map((officer, index) => (
              <OfficerCard1
                key={index}
                position={officer.position}
                role={officer.role}
                lastName={officer.lastName}
                firstName={officer.firstName}
                image="/officer.svg"
              />
            ))}
          </div>

          {/* Row 3 – 2 cards centered (PRO, PIO) */}
          <div className="flex flex-wrap justify-center gap-8">
            {councilOfficers.slice(6, 8).map((officer, index) => (
              <OfficerCard1
                key={index}
                position={officer.position}
                role={officer.role}
                lastName={officer.lastName}
                firstName={officer.firstName}
                image="/officer.svg"
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-7xl sm:text-left text-center mt-30 mb-20">
          <h2 className="text-3xl md:text-5xl sm:mx-15 font-bold font-rubik mb-5 text-black">
            Representatives
          </h2>
          <p className="text-gray-700 mb-18 sm:mx-15 sm:text-lg font-raleway">
            Meet the representatives of the 6th Administration — student leaders
            who bridge communication between the council and the student body,
            ensuring participation and representation across all year levels.
          </p>

          {/* SSG Representatives */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {ssgRepresentatives.map((rep, index) => (
              <OfficerCard2
                key={index}
                position={rep.position}
                role={rep.role}
                lastName={rep.lastName}
                firstName={rep.firstName}
                image="/officer.svg"
              />
            ))}
          </div>

          {/* Year-Level Representatives */}
          <div
            className="sm:mx-15 grid gap-8 justify-items-center
                        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {yearLevelReps.map((rep, index) => (
              <OfficerCard3
                key={index}
                position={rep.position}
                role={rep.role}
                lastName={rep.lastName}
                firstName={rep.firstName}
                image="/officer.svg"
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
};

export default OfficersPage;
