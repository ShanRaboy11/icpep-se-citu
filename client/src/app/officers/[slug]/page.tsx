"use client";

import React, { FC } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Assuming these components exist based on your reference code
import Header from "../../components/header";
import Footer from "../../components/footer";
import Grid from "../../components/grid";

// --- 1. Interfaces & Types ---

interface Officer {
  position: string;
  role?: string;
  name: string;
  image?: string;
}

interface DepartmentData {
  title: string;
  description: string;
  gradient: string;
  shadow: string; // This will now hold the hover-specific shadow class
  officers: Officer[];
}

type DepartmentsMap = Record<string, DepartmentData>;

interface OfficerCardProps {
  position: string;
  role?: string;
  name: string;
  image?: string;
  gradient: string;
  shadow: string;
}

// --- 2. Reusable Officer Card Component ---

const OfficerCard: FC<OfficerCardProps> = ({
  position,
  role,
  name,
  image,
  gradient,
  shadow,
}) => {
  const nameParts = name.includes(",") ? name.split(",") : [name, ""];
  const lastName = nameParts[0].trim();
  const firstName = nameParts[1] ? nameParts[1].trim() : "";

  return (
    <div
      className={`
        relative w-full max-w-[280px] aspect-[3/4] 
        rounded-3xl
        shadow-lg 
        ${shadow} 
        group overflow-hidden isolate
        cursor-default
        transition-all duration-300 ease-out hover:scale-[1.02]
        flex flex-col
      `}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 ${gradient} transition-transform duration-1000 group-hover:scale-105`}
      />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Lighting Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none z-0" />

      {/* Glass Border */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none z-20" />

      {/* Content */}
      <div className="relative w-full h-full flex flex-col z-10">
        <div className="pt-6 px-4 z-20">
          <h2 className="font-rubik text-xl sm:text-2xl font-bold uppercase leading-tight tracking-tight text-white drop-shadow-md text-center">
            {position}
          </h2>
          {role && (
            <p className="font-rubik text-sm sm:text-base font-medium uppercase mt-1 opacity-90 tracking-widest text-white text-center">
              {role}
            </p>
          )}
        </div>

        {/* Middle Section containing Dome Background AND Image */}
        <div className="relative flex-grow mt-2 w-full">
          
          {/* 1. The Dome Shape - Background Layer */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-[90%] bg-white/20 rounded-t-full backdrop-blur-sm z-0" />

          {/* 2. The Person Image - Scaled slightly larger (140%) */}
          {image && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[110%] z-10">
              <Image
                src={image}
                alt={name}
                fill
                className="object-contain object-bottom drop-shadow-2xl"
              />
            </div>
          )}
        </div>

        {/* Name Section */}
        <div className="absolute bottom-6 left-6 text-left z-20">
          <h3 className="font-raleway text-2xl font-bold leading-none text-white drop-shadow-md">
            {lastName},
          </h3>
          <p className="font-raleway text-lg font-medium leading-tight opacity-90 text-white">
            {firstName || "Officer"}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 3. Data Definitions ---

const departments: DepartmentsMap = {
  council: {
    title: "Executive Council",
    description: "Leading the chapter with vision and integrity.",
    gradient: "bg-gradient-to-br from-blue-600 to-sky-400",
    shadow: "hover:shadow-blue-500/40", // FIXED: Changed from 'shadow-...' to 'hover:shadow-...'
    officers: [
      { position: "President", name: "Doe, John" },
      { position: "VP Internal", name: "Smith, Jane" },
      { position: "VP External", name: "Johnson, Michael" },
      { position: "Secretary", name: "Williams, Emily" },
      { position: "Treasurer", name: "Brown, Chris" },
      { position: "Auditor", name: "Davis, Sarah" },
      { position: "PIO", name: "Miller, David" },
      { position: "PRO", name: "Wilson, Jessica" },
      { position: "SSG", role: "Representative", name: "Moore, Daniel" },
      { position: "SSG", role: "Representative", name: "Taylor, Laura" },
      {
        position: "1st Year",
        role: "Batch Representative",
        name: "Anderson, Thomas",
      },
      {
        position: "1st Year",
        role: "Batch Representative",
        name: "Thomas, Lisa",
      },
      {
        position: "2nd Year",
        role: "Batch Representative",
        name: "Jackson, Paul",
      },
      {
        position: "2nd Year",
        role: "Batch Representative",
        name: "White, Kevin",
      },
      {
        position: "3rd Year",
        role: "Batch Representative",
        name: "Harris, Nancy",
      },
      {
        position: "3rd Year",
        role: "Batch Representative",
        name: "Martin, Karen",
      },
      {
        position: "4th Year",
        role: "Batch Representative",
        name: "Thompson, Brian",
      },
      {
        position: "4th Year",
        role: "Batch Representative",
        name: "Garcia, Betty",
      },
    ],
  },
  "internal-affairs": {
    title: "Committee on Internal Affairs",
    description: "Maintaining harmony and order within the organization.",
    gradient: "bg-gradient-to-br from-[#00A7EE] to-blue-600",
    shadow: "hover:shadow-sky-500/40",
    officers: [
      { position: "Committee Head", name: "Roberts, Alex" },
      { position: "Assistant Head", name: "Clark, Ryan" },
      { position: "Secretary", name: "Lewis, Anna" },
      { position: "Member", name: "Walker, Steve" },
      { position: "Member", name: "Hall, Christina" },
    ],
  },
  "external-affairs": {
    title: "Committee on External Affairs",
    description: "Building bridges with other organizations and partners.",
    gradient: "bg-gradient-to-br from-[#9333ea] to-purple-900",
    shadow: "hover:shadow-purple-500/40",
    officers: [
      { position: "Committee Head", name: "Allen, Patrick" },
      { position: "Assistant Head", name: "Young, Joseph" },
      { position: "Secretary", name: "Hernandez, Maria" },
      { position: "Member", name: "King, Charles" },
      { position: "Member", name: "Wright, Scott" },
    ],
  },
  finance: {
    title: "Committee on Finance",
    description: "Ensuring transparency and sustainability of funds.",
    gradient: "bg-gradient-to-br from-[#ca8a04] to-yellow-600",
    shadow: "hover:shadow-yellow-500/40",
    officers: [
      { position: "Committee Head", name: "Lopez, Amy" },
      { position: "Assistant Head", name: "Hill, Gregory" },
      { position: "Secretary", name: "Scott, Larry" },
      { position: "Member", name: "Green, Rachel" },
      { position: "Member", name: "Adams, Samuel" },
    ],
  },
  "public-relations": {
    title: "Committee on Public Relations",
    description: "Managing the image and communication of the chapter.",
    gradient: "bg-gradient-to-br from-[#ea580c] to-red-600",
    shadow: "hover:shadow-orange-500/40",
    officers: [
      { position: "Committee Head", name: "Baker, Michelle" },
      { position: "Assistant Head", name: "Gonzalez, Carlos" },
      { position: "Secretary", name: "Nelson, Amanda" },
      { position: "Member", name: "Carter, Joshua" },
    ],
  },
  "research-and-development": {
    title: "Research & Development Committee",
    description: "Innovating and improving chapter processes.",
    gradient: "bg-gradient-to-br from-[#2563eb] to-indigo-800",
    shadow: "hover:shadow-indigo-500/40",
    officers: [
      { position: "Committee Head", name: "Mitchell, Stephanie" },
      { position: "Assistant Head", name: "Perez, Brandon" },
      { position: "Secretary", name: "Roberts, Justin" },
      { position: "Member", name: "Turner, Melissa" },
      { position: "Member", name: "Phillips, Jonathan" },
    ],
  },
  "training-and-seminar": {
    title: "Training & Seminar Committee",
    description: "Empowering members through knowledge and skills.",
    gradient: "bg-gradient-to-br from-[#16a34a] to-green-800",
    shadow: "hover:shadow-green-500/40",
    officers: [
      { position: "Committee Head", name: "Campbell, Sharon" },
      { position: "Assistant Head", name: "Parker, Nicholas" },
      { position: "Secretary", name: "Evans, Katherine" },
      { position: "Member", name: "Edwards, Matthew" },
    ],
  },
  "sports-and-cultural": {
    title: "Sports & Cultural Committee",
    description: "Promoting camaraderie through holistic activities.",
    gradient: "bg-gradient-to-br from-[#dc2626] to-red-900",
    shadow: "hover:shadow-red-500/40",
    officers: [
      { position: "Committee Head", name: "Collins, Christopher" },
      { position: "Assistant Head", name: "Stewart, Cynthia" },
      { position: "Secretary", name: "Sanchez, Javier" },
      { position: "Member", name: "Morris, Ashley" },
      { position: "Member", name: "Rogers, Jeremy" },
      { position: "Member", name: "Reed, Tiffany" },
    ],
  },
  "media-and-documentation": {
    title: "Media & Documentation Committee",
    description: "Capturing moments and creating visual identity.",
    gradient: "bg-gradient-to-br from-[#4f46e5] to-indigo-900",
    shadow: "hover:shadow-indigo-500/40",
    officers: [
      { position: "Committee Head", name: "Cook, Douglas" },
      { position: "Assistant Head", name: "Morgan, Elizabeth" },
      { position: "Secretary", name: "Bell, Benjamin" },
      { position: "Member", name: "Murphy, Samantha" },
      { position: "Member", name: "Bailey, Andrew" },
    ],
  },
};

// --- 4. Main Page Component ---

const OfficersPage = () => {
  const params = useParams();
  const router = useRouter();

  const slug =
    (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) || "";
  const data = departments[slug];

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
        <Grid />
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center pt-[9.5rem]">
          <h1 className="text-3xl font-bold text-gray-800 font-rubik">
            Department Not Found
          </h1>
          <button
            onClick={() => router.back()}
            className="mt-4 text-primary1 underline font-raleway"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Background Grid */}
      <Grid />

      {/* Decorative Blobs */}
      <div className="absolute top-[-10rem] left-[-15rem] w-[35rem] h-[35rem] bg-primary1/10 rounded-full filter blur-3xl opacity-60"></div>
      <div className="absolute top-1/4 right-[-18rem] w-[35rem] h-[35rem] bg-secondary2/10 rounded-full filter blur-3xl opacity-60"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24">
          {/* Back Button */}
          <div className="mb-8 flex justify-start">
            <button
              onClick={() => router.back()}
              title="Back to Selection"
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

          {/* Header Section (Aligned Left) */}
          <div className="mb-16 text-left">
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              {data.title}
            </h1>

            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
              {data.description}
            </p>
          </div>

          {/* Officers Grid */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {data.officers.map((officer, index) => (
                <OfficerCard
                  key={index}
                  position={officer.position}
                  role={officer.role}
                  name={officer.name}
                  image="/faculty.png"
                  gradient={data.gradient}
                  shadow={data.shadow}
                />
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default OfficersPage;