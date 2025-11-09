// app/about/page.tsx
"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import InfoSection from "./components/info";
import Timeline from "./components/timeline";
import OfficerTermCard from "./components/term-card";
import ProfileCard from "./components/profile-card";
import { FC, useRef, type MouseEvent } from "react"; // <-- Import useRef and MouseEvent

// --- MOCK DATA (Replace with your actual data) ---

const facultyHistory = [
  {
    year: "2022 - Present",
    name: "Dr. Jane Doe",
    position: "CPE Department Head",
    imageUrl: "/placeholders/profile1.jpg",
  },
  {
    year: "2020 - 2022",
    name: "Engr. John Smith",
    position: "CPE Department Head",
    imageUrl: "/placeholders/profile2.jpg",
  },
  {
    year: "2021 - Present",
    name: "Prof. Emily White",
    position: "ICPEP.SE Adviser",
    imageUrl: "/placeholders/profile3.jpg",
  },
];

const officerHistory = [
  {
    term: "A.Y. 2023 - 2024",
    council: [
      {
        name: "Juan Dela Cruz",
        position: "President",
        imageUrl: "/placeholders/profile4.jpg",
      },
      {
        name: "Maria Clara",
        position: "Vice President",
        imageUrl: "/placeholders/profile5.jpg",
      },
      {
        name: "Crisostomo Ibarra",
        position: "Secretary",
        imageUrl: "/placeholders/profile6.jpg",
      },
    ],
    committees: [
      {
        name: "Pedro Penduko",
        position: "Creatives Committee Head",
        imageUrl: "/placeholders/profile7.jpg",
      },
      {
        name: "Darna",
        position: "Events Committee Head",
        imageUrl: "/placeholders/profile8.jpg",
      },
      {
        name: "Captain Barbell",
        position: "Logistics Committee Head",
        imageUrl: "/placeholders/profile9.jpg",
      },
    ],
  },
  // You can add another object here for A.Y. 2022-2023, etc.
];

const departmentFaculty = [
  {
    name: "Dr. Richard Roe",
    position: "Professor, AI & Machine Learning",
    imageUrl: "/placeholders/profile10.jpg",
  },
  {
    name: "Engr. Susan Bones",
    position: "Instructor, Digital Logic Design",
    imageUrl: "/placeholders/profile11.jpg",
  },
  {
    name: "Prof. Peter Pan",
    position: "Lecturer, Embedded Systems",
    imageUrl: "/placeholders/profile12.jpg",
  },
  {
    name: "Dr. Wendy Darling",
    position: "Associate Professor, Networking",
    imageUrl: "/placeholders/profile1.jpg",
  },
];

const AboutPage: FC = () => {
  // --- START: Integrated Page Header Logic ---
  const textRef = useRef<HTMLHeadingElement | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLHeadingElement>) => {
    const textElement = textRef.current;
    if (!textElement) return;
    const { left, top } = textElement.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    textElement.style.setProperty("--mouse-x", `${x}px`);
    textElement.style.setProperty("--mouse-y", `${y}px`);
    textElement.style.setProperty("--opacity", "1");
  };

  const handleMouseLeave = () => {
    const textElement = textRef.current;
    if (textElement) {
      textElement.style.setProperty("--opacity", "0");
    }
  };

  const pillText = "About Our Chapter";
  const title = "Forging the Future of Engineering";
  const subtitle =
    "Discover the mission, vision, and the dedicated individuals who drive the Institute of Computer Engineers of the Philippines, Student Edition at CIT-U.";
  // --- END: Integrated Page Header Logic ---

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24 flex-grow">
          {/* --- START: Integrated Page Header JSX --- */}
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                {pillText}
              </span>
            </div>
            <h1
              ref={textRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="font-rubik text-5xl md:text-7xl font-extrabold text-primary3 relative cursor-default"
              style={
                {
                  "--mouse-x": "50%",
                  "--mouse-y": "50%",
                  "--opacity": "0",
                } as React.CSSProperties
              }
            >
              <span
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  opacity: "var(--opacity)",
                  background:
                    "radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), #003599 0%, #04a6ef 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {title}
              </span>
              {title}
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mt-6">
              {subtitle}
            </p>
          </div>
          {/* --- END: Integrated Page Header JSX --- */}

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
