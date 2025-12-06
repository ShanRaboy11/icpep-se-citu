"use client";

import React, { FC } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

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
  officers: Officer[];
}

type DepartmentsMap = Record<string, DepartmentData>;

interface OfficerCardProps {
  position: string;
  role?: string;
  name: string;
  image?: string;
  gradient: string;
}

// --- 2. Reusable Officer Card Component ---

const OfficerCard: FC<OfficerCardProps> = ({
  position,
  role,
  name,
  image,
  gradient,
}) => {
  const nameParts = name.includes(",") ? name.split(",") : [name, ""];
  const lastName = nameParts[0].trim();
  const firstName = nameParts[1] ? nameParts[1].trim() : "";

  return (
    <div
      className={`
        relative w-full max-w-[280px] aspect-[3/4] 
        ${gradient} 
        rounded-3xl text-white text-center 
        shadow-lg hover:shadow-2xl hover:-translate-y-2 
        transition-all duration-300 cursor-default overflow-hidden
        flex flex-col
      `}
    >
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` 
        }}
      />

      <div className="pt-6 px-4 z-10">
        <h2 className="font-rubik text-xl sm:text-2xl font-bold uppercase leading-tight tracking-tight drop-shadow-md">
          {position}
        </h2>
        {role && (
          <p className="font-rubik text-sm sm:text-base font-medium uppercase mt-1 opacity-90 tracking-widest">
            {role}
          </p>
        )}
      </div>

      <div className="relative flex-grow mt-2 z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-[90%]">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain object-bottom drop-shadow-xl"
            />
          ) : (
            <div className="w-full h-full bg-white/20 mask-image-gradient rounded-t-full backdrop-blur-sm" />
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 text-left z-20">
        <h3 className="font-raleway text-2xl font-bold leading-none drop-shadow-md">
          {lastName},
        </h3>
        <p className="font-raleway text-lg font-medium leading-tight opacity-90">
          {firstName || "Officer"}
        </p>
      </div>
    </div>
  );
};


// --- 3. Data Definitions ---

const departments: DepartmentsMap = {
  // --- EXECUTIVE COUNCIL (Specific Hierarchy) ---
  "council": {
    title: "Executive Council",
    description: "Leading the chapter with vision and integrity.",
    gradient: "bg-gradient-to-br from-blue-600 to-sky-400",
    officers: [
      { position: "President", name: "Doe, John" },
      { position: "VP Internal", name: "Smith, Jane" },
      { position: "VP External", name: "Johnson, Michael" },
      { position: "Secretary", name: "Williams, Emily" },
      { position: "Treasurer", name: "Brown, Chris" },
      { position: "Auditor", name: "Davis, Sarah" },
      { position: "P.I.O.", role: "Public Information", name: "Miller, David" },
      { position: "P.R.O.", role: "Public Relations", name: "Wilson, Jessica" },
      { position: "SSG Rep", role: "Representative", name: "Moore, Daniel" },
      { position: "SSG Rep", role: "Representative", name: "Taylor, Laura" },
      { position: "1st Year Rep", role: "Batch Representative", name: "Anderson, Thomas" },
      { position: "1st Year Rep", role: "Batch Representative", name: "Thomas, Lisa" },
      { position: "2nd Year Rep", role: "Batch Representative", name: "Jackson, Paul" },
      { position: "2nd Year Rep", role: "Batch Representative", name: "White, Kevin" },
      { position: "3rd Year Rep", role: "Batch Representative", name: "Harris, Nancy" },
      { position: "3rd Year Rep", role: "Batch Representative", name: "Martin, Karen" },
      { position: "4th Year Rep", role: "Batch Representative", name: "Thompson, Brian" },
      { position: "4th Year Rep", role: "Batch Representative", name: "Garcia, Betty" },
    ]
  },

  // --- COMMITTEES (Standardized Hierarchy) ---
  "internal-affairs": {
    title: "Committee on Internal Affairs",
    description: "Maintaining harmony and order within the organization.",
    gradient: "bg-gradient-to-br from-[#00A7EE] to-blue-600",
    officers: [
        { position: "Committee Head", name: "Roberts, Alex" },
        { position: "Assistant Head", name: "Clark, Ryan" },
        { position: "Secretary", name: "Lewis, Anna" },
        { position: "Member", name: "Walker, Steve" },
        { position: "Member", name: "Hall, Christina" },
    ]
  },
  "external-affairs": {
    title: "Committee on External Affairs",
    description: "Building bridges with other organizations and partners.",
    gradient: "bg-gradient-to-br from-[#9333ea] to-purple-900",
    officers: [
        { position: "Committee Head", name: "Allen, Patrick" },
        { position: "Assistant Head", name: "Young, Joseph" },
        { position: "Secretary", name: "Hernandez, Maria" },
        { position: "Member", name: "King, Charles" },
        { position: "Member", name: "Wright, Scott" },
    ]
  },
  "finance": {
    title: "Committee on Finance",
    description: "Ensuring transparency and sustainability of funds.",
    gradient: "bg-gradient-to-br from-[#ca8a04] to-yellow-600",
    officers: [
        { position: "Committee Head", name: "Lopez, Amy" },
        { position: "Assistant Head", name: "Hill, Gregory" },
        { position: "Secretary", name: "Scott, Larry" },
        { position: "Member", name: "Green, Rachel" },
        { position: "Member", name: "Adams, Samuel" },
    ]
  },
  "public-relations": {
    title: "Committee on Public Relations",
    description: "Managing the image and communication of the chapter.",
    gradient: "bg-gradient-to-br from-[#ea580c] to-red-600",
    officers: [
        { position: "Committee Head", name: "Baker, Michelle" },
        { position: "Assistant Head", name: "Gonzalez, Carlos" },
        { position: "Secretary", name: "Nelson, Amanda" },
        { position: "Member", name: "Carter, Joshua" },
    ]
  },
  "research-and-development": {
    title: "R&D Committee",
    description: "Innovating and improving chapter processes.",
    gradient: "bg-gradient-to-br from-[#2563eb] to-indigo-800",
    officers: [
        { position: "Committee Head", name: "Mitchell, Stephanie" },
        { position: "Assistant Head", name: "Perez, Brandon" },
        { position: "Secretary", name: "Roberts, Justin" },
        { position: "Member", name: "Turner, Melissa" },
        { position: "Member", name: "Phillips, Jonathan" },
    ]
  },
  "training-and-seminar": {
    title: "Training & Seminar Committee",
    description: "Empowering members through knowledge and skills.",
    gradient: "bg-gradient-to-br from-[#16a34a] to-green-800",
    officers: [
        { position: "Committee Head", name: "Campbell, Sharon" },
        { position: "Assistant Head", name: "Parker, Nicholas" },
        { position: "Secretary", name: "Evans, Katherine" },
        { position: "Member", name: "Edwards, Matthew" },
    ]
  },
  "sports-and-cultural": {
    title: "Sports & Cultural Committee",
    description: "Promoting camaraderie through holistic activities.",
    gradient: "bg-gradient-to-br from-[#dc2626] to-red-900",
    officers: [
        { position: "Committee Head", name: "Collins, Christopher" },
        { position: "Assistant Head", name: "Stewart, Cynthia" },
        { position: "Secretary", name: "Sanchez, Javier" },
        { position: "Member", name: "Morris, Ashley" },
        { position: "Member", name: "Rogers, Jeremy" },
        { position: "Member", name: "Reed, Tiffany" },
    ]
  },
  "media-and-documentation": {
    title: "Media & Documentation",
    description: "Capturing moments and creating visual identity.",
    gradient: "bg-gradient-to-br from-[#4f46e5] to-indigo-900",
    officers: [
        { position: "Committee Head", name: "Cook, Douglas" },
        { position: "Assistant Head", name: "Morgan, Elizabeth" },
        { position: "Secretary", name: "Bell, Benjamin" },
        { position: "Member", name: "Murphy, Samantha" },
        { position: "Member", name: "Bailey, Andrew" },
    ]
  },
};


// --- 4. Main Page Component ---

const OfficersPage = () => {
  const params = useParams();
  const router = useRouter();
  
  const slug = (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) || "";
  const data = departments[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
         <h1 className="text-3xl font-bold text-gray-800">Department Not Found</h1>
         <button onClick={() => router.back()} className="mt-4 text-blue-600 underline">
            Go Back
         </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 sm:pt-24">
        
        {/* Navigation & Header */}
        <div className="mb-12">
            <button 
                onClick={() => router.back()}
                className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 font-raleway font-medium"
            >
                <div className="p-2 rounded-full bg-white border border-gray-200 shadow-sm group-hover:shadow-md transition-all">
                    <ChevronLeft className="w-5 h-5" />
                </div>
                <span>Back to Selection</span>
            </button>

            <div className="flex flex-col gap-2">
                <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                    Department
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-rubik font-bold text-gray-900 leading-tight">
                    {data.title}
                </h1>
                <p className="text-lg text-gray-600 font-raleway max-w-2xl mt-2">
                    {data.description}
                </p>
            </div>
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
                        // Pass image URL here: image={officer.image}
                        gradient={data.gradient}
                    />
                ))}
            </div>
        </div>

      </main>
    </div>
  );
};

export default OfficersPage;