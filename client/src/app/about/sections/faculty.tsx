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
    <div className="flex flex-col items-center text-center relative group cursor-default">
      {/* Decorative background glow for the head */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary1/20 blur-[60px] rounded-full -z-10 transition-all duration-500 group-hover:bg-primary1/30"></div>

      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary1 to-primary3 blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

        {/* Image Container */}
        <div className="relative w-44 h-44 rounded-full border-4 border-white shadow-xl overflow-hidden">
          <img
            src={imageUrl}
            alt={`Profile of ${name}`}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
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
    <div className="group relative w-full flex flex-col items-center bg-white rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 ease-in-out hover:shadow-primary1/40 hover:-translate-y-1 overflow-hidden p-8">
      {/* Image Section Wrapper */}
      {/* We keep the image and the rings in this relative container so they stay perfectly aligned */}
      <div className="relative mb-6 flex justify-center items-center">
        {/* --- TEXTURE: RIPPLES / CONNECTED RINGS --- */}
        {/* These are absolute to the image wrapper center, ensuring perfect alignment */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 flex items-center justify-center pointer-events-none">
          {/* Ring 1 (Immediate neighbor to photo) */}
          <div className="absolute w-[180px] h-[180px] rounded-full border border-gray-100 opacity-100"></div>

          {/* Ring 2 */}
          <div className="absolute w-[240px] h-[240px] rounded-full border border-gray-100 opacity-80"></div>

          {/* Ring 3 */}
          <div className="absolute w-[300px] h-[300px] rounded-full border border-gray-50 opacity-60"></div>

          {/* Ring 4 (Fades out into the card edges) */}
          <div className="absolute w-[360px] h-[360px] rounded-full border border-gray-50 opacity-40"></div>
        </div>

        {/* Glow Effect (Behind Frame) */}
        <div className="absolute inset-0 bg-primary1/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110 pointer-events-none"></div>

        {/* The Physical Photo Frame */}
        <div className="relative w-36 h-36 p-1.5 bg-white rounded-full border-2 border-primary1/40 shadow-sm z-10 group-hover:shadow-md group-hover:border-primary1 transition-all duration-300">
          <img
            src={imageUrl}
            alt={`Profile of ${name}`}
            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Text Section */}
      <div className="relative z-10 text-center">
        {/* Name */}
        <h4 className="font-rubik font-bold text-xl text-primary3 mb-2">
          {name}
        </h4>

        {/* Position */}
        <p className="font-raleway text-sm font-bold text-primary1 uppercase tracking-wider">
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
