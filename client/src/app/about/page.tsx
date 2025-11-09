// app/about/page.tsx
"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import InfoSection from "./components/info";
import Timeline from "./components/timeline";
import OfficerTermCard from "./components/term-card";
import ProfileCard from "./components/profile-card";
import { FC } from "react";

// --- MOCK DATA (Replace with your actual data) ---

const facultyHistory = [
  {
    year: "2022 - Present",
    name: "Dr. Jane Doe",
    position: "CPE Department Head",
    imageUrl: "/gle.png",
  },
  {
    year: "2020 - 2022",
    name: "Engr. John Smith",
    position: "CPE Department Head",
    imageUrl: "/gle.png",
  },
  {
    year: "2021 - Present",
    name: "Prof. Emily White",
    position: "ICPEP.SE Adviser",
    imageUrl: "/gle.png",
  },
];

const officerHistory = [
  {
    term: "A.Y. 2023 - 2024",
    council: [
      {
        name: "Juan Dela Cruz",
        position: "President",
        imageUrl: "/gle.png",
      },
      {
        name: "Maria Clara",
        position: "Vice President",
        imageUrl: "/gle.png",
      },
      {
        name: "Crisostomo Ibarra",
        position: "Secretary",
        imageUrl: "/gle.png",
      },
    ],
    committees: [
      {
        name: "Pedro Penduko",
        position: "Creatives Committee Head",
        imageUrl: "/gle.png",
      },
      {
        name: "Darna",
        position: "Events Committee Head",
        imageUrl: "/gle.png",
      },
      {
        name: "Captain Barbell",
        position: "Logistics Committee Head",
        imageUrl: "/gle.png",
      },
    ],
  },
];

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
  // --- MODIFICATION: Removed useRef and mouse event handlers ---
  const pillText = "About Our Chapter";
  const title = "The ICpEP SE CIT-U Story";
  const subtitle =
    "Get to know our mission, values, and the dedicated individuals who bring ICPEP SE CIT-U Chapter to life and carry its legacy forward.";

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24 flex-grow">
          {/* --- MODIFICATION START: Header now matches the 'Developers' page style --- */}
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
          {/* --- MODIFICATION END --- */}

          {/* Section 1: Org Info */}
          <InfoSection />

          {/* Section 2: Org Faculty Profiles */}
          <section className="mt-24">
            <h2 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 text-center mb-12">
              Guiding Leadership
            </h2>
            <Timeline items={facultyHistory} />
          </section>

          {/* Section 3: Org Officers Profiles */}
          <section className="mt-24">
            <h2 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 text-center mb-4">
              Our Student Leaders
            </h2>
            <p className="font-raleway text-gray-600 text-center max-w-2xl mx-auto mb-16">
              Meet the passionate and driven officers leading our chapter,
              fostering innovation and community among students.
            </p>
            <div className="space-y-20">
              {officerHistory.map((termData) => (
                <OfficerTermCard key={termData.term} {...termData} />
              ))}
            </div>
          </section>

          {/* Section 4: CPE Dept Faculty Profiles */}
          <section className="mt-24">
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
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
