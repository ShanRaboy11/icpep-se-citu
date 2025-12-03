"use client";

import { FC } from "react";

// --- TYPE DEFINITION ---
interface FacultyMember {
  name: string;
  position: string;
  imageUrl: string;
}

// --- CARD COMPONENT FOR THE DEPARTMENT HEAD ---
const DepartmentHeadCard: FC<FacultyMember> = ({
  name,
  position,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col items-center text-center relative group">
      {/* Decorative background glow for the head */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary1/20 blur-[60px] rounded-full -z-10"></div>

      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary1 to-primary3 blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
        <img
          src={imageUrl}
          alt={`Profile of ${name}`}
          className="relative w-44 h-44 object-cover rounded-full border-4 border-white shadow-xl"
        />
      </div>
      <h3 className="font-rubik text-3xl font-bold text-primary3 mb-2">
        {name}
      </h3>
      <span className="inline-block px-4 py-1.5 rounded-full bg-primary1/10 text-primary1 font-raleway font-bold text-sm tracking-wide">
        {position}
      </span>
    </div>
  );
};

// --- CARD COMPONENT FOR OTHER FACULTY MEMBERS ---
const FacultyMemberCard: FC<FacultyMember> = ({ name, position, imageUrl }) => {
  return (
    <div className="group relative w-full text-center bg-white border border-gray-100 p-8 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-primary1/40 hover:-translate-y-1 overflow-hidden">
      {/* Subtle top gradient decoration */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary1/5 to-transparent opacity-60"></div>

      <div className="relative z-10">
        <div className="relative mx-auto mb-5 w-32 h-32">
          <img
            src={imageUrl}
            alt={`Profile of ${name}`}
            className="w-full h-full object-cover rounded-full border-[3px] border-white shadow-md ring-1 ring-primary1/20 group-hover:ring-primary1/50 transition-all duration-300"
          />
        </div>

        <h4 className="font-rubik font-bold text-xl text-primary3 mb-2 leading-tight">
          {name}
        </h4>

        {/* Small decorative divider */}
        <div className="w-10 h-1 bg-primary1/20 mx-auto mb-3 rounded-full group-hover:w-16 group-hover:bg-primary1/40 transition-all duration-300"></div>

        <p className="font-raleway text-sm font-semibold text-gray-500 uppercase tracking-wide">
          {position}
        </p>
      </div>
    </div>
  );
};

// --- MAIN SECTION COMPONENT ---
interface FacultySectionProps {
  faculty: FacultyMember[];
}

const FacultySection: FC<FacultySectionProps> = ({ faculty }) => {
  // Assume the first person in the array is the department head
  const departmentHead = faculty[0];
  const otherFaculty = faculty.slice(1);

  return (
    <section className="mt-48">
      <div className="w-full max-w-7xl mx-auto px-6 pb-24">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-6">
            CPE Department Faculty
          </h2>
          <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            The esteemed faculty members of the Computer Engineering department
            who mentor and inspire the next generation.
          </p>
        </div>

        {/* Department Head Layout */}
        {departmentHead && (
          <div className="flex justify-center mb-20">
            <DepartmentHeadCard {...departmentHead} />
          </div>
        )}

        {/* Other Faculty Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {otherFaculty.map((member) => (
            <FacultyMemberCard key={member.name} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacultySection;
