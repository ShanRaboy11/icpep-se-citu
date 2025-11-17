"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import InfoSection from "./sections/info";
import AdvisorsSection from "./sections/advisors";

import { FC } from "react";
import { ChevronRight } from "lucide-react";

// --- COMPONENT FOR INDIVIDUAL CARD ---
interface YearCardProps {
  termData: { term: string };
}

const YearCard: FC<YearCardProps> = ({ termData }) => {
  return (
    <div className="h-72">
      <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary3 to-secondary1 shadow-2xl flex items-center justify-center overflow-hidden">
        <button
          className="absolute top-8 left-8 h-16 w-16 border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:backdrop-blur-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
          aria-label={`View officers for ${termData.term}`}
        >
          <ChevronRight size={32} />
        </button>
        <h3
          // MOD: Changed back to an outline style.
          // - Made the text transparent again.
          // - Used a bolder 2px outline.
          // - Set the outline color to your theme's 'secondary2'.
          className="absolute -bottom-6 -right-8 font-rubik font-black text-[13rem] leading-none text-transparent select-none [-webkit-text-stroke:2px_theme(colors.secondary2)]"
          aria-hidden="true"
        >
          {termData.term.slice(-4)}
        </h3>
      </div>
    </div>
  );
};

// --- COMPONENT FOR FACULTY PROFILE CARD (LOCAL TO THIS PAGE) ---
interface ProfileCardProps {
  name: string;
  position: string;
  imageUrl: string;
}

const ProfileCard: FC<ProfileCardProps> = ({ name, position, imageUrl }) => {
  return (
    <div className="text-center group">
      <div className="relative inline-block">
        <div className="w-40 h-40 rounded-2xl bg-gray-100 p-2">
          <img
            src={imageUrl}
            alt={`Profile of ${name}`}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
      <h3 className="font-rubik font-bold text-primary3 mt-4 text-lg">
        {name}
      </h3>
      <p className="font-raleway text-gray-500 text-sm">{position}</p>
    </div>
  );
};

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

          <section className="mt-40">
            <div className="w-full max-w-7xl mx-auto px-6 text-center">
              <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-4">
                Our Student Leaders
              </h2>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-16">
                A legacy of leadership upheld by the councils and committees
                whose commitment continues to inspire our chapter’s journey.
              </p>
            </div>

            <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {officerHistory.map((termData) => (
                <YearCard key={termData.term} termData={termData} />
              ))}
            </div>
          </section>

          {/* ... Your unchanged bottom section ... */}
          <div className="w-full max-w-7xl mx-auto px-6 pb-24">
            <section className="mt-40">
              <h2 className="font-rubik text-3xl sm:text-4xl font-bold text-primary3 text-center mb-4">
                CPE Department Faculty
              </h2>
              <p className="font-raleway text-gray-600 text-center max-w-2xl mx-auto mb-16">
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
